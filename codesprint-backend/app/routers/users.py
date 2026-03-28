from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config import get_db
from app.models import User, Achievement
from app import schemas
from app.routers.auth import get_current_user, hash_password

router = APIRouter()

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/me", response_model=schemas.UserResponse)
def update_user_profile(
    user_update: schemas.UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    
    if user_update.password:
        current_user.hashed_password = hash_password(user_update.password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/{user_id}/achievements", response_model=List[schemas.AchievementResponse])
def get_user_achievements(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    achievements = db.query(Achievement).filter(Achievement.user_id == user_id).all()
    return achievements

@router.post("/{user_id}/achievements")
def add_achievement(
    user_id: int,
    badge_name: str,
    description: str,
    badge_icon: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    achievement = Achievement(
        user_id=user_id,
        badge_name=badge_name,
        description=description,
        badge_icon=badge_icon
    )
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement

@router.get("/{user_id}/projects", response_model=List[schemas.ProjectResponse])
def get_user_projects(user_id: int, db: Session = Depends(get_db)):
    from app.models import Project
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    projects = db.query(Project).filter(Project.owner_id == user_id).all()
    return projects

@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    from app.models import Project
    
    projects = db.query(Project).filter(Project.owner_id == user_id).all()
    completed_projects = [p for p in projects if p.is_completed]
    
    return {
        "user_id": user.id,
        "username": user.username,
        "xp": user.xp,
        "level": user.level,
        "total_projects": len(projects),
        "completed_projects": len(completed_projects),
        "completion_rate": (len(completed_projects) / len(projects) * 100) if projects else 0
    }
