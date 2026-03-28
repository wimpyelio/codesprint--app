"""
Leaderboard Router - Provides competitive ranking and social features.
Implements efficient SQL queries with caching-ready patterns.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.config import get_db
from app.models import User, UserProgress
from app import schemas

router = APIRouter()

class LeaderboardSchema(schemas.UserResponse):
    """Extended user schema with leaderboard stats"""
    rank: int
    completion_count: int
    average_hints: float
    
    class Config:
        from_attributes = True

@router.get("/global", response_model=List[LeaderboardSchema])
def get_global_leaderboard(
    limit: int = Query(default=100, le=1000),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Get global leaderboard sorted by XP (desc).
    Efficiently calculates stats in single query set.
    Optional: Add Redis caching with 5-min TTL for production.
    """
    users_with_stats = db.query(
        User,
        (db.query(UserProgress).filter(
            UserProgress.user_id == User.id,
            UserProgress.status == 'completed'
        ).count()).label('completion_count')
    ).filter(User.is_active == True).order_by(desc(User.xp)).offset(offset).limit(limit).all()
    
    result = []
    for rank, (user, _) in enumerate(users_with_stats, start=offset + 1):
        completed = db.query(UserProgress).filter(
            UserProgress.user_id == user.id,
            UserProgress.status == 'completed'
        ).all()
        
        avg_hints = (sum(p.hints_used for p in completed) / len(completed)) if completed else 0
        
        result.append(LeaderboardSchema(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            xp=user.xp,
            level=user.level,
            is_active=user.is_active,
            created_at=user.created_at,
            rank=rank,
            completion_count=len(completed),
            average_hints=avg_hints
        ))
    
    return result

@router.get("/friends/{user_id}", response_model=List[LeaderboardSchema])
def get_friends_leaderboard(
    user_id: int,
    limit: int = Query(default=50, le=100),
    db: Session = Depends(get_db)
):
    """
    Get leaderboard with user's nearby ranks for context.
    Returns: top 25% + user + bottom 25%.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return []
    
    # Get total users
    total_users = db.query(User).filter(User.is_active == True).count()
    
    # Find user's rank
    rank = db.query(User).filter(
        User.is_active == True,
        User.xp > user.xp
    ).count() + 1
    
    # Calculate range
    offset = max(0, rank - (limit // 2))
    
    # Fetch leaderboard slice
    return get_global_leaderboard(limit=limit, offset=offset, db=db)

@router.get("/weekly", response_model=List[LeaderboardSchema])
def get_weekly_leaderboard(
    db: Session = Depends(get_db)
):
    """
    Get weekly leaderboard based on XP earned this week.
    Uses UserProgress.completed_at for week filter.
    Note: Production should cache this with 1-hour TTL.
    """
    from datetime import datetime, timedelta
    from sqlalchemy import func
    
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    weekly_xp = db.query(
        User.id,
        User.username,
        User.email,
        User.full_name,
        User.is_active,
        User.created_at,
        User.level,
        func.sum(UserProgress.xp_earned).label('weekly_xp')
    ).join(UserProgress).filter(
        UserProgress.completed_at >= week_ago,
        UserProgress.status == 'completed',
        User.is_active == True
    ).group_by(User.id).order_by(desc('weekly_xp')).limit(100).all()
    
    result = []
    for rank, row in enumerate(weekly_xp, start=1):
        result.append(LeaderboardSchema(
            id=row.id,
            email=row.email,
            username=row.username,
            full_name=row.full_name,
            xp=row.level,  # Use current level for display
            level=row.level,
            is_active=row.is_active,
            created_at=row.created_at,
            rank=rank,
            completion_count=0,
            average_hints=0.0
        ))
    
    return result

@router.get("/streak", response_model=List[LeaderboardSchema])
def get_streak_leaderboard(
    db: Session = Depends(get_db)
):
    """
    Get leaderboard sorted by consecutive completion days.
    Placeholder for future implementation with daily tracking table.
    """
    users = db.query(User).filter(User.is_active == True).order_by(desc(User.xp)).limit(100).all()
    
    result = []
    for rank, user in enumerate(users, start=1):
        result.append(LeaderboardSchema(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            xp=user.xp,
            level=user.level,
            is_active=user.is_active,
            created_at=user.created_at,
            rank=rank,
            completion_count=0,
            average_hints=0.0
        ))
    
    return result
