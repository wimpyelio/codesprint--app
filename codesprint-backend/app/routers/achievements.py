"""
Achievements Router - Auto-awards badges based on milestones.
Integrated with project completion flow via helper functions.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import get_db
from app.models import User, Achievement, UserProgress, Project
from app.routers.auth import get_current_user

router = APIRouter()

# Milestone definitions
ACHIEVEMENT_MILESTONES = {
    "first_project": {"trigger": "completion_count", "value": 1, "icon": "🎉"},
    "five_projects": {"trigger": "completion_count", "value": 5, "icon": "⭐"},
    "ten_projects": {"trigger": "completion_count", "value": 10, "icon": "🚀"},
    "twenty_projects": {"trigger": "completion_count", "value": 20, "icon": "👑"},
    "1000_xp": {"trigger": "xp", "value": 1000, "icon": "💰"},
    "5000_xp": {"trigger": "xp", "value": 5000, "icon": "💎"},
    "level_5": {"trigger": "level", "value": 5, "icon": "📈"},
    "level_10": {"trigger": "level", "value": 10, "icon": "🏆"},
    "perfect_score": {"trigger": "manual", "value": None, "icon": "💯"},
    "no_hints": {"trigger": "manual", "value": None, "icon": "🧠"},
    "speedrun": {"trigger": "manual", "value": None, "icon": "⚡"},
}

def check_and_award_achievements(user: User, db: Session) -> list:
    """
    Check all milestone conditions and award new achievements.
    Called after project completion in progress.py.
    Returns list of newly earned badge names.
    """
    newly_earned = []
    
    # Get completion count
    completed_count = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.status == 'completed'
    ).count()
    
    # Get already earned achievements
    earned_names = db.query(Achievement.badge_name).filter(
        Achievement.user_id == user.id
    ).all()
    earned_set = {e[0] for e in earned_names}
    
    # Check each milestone
    for badge_name, milestone in ACHIEVEMENT_MILESTONES.items():
        if badge_name in earned_set:
            continue  # Already earned
        
        should_award = False
        
        if milestone["trigger"] == "completion_count":
            should_award = completed_count >= milestone["value"]
        
        elif milestone["trigger"] == "xp":
            should_award = user.xp >= milestone["value"]
        
        elif milestone["trigger"] == "level":
            should_award = user.level >= milestone["value"]
        
        # Manual triggers checked separately in progress.py
        
        if should_award:
            achievement = Achievement(
                user_id=user.id,
                badge_name=badge_name,
                badge_icon=milestone["icon"]
            )
            db.add(achievement)
            newly_earned.append(badge_name)
    
    if newly_earned:
        db.commit()
    
    return newly_earned

def award_achievement(user_id: int, badge_name: str, db: Session) -> bool:
    """
    Manually award an achievement (for special conditions).
    Returns True if newly awarded, False if already earned.
    """
    existing = db.query(Achievement).filter(
        Achievement.user_id == user_id,
        Achievement.badge_name == badge_name
    ).first()
    
    if existing:
        return False
    
    milestone = ACHIEVEMENT_MILESTONES.get(badge_name, {})
    achievement = Achievement(
        user_id=user_id,
        badge_name=badge_name,
        badge_icon=milestone.get("icon", "🏅")
    )
    db.add(achievement)
    db.commit()
    
    return True

@router.get("/")
def get_all_achievements(db: Session = Depends(get_db)):
    """
    Get list of all possible achievements with descriptions.
    """
    return {
        name: {
            "name": name,
            "icon": milestone["icon"],
            "trigger": milestone["trigger"],
            "target_value": milestone["value"]
        }
        for name, milestone in ACHIEVEMENT_MILESTONES.items()
    }

@router.get("/user")
def get_user_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get achievements earned by current user.
    """
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).order_by(Achievement.earned_at.desc()).all()
    
    return [
        {
            "badge_name": a.badge_name,
            "badge_icon": a.badge_icon,
            "earned_at": a.earned_at
        }
        for a in achievements
    ]

@router.get("/progress")
def get_achievement_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get progress toward all achievements (completion %).
    Useful for motivational dashboard display.
    """
    completed_count = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.status == 'completed'
    ).count()
    
    earned_names = {e.badge_name for e in db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).all()}
    
    progress = {}
    for badge_name, milestone in ACHIEVEMENT_MILESTONES.items():
        if badge_name in earned_names:
            progress[badge_name] = {
                "earned": True,
                "progress": 100,
                "target": milestone["value"],
                "icon": milestone["icon"]
            }
        else:
            if milestone["trigger"] == "completion_count":
                progress[badge_name] = {
                    "earned": False,
                    "progress": min(100, int((completed_count / milestone["value"]) * 100)) if milestone["value"] else 0,
                    "target": milestone["value"],
                    "icon": milestone["icon"]
                }
            elif milestone["trigger"] == "xp":
                progress[badge_name] = {
                    "earned": False,
                    "progress": min(100, int((current_user.xp / milestone["value"]) * 100)) if milestone["value"] else 0,
                    "target": milestone["value"],
                    "icon": milestone["icon"]
                }
            elif milestone["trigger"] == "level":
                progress[badge_name] = {
                    "earned": False,
                    "progress": min(100, int((current_user.level / milestone["value"]) * 100)) if milestone["value"] else 0,
                    "target": milestone["value"],
                    "icon": milestone["icon"]
                }
            else:
                progress[badge_name] = {
                    "earned": False,
                    "progress": 0,
                    "target": milestone["value"],
                    "icon": milestone["icon"]
                }
    
    return progress
