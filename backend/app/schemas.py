from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    xp: int
    level: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Project Schemas
class TestCaseBase(BaseModel):
    input_data: str
    expected_output: str
    description: Optional[str] = None

class TestCaseCreate(TestCaseBase):
    pass

class TestCaseResponse(TestCaseBase):
    id: int
    project_id: int
    
    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    description: str
    difficulty: str
    xp_reward: int = 100

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    is_completed: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    is_completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None
    test_cases: List[TestCaseResponse] = Field(default_factory=list)
    
    class Config:
        from_attributes = True

# Achievement Schemas
class AchievementResponse(BaseModel):
    id: int
    badge_name: str
    badge_icon: Optional[str] = None
    description: str
    earned_at: datetime
    
    class Config:
        from_attributes = True

class AchievementCreate(BaseModel):
    badge_name: str
    description: str
    badge_icon: Optional[str] = None

# User progress schemas
class UserProgressBase(BaseModel):
    project_id: int
    status: str = "in_progress"
    tests_passed: int
    total_tests: int
    hints_used: int

class UserProgressCreate(UserProgressBase):
    pass

class UserProgressResponse(UserProgressBase):
    id: int
    user_id: int
    xp_earned: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    newly_earned_badges: List[str] = Field(default_factory=list)

    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Login Schema
class LoginRequest(BaseModel):
    email: str
    password: str
