from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.config import get_db
from app.models import UserProgress, Project, User
from app import schemas
from app.routers.auth import get_current_user
from app.routers.achievements import check_and_award_achievements

router = APIRouter()

@router.get("/", response_model=list[schemas.UserProgressResponse])
def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress_items = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    return progress_items

@router.post("/{project_id}/start", response_model=schemas.UserProgressResponse)
def start_project_progress(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    existing = db.query(UserProgress).filter(
        UserProgress.project_id == project_id,
        UserProgress.user_id == current_user.id
    ).first()

    if existing:
        return existing

    new_progress = UserProgress(
        user_id=current_user.id,
        project_id=project_id,
        status="in_progress",
        tests_passed=0,
        total_tests=0,
        hints_used=0,
        xp_earned=0,
        started_at=datetime.utcnow()
    )
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    return new_progress

@router.post("/{project_id}/complete", response_model=schemas.UserProgressResponse)
def complete_project(
    project_id: int,
    progress_data: schemas.UserProgressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if progress_data.tests_passed < 0 or progress_data.total_tests <= 0 or progress_data.tests_passed > progress_data.total_tests:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid test counts")

    progress = db.query(UserProgress).filter(
        UserProgress.project_id == project_id,
        UserProgress.user_id == current_user.id
    ).first()

    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            project_id=project_id,
            status="in_progress",
            tests_passed=0,
            total_tests=0,
            hints_used=0,
            xp_earned=0,
            started_at=datetime.utcnow()
        )
        db.add(progress)

    progress.tests_passed = progress_data.tests_passed
    progress.total_tests = progress_data.total_tests
    progress.hints_used = progress_data.hints_used
    progress.status = "completed" if progress_data.tests_passed == progress_data.total_tests else "in_progress"
    progress.completed_at = datetime.utcnow() if progress.status == "completed" else None

    newly_earned_badges = []
    if progress.status == "completed":
        xp_bonus = max(0, project.xp_reward - progress.hints_used * 50)
        progress.xp_earned = xp_bonus
        current_user.xp += xp_bonus
        current_user.level = max(1, (current_user.xp // 1000) + 1)
        project.is_completed = True
        project.completed_at = datetime.utcnow()
        
        # Auto-award achievements based on milestones
        newly_earned_badges = check_and_award_achievements(current_user, db)

    db.commit()
    db.refresh(progress)
    db.refresh(current_user)
    db.refresh(project)

    # Add newly earned badges to response metadata
    response = schemas.UserProgressResponse.from_orm(progress)
    response.newly_earned_badges = newly_earned_badges
    
    return response
