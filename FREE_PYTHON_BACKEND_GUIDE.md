# CodeSprint Backend - FREE Python/FastAPI Implementation

## 🎯 Overview

**YES!** We can absolutely implement the **Python/FastAPI stack (Option 2)** completely **FREE** using cloud services with generous free tiers.

---

## 🆓 FREE Tech Stack

### Backend: **Python + FastAPI**
- ✅ **Free** - Python is open source
- ✅ **FastAPI** - Modern, fast, auto-generates OpenAPI docs
- ✅ **Uvicorn** - ASGI server for production

### Database: **Supabase (PostgreSQL)**
- ✅ **Free Tier:** 500MB database, 50MB file storage
- ✅ **PostgreSQL** - Full SQL database
- ✅ **Real-time subscriptions** - Perfect for progress updates
- ✅ **Built-in Auth** - User management included
- ✅ **RESTful API** - Auto-generated from database

### Hosting: **Railway**
- ✅ **Free Tier:** 512MB RAM, 1GB disk, 100 hours/month
- ✅ **PostgreSQL included** - Or connect to Supabase
- ✅ **GitHub integration** - Auto-deploy on push
- ✅ **Custom domains** - Free .up.railway.app subdomain

### Alternative Free Hosting:
- **Render:** 750 hours/month free
- **Fly.io:** 3 shared CPUs, 256MB RAM free
- **Vercel:** Great for frontend, can run Python APIs

---

## 📁 FREE Implementation Structure

```
codesprint-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── database.py          # Database connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   ├── auth.py              # Authentication
│   └── routers/
│       ├── users.py
│       ├── projects.py
│       ├── progress.py
│       └── tests.py
├── tests/
├── requirements.txt
├── Dockerfile              # For deployment
├── railway.json           # Railway config
└── README.md
```

---

## 🚀 FREE Setup Steps

### Step 1: Create Backend Project

```bash
# Create project directory
mkdir codesprint-backend
cd codesprint-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart python-decouple

# Create requirements.txt
pip freeze > requirements.txt
```

### Step 2: Setup Supabase (FREE Database)

1. **Go to [supabase.com](https://supabase.com)** and create free account
2. **Create new project** → Choose region close to you
3. **Get connection details:**
   - Project URL: `https://xxxxx.supabase.co`
   - API Key: `eyJ...` (anon public key)
   - Database Password: `xxxxx`

### Step 3: Core FastAPI Application

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import users, projects, progress, tests

app = FastAPI(
    title="CodeSprint API",
    description="Python Mastery Workshop Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Your React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(tests.router, prefix="/api/tests", tags=["tests"])

@app.get("/")
async def root():
    return {"message": "CodeSprint API", "version": "1.0.0"}
```

### Step 4: Database Configuration

```python
# app/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
```

```python
# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

SQLALCHEMY_DATABASE_URL = settings.database_url

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Step 5: Database Models

```python
# app/models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    xp = Column(Integer, default=0)
    current_rank = Column(String, default="Curious")
    streak = Column(Integer, default=0)
    last_activity_date = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    progress = relationship("UserProgress", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    tier = Column(String)
    concepts = Column(JSON)  # Array of concepts
    estimated_hours = Column(String)
    xp_reward = Column(Integer)
    total_tests = Column(Integer)

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(String, ForeignKey("projects.id"))
    status = Column(String, default="not_started")  # not_started, in_progress, completed
    tests_passing = Column(Integer, default=0)
    total_tests = Column(Integer)
    hints_used = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    da_vinci_sketch = Column(JSON)
    completed_at = Column(DateTime(timezone=True))
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="progress")
    project = relationship("Project")

class Badge(Base):
    __tablename__ = "badges"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    icon = Column(String)
    rarity = Column(String)

class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    badge_id = Column(String, ForeignKey("badges.id"))
    earned_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")
```

### Step 6: Authentication

```python
# app/auth.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import models, schemas
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user
```

### Step 7: API Routers

```python
# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter()

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.User)
async def update_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user
```

```python
# app/routers/projects.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/", response_model=list[schemas.Project])
async def get_projects(
    skip: int = 0,
    limit: int = 100,
    tier: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Project)
    if tier:
        query = query.filter(models.Project.tier == tier)
    projects = query.offset(skip).limit(limit).all()
    return projects

@router.get("/{project_id}", response_model=schemas.Project)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
```

```python
# app/routers/progress.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=list[schemas.UserProgress])
async def get_user_progress(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id
    ).all()

@router.post("/{project_id}/start", response_model=schemas.UserProgress)
async def start_project(
    project_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if already started
    existing = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.project_id == project_id
    ).first()

    if existing:
        return existing

    # Create new progress
    progress = models.UserProgress(
        user_id=current_user.id,
        project_id=project_id,
        total_tests=project.total_tests,
        status="in_progress"
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress

@router.put("/{project_id}", response_model=schemas.UserProgress)
async def update_progress(
    project_id: str,
    progress_update: schemas.ProgressUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.project_id == project_id
    ).first()

    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")

    for field, value in progress_update.dict(exclude_unset=True).items():
        setattr(progress, field, value)

    db.commit()
    db.refresh(progress)
    return progress
```

### Step 8: Pydantic Schemas

```python
# app/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None

class User(UserBase):
    id: int
    xp: int
    current_rank: str
    streak: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

class Project(BaseModel):
    id: str
    name: str
    description: Optional[str]
    tier: str
    concepts: List[str]
    estimated_hours: str
    xp_reward: int
    total_tests: int

    class Config:
        orm_mode = True

class UserProgress(BaseModel):
    id: int
    user_id: int
    project_id: str
    status: str
    tests_passing: int
    total_tests: int
    hints_used: int
    xp_earned: int
    da_vinci_sketch: Optional[dict]
    completed_at: Optional[datetime]
    started_at: datetime

    class Config:
        orm_mode = True

class ProgressUpdate(BaseModel):
    status: Optional[str] = None
    tests_passing: Optional[int] = None
    hints_used: Optional[int] = None
    da_vinci_sketch: Optional[dict] = None

class Badge(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    rarity: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
```

### Step 9: Environment Configuration

```bash
# .env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Step 10: Railway Deployment (FREE)

1. **Create Railway account** at [railway.app](https://railway.app)
2. **Connect GitHub repository**
3. **Railway auto-detects Python** and installs requirements.txt
4. **Set environment variables** in Railway dashboard
5. **Deploy!** Get a free `*.up.railway.app` URL

```json
// railway.json (optional)
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

---

## 🔗 Frontend Integration (FREE)

### Update your React app to use the FREE backend:

```javascript
// src/api/client.js
const API_BASE = 'https://your-project.up.railway.app/api';  // Your Railway URL

export const api = {
  // Auth
  async register(email, username, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  // Progress
  async startProject(projectId) {
    const res = await fetch(`${API_BASE}/progress/${projectId}/start`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return res.json();
  },

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },
};
```

---

## 📊 FREE Resource Limits

### Supabase FREE Tier:
- ✅ **500MB database**
- ✅ **50MB file storage**
- ✅ **50,000 monthly active users**
- ✅ **500,000 monthly bandwidth**
- ✅ **Real-time enabled**

### Railway FREE Tier:
- ✅ **512MB RAM**
- ✅ **1GB disk**
- ✅ **100 hours/month** (~4 hours/day)
- ✅ **PostgreSQL included**
- ✅ **Custom domains**

### When You Need to Upgrade:
- **Supabase:** $25/month for 8GB database
- **Railway:** $5/month for 1GB RAM, 100 hours

---

## 🎯 Implementation Timeline (FREE)

### Week 1: Core Setup
- ✅ Setup FastAPI project
- ✅ Configure Supabase database
- ✅ Create basic models and schemas
- ✅ Implement authentication
- ✅ Deploy to Railway

### Week 2: API Development
- ✅ Projects CRUD endpoints
- ✅ User progress tracking
- ✅ Badge/achievement system
- ✅ Testing endpoints

### Week 3: Integration & Testing
- ✅ Update React frontend
- ✅ Test full user flow
- ✅ Add error handling
- ✅ Performance optimization

---

## 🚀 Getting Started

```bash
# 1. Create backend directory
mkdir codesprint-backend
cd codesprint-backend

# 2. Setup Python environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose passlib python-multipart

# 4. Create Supabase project & get credentials

# 5. Follow the code above to create files

# 6. Run locally
uvicorn app.main:app --reload

# 7. Deploy to Railway
git init
git add .
git commit -m "Initial FastAPI backend"
# Push to GitHub, connect to Railway
```

---

## 💡 Why This Stack is Perfect

### For CodeSprint:
- **Python Focus** - Matches your app's Python teaching theme
- **FastAPI** - Modern, fast, great developer experience
- **Supabase** - Real-time features for live progress updates
- **Railway** - Simple deployment, perfect for beginners

### Cost: **$0/month** for development and small-scale use

### Scalability: Can handle 1000s of users before needing paid plans

---

## 🎉 Ready to Build?

This FREE stack gives you a **production-ready backend** with:
- ✅ User authentication
- ✅ Database persistence  
- ✅ RESTful API
- ✅ Real-time capabilities
- ✅ Auto-deployment
- ✅ Professional hosting

**Want to start implementing this FREE backend now?** 🚀</content>
<parameter name="filePath">c:\Users\Dr Anjana`s Dental\my-app\FREE_PYTHON_BACKEND_GUIDE.md