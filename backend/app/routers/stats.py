"""
User stats endpoints for dashboard and profile analytics.
"""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import Field
from sqlalchemy.orm import Session

from app import schemas
from app.config import get_db
from app.models import Achievement, Project, User, UserProgress
from app.utils.auth import get_current_user

router = APIRouter()


class StatisticsSchema(schemas.BaseModel):
    total_xp: int
    current_level: int
    projects_completed: int
    projects_total: int
    completion_rate: float
    total_hints_used: int
    average_hints_per_project: float
    badges_earned: int
    current_streak: int
    longest_streak: int
    last_completed_date: Optional[datetime] = None
    next_level_xp: int
    xp_to_next_level: int
    recent_completions: list = Field(default_factory=list)


@router.get("/me/stats", response_model=StatisticsSchema)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StatisticsSchema:
    progress_records = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).all()
    completed_projects = [p for p in progress_records if p.status == "completed"]

    total_projects = db.query(Project).count()
    completion_rate = (
        len(completed_projects) / total_projects * 100 if total_projects > 0 else 0
    )

    total_hints = sum(p.hints_used for p in progress_records)
    avg_hints = (total_hints / len(completed_projects)) if completed_projects else 0

    current_xp = current_user.xp
    current_level = current_user.level
    xp_per_level = 1000
    xp_to_next = xp_per_level - (current_xp % xp_per_level)
    next_level_xp = (current_level + 1) * xp_per_level

    recent = sorted(
        completed_projects,
        key=lambda x: x.completed_at or datetime.min,
        reverse=True,
    )[:5]
    recent_list = [
        {
            "project_id": p.project_id,
            "xp_earned": p.xp_earned,
            "completed_at": p.completed_at,
            "hints_used": p.hints_used,
        }
        for p in recent
    ]

    badges = db.query(Achievement).filter(Achievement.user_id == current_user.id).count()
    last_completed = max(
        (p.completed_at for p in completed_projects if p.completed_at), default=None
    )
    current_streak = (
        1 if last_completed and (datetime.utcnow() - last_completed).days <= 1 else 0
    )

    return StatisticsSchema(
        total_xp=current_xp,
        current_level=current_level,
        projects_completed=len(completed_projects),
        projects_total=total_projects,
        completion_rate=round(completion_rate, 2),
        total_hints_used=total_hints,
        average_hints_per_project=round(avg_hints, 2),
        badges_earned=badges,
        current_streak=current_streak,
        longest_streak=1,
        last_completed_date=last_completed,
        next_level_xp=next_level_xp,
        xp_to_next_level=xp_to_next,
        recent_completions=recent_list,
    )


@router.get("/{user_id}/public-stats")
def get_public_user_stats(user_id: int, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}

    completed = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.status == "completed",
    ).count()
    badges = db.query(Achievement).filter(Achievement.user_id == user_id).count()

    return {
        "username": user.username,
        "level": user.level,
        "xp": user.xp,
        "projects_completed": completed,
        "badges_earned": badges,
        "member_since": user.created_at,
    }


@router.get("/progress/by-difficulty")
def get_progress_by_difficulty(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.status == "completed",
    ).all()

    by_difficulty: dict[str, dict[str, int]] = {}
    for item in progress:
        project = db.query(Project).filter(Project.id == item.project_id).first()
        if not project:
            continue

        difficulty = project.difficulty
        if difficulty not in by_difficulty:
            by_difficulty[difficulty] = {"count": 0, "total_xp": 0}
        by_difficulty[difficulty]["count"] += 1
        by_difficulty[difficulty]["total_xp"] += item.xp_earned or 0

    return by_difficulty


@router.get("/badges/my-badges")
def get_user_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    badges = (
        db.query(Achievement)
        .filter(Achievement.user_id == current_user.id)
        .order_by(Achievement.earned_at.desc())
        .all()
    )

    return [
        {
            "badge_name": badge.badge_name,
            "badge_icon": badge.badge_icon,
            "earned_at": badge.earned_at,
            "description": BADGE_DESCRIPTIONS.get(
                badge.badge_name, "Achievement unlocked!"
            ),
        }
        for badge in badges
    ]


BADGE_DESCRIPTIONS = {
    "first_project": "Completed your first project",
    "five_projects": "Completed 5 projects",
    "ten_projects": "Completed 10 projects",
    "1000_xp": "Earned 1000 XP",
    "level_10": "Reached level 10",
    "perfect_score": "Perfect score on a project",
    "speedrun": "Completed project under 5 minutes",
    "no_hints": "Completed without using hints",
    "weekend_warrior": "Completed 3 projects in one day",
    "comeback_kid": "Returned after 7 days away",
}
