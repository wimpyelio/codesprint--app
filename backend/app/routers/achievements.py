"""
Achievement catalog and progress endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import get_db
from app.models import Achievement, User, UserProgress
from app.services.achievement_service import (
    ACHIEVEMENT_MILESTONES,
)
from app.utils.auth import get_current_user

router = APIRouter()


@router.get("/")
def get_all_achievements(db: Session = Depends(get_db)) -> dict:
    del db
    return {
        name: {
            "name": name,
            "icon": milestone["icon"],
            "trigger": milestone["trigger"],
            "target_value": milestone["value"],
        }
        for name, milestone in ACHIEVEMENT_MILESTONES.items()
    }


@router.get("/user")
def get_user_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    achievements = (
        db.query(Achievement)
        .filter(Achievement.user_id == current_user.id)
        .order_by(Achievement.earned_at.desc())
        .all()
    )
    return [
        {
            "badge_name": item.badge_name,
            "badge_icon": item.badge_icon,
            "earned_at": item.earned_at,
        }
        for item in achievements
    ]


@router.get("/progress")
def get_achievement_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    completed_count = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.status == "completed",
    ).count()
    earned_names = {
        row.badge_name
        for row in db.query(Achievement).filter(Achievement.user_id == current_user.id)
    }

    progress: dict[str, dict] = {}
    for badge_name, milestone in ACHIEVEMENT_MILESTONES.items():
        target = milestone["value"]
        trigger = milestone["trigger"]
        if badge_name in earned_names:
            progress[badge_name] = {
                "earned": True,
                "progress": 100,
                "target": target,
                "icon": milestone["icon"],
            }
            continue

        pct = 0
        if trigger == "completion_count" and isinstance(target, int) and target > 0:
            pct = min(100, int((completed_count / target) * 100))
        elif trigger == "xp" and isinstance(target, int) and target > 0:
            pct = min(100, int((current_user.xp / target) * 100))
        elif trigger == "level" and isinstance(target, int) and target > 0:
            pct = min(100, int((current_user.level / target) * 100))

        progress[badge_name] = {
            "earned": False,
            "progress": pct,
            "target": target,
            "icon": milestone["icon"],
        }

    return progress
