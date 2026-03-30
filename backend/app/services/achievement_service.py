from sqlalchemy.orm import Session

from app.models import Achievement, User, UserProgress

ACHIEVEMENT_MILESTONES: dict[str, dict[str, int | str | None]] = {
    "first_project": {"trigger": "completion_count", "value": 1, "icon": "tada"},
    "five_projects": {"trigger": "completion_count", "value": 5, "icon": "star"},
    "ten_projects": {"trigger": "completion_count", "value": 10, "icon": "rocket"},
    "twenty_projects": {"trigger": "completion_count", "value": 20, "icon": "crown"},
    "1000_xp": {"trigger": "xp", "value": 1000, "icon": "coin"},
    "5000_xp": {"trigger": "xp", "value": 5000, "icon": "gem"},
    "level_5": {"trigger": "level", "value": 5, "icon": "chart"},
    "level_10": {"trigger": "level", "value": 10, "icon": "trophy"},
    "perfect_score": {"trigger": "manual", "value": None, "icon": "target"},
    "no_hints": {"trigger": "manual", "value": None, "icon": "brain"},
    "speedrun": {"trigger": "manual", "value": None, "icon": "bolt"},
}


def check_and_award_achievements(user: User, db: Session) -> list[str]:
    newly_earned: list[str] = []
    completed_count = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user.id, UserProgress.status == "completed")
        .count()
    )
    earned_names = db.query(Achievement.badge_name).filter(
        Achievement.user_id == user.id
    )
    earned_set = {row[0] for row in earned_names.all()}

    for badge_name, milestone in ACHIEVEMENT_MILESTONES.items():
        if badge_name in earned_set:
            continue

        trigger = str(milestone.get("trigger"))
        value = milestone.get("value")
        should_award = False
        if trigger == "completion_count" and isinstance(value, int):
            should_award = completed_count >= value
        elif trigger == "xp" and isinstance(value, int):
            should_award = user.xp >= value
        elif trigger == "level" and isinstance(value, int):
            should_award = user.level >= value

        if should_award:
            db.add(
                Achievement(
                    user_id=user.id,
                    badge_name=badge_name,
                    badge_icon=str(milestone.get("icon") or "badge"),
                )
            )
            newly_earned.append(badge_name)

    return newly_earned


def award_achievement(user_id: int, badge_name: str, db: Session) -> bool:
    existing = (
        db.query(Achievement)
        .filter(Achievement.user_id == user_id, Achievement.badge_name == badge_name)
        .first()
    )
    if existing:
        return False

    milestone = ACHIEVEMENT_MILESTONES.get(badge_name, {})
    db.add(
        Achievement(
            user_id=user_id,
            badge_name=badge_name,
            badge_icon=str(milestone.get("icon") or "badge"),
        )
    )
    return True
