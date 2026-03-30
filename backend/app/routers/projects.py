from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.config import get_db
from app.models import Project, TestCase, User
from app import schemas
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.ProjectResponse])
def get_all_projects(
    skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
) -> List[schemas.ProjectResponse]:
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)) -> schemas.ProjectResponse:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project

@router.post("/", response_model=schemas.ProjectResponse)
def create_project(
    project: schemas.ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> schemas.ProjectResponse:
    db_project = Project(
        title=project.title,
        description=project.description,
        difficulty=project.difficulty,
        xp_reward=project.xp_reward,
        owner_id=current_user.id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{project_id}", response_model=schemas.ProjectResponse)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> schemas.ProjectResponse:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this project"
        )
    
    if project_update.title:
        project.title = project_update.title
    if project_update.description:
        project.description = project_update.description
    if project_update.difficulty:
        project.difficulty = project_update.difficulty
    if project_update.is_completed is not None:
        if not project.is_completed and project_update.is_completed:
            project.completed_at = datetime.utcnow()
            current_user.xp += project.xp_reward
            current_user.level = max(1, (current_user.xp // 1000) + 1)
        project.is_completed = project_update.is_completed
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this project"
        )
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/test-cases", response_model=schemas.TestCaseResponse)
def create_test_case(
    project_id: int,
    test_case: schemas.TestCaseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> schemas.TestCaseResponse:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to add test cases to this project"
        )
    
    db_test_case = TestCase(
        project_id=project_id,
        input_data=test_case.input_data,
        expected_output=test_case.expected_output,
        description=test_case.description
    )
    db.add(db_test_case)
    db.commit()
    db.refresh(db_test_case)
    return db_test_case
