# CodeSprint Backend Implementation Guide

## 📋 Overview

This guide will help you build a complete backend for the CodeSprint gamification platform. The backend will handle user management, project tracking, testing, progress, and community features.

---

## 🏗️ Architecture Overview

```
Frontend (React)
    ↓
API Server (Node.js/Express or Python/FastAPI)
    ↓
Database (PostgreSQL/MongoDB)
    ↓
File System / Testing Service
```

---

## 🛠️ Technology Stack Recommendations

### Option 1: Node.js Stack (Recommended for React)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT + bcrypt
- **Testing:** Jest
- **Hosting:** Heroku, Railway, or DigitalOcean

### Option 2: Python Stack
- **Framework:** FastAPI or Django
- **Database:** PostgreSQL + SQLAlchemy
- **Authentication:** JWT + Passlib
- **Testing:** Pytest
- **Hosting:** Heroku, PythonAnywhere, or AWS

### Option 3: Full-Stack Firebase
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **Functions:** Cloud Functions
- **Hosting:** Firebase Hosting
- **Pros:** Quick setup, serverless, no infrastructure

---

## 💾 Database Schema

### Core Models

#### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  xp INT DEFAULT 0,
  current_rank VARCHAR(50),
  streak INT DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Projects Table
```sql
CREATE TABLE projects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tier VARCHAR(50), -- beginner, intermediate, advanced, boss
  concepts JSON, -- ["os", "shutil", "pathlib"]
  estimated_hours VARCHAR(20),
  xp_reward INT,
  total_tests INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id VARCHAR(50) REFERENCES projects(id),
  status VARCHAR(50), -- not_started, in_progress, completed
  tests_passing INT DEFAULT 0,
  total_tests INT,
  hints_used INT DEFAULT 0,
  xp_earned INT,
  da_vinci_sketch JSON, -- {what, how, unknown}
  completed_at TIMESTAMP,
  started_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Achievements/Badges Table
```sql
CREATE TABLE badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  rarity VARCHAR(50)
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  badge_id VARCHAR(50) REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. Community Submissions Table
```sql
CREATE TABLE community_submissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id VARCHAR(50) REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tier VARCHAR(50),
  completions INT DEFAULT 0,
  votes INT DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Guilds Table
```sql
CREATE TABLE guilds (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  emoji VARCHAR(10),
  members_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE guild_members (
  id UUID PRIMARY KEY,
  guild_id UUID REFERENCES guilds(id),
  user_id UUID REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(guild_id, user_id)
);
```

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login and get JWT token
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - Logout user
```

### User Endpoints
```
GET    /api/users/me               - Get current user profile
PUT    /api/users/me               - Update user profile
GET    /api/users/:id              - Get user public profile
GET    /api/users/:id/stats        - Get user statistics
GET    /api/users/:id/badges       - Get user badges
```

### Projects Endpoints
```
GET    /api/projects               - List all projects
GET    /api/projects/:id           - Get project details
GET    /api/projects?tier=beginner - Filter projects by tier
```

### Progress Endpoints
```
GET    /api/progress               - Get user's progress on all projects
GET    /api/progress/:projectId    - Get progress on specific project
POST   /api/progress/:projectId/start   - Start a project
PUT    /api/progress/:projectId    - Update progress (save sketch)
```

### Testing Endpoints
```
POST   /api/tests/:projectId/run   - Run tests for project
GET    /api/tests/:projectId/results - Get test results
```

### Achievements Endpoints
```
GET    /api/achievements           - Get user achievements
POST   /api/achievements/check     - Check and award badges
```

### Community Endpoints
```
GET    /api/community/submissions  - Get community submissions
POST   /api/community/submissions  - Submit a project
GET    /api/community/guilds       - Get all guilds
POST   /api/community/guilds/:id/join - Join a guild
```

### Roadmap Endpoints
```
GET    /api/roadmap                - Get learning roadmap with progress
GET    /api/roadmap/:milestoneId   - Get milestone details
```

---

## 📝 Implementation Steps

### Step 1: Setup Backend Project

```bash
# Using Node.js/Express
npx create-express-app codesprint-backend
cd codesprint-backend
npm install express cors dotenv pg prisma bcryptjs jsonwebtoken axios

# Create .env file
DATABASE_URL=postgresql://user:password@localhost:5432/codesprint
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
```

### Step 2: Database Setup

```bash
# Install PostgreSQL locally or use cloud (Supabase, Railway, etc.)

# Using Prisma
npx prisma init
# Edit .env with DATABASE_URL
# Create schema.prisma with models
npx prisma db push
```

### Step 3: Core Structure

```
codesprint-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── progressController.js
│   │   └── testController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   ├── progress.js
│   │   └── tests.js
│   ├── middleware/
│   │   ├── auth.js (JWT verification)
│   │   └── errorHandler.js
│   ├── models/
│   │   └── (Prisma models in schema.prisma)
│   └── app.js
├── .env
├── server.js
└── package.json
```

### Step 4: Basic Server Setup

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/projects', require('./src/routes/projects'));
app.use('/api/progress', require('./src/routes/progress'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 5: Authentication Implementation

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
```

### Step 6: Example Controller

```javascript
// src/controllers/authController.js
const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password_hash: hashedPassword,
      },
    });
    
    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 🔗 Frontend Integration

### Step 1: Create API Client

```javascript
// src/api/client.js
const API_BASE = 'http://localhost:5000/api';

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

  async saveSketch(projectId, sketch) {
    const res = await fetch(`${API_BASE}/progress/${projectId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ da_vinci_sketch: sketch }),
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

### Step 2: Update React State Management

```javascript
// In your CodeSprint component or Context
const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
const [user, setUser] = useState(null);

async function handleLogin(email, password) {
  const { token, user } = await api.login(email, password);
  localStorage.setItem('token', token);
  setAuthToken(token);
  setUser(user);
  // Load user's progress from backend
  loadUserProgress();
}

async function loadUserProgress() {
  const progress = await api.getUserProgress();
  setState(prev => ({ ...prev, ...progress }));
}
```

---

## 🧪 Testing Implementation

### Mock Testing (Current)
```javascript
// In progress - simulates pytest output (already in frontend)
```

### Real Testing (With Backend)
```javascript
// backend/tests/
// Run actual pytest and return results

exports.runTests = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Execute actual tests
    const { exec } = require('child_process');
    const result = await new Promise((resolve, reject) => {
      exec(`pytest projects/${projectId}/tests/ -v --json`, 
        (error, stdout, stderr) => {
          if (error) reject(error);
          resolve(JSON.parse(stdout));
        }
      );
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 📊 XP & Rank Calculation

```javascript
// Backend calculation (more secure than frontend)
const calculateXP = (project, hintsUsed, testsPassing) => {
  let xp = project.xp_reward;
  
  // Bonus for no hints
  if (hintsUsed === 0) {
    xp += 50; // Pure Run bonus
  }
  
  // Penalty for hints
  xp -= hintsUsed * 50;
  
  return Math.max(xp, 0);
};

const getRank = (totalXP) => {
  const ranks = [
    { name: "Curious", min: 0 },
    { name: "Tinkerer", min: 300 },
    { name: "Apprentice", min: 800 },
    { name: "Journeyman", min: 2000 },
    { name: "Craftsperson", min: 5000 },
    { name: "Architect", min: 10000 },
    { name: "Maestro", min: 25000 },
  ];
  
  let rank = ranks[0];
  for (const r of ranks) {
    if (totalXP >= r.min) rank = r;
  }
  return rank;
};
```

---

## 🚀 Deployment Options

### Option 1: Heroku + PostgreSQL
```bash
# Install Heroku CLI
heroku login
heroku create codesprint-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Option 2: Railway
- Connect GitHub repo
- Railway auto-deploys on push
- Add PostgreSQL add-on
- Set environment variables

### Option 3: DigitalOcean App Platform
- Docker containerize backend
- Push to repository
- Deploy from DigitalOcean dashboard

### Option 4: Firebase (Serverless)
- Cloud Functions for API endpoints
- Firestore for database
- Firebase Auth for authentication

---

## 📋 Implementation Checklist

- [ ] Choose tech stack
- [ ] Setup project structure
- [ ] Setup PostgreSQL database
- [ ] Create database schema
- [ ] Implement authentication (Register/Login)
- [ ] Implement user endpoints
- [ ] Implement project endpoints
- [ ] Implement progress tracking
- [ ] Add badge/achievement system
- [ ] Implement testing endpoint
- [ ] Add community features
- [ ] Setup CORS for frontend
- [ ] Test all endpoints with Postman
- [ ] Deploy backend
- [ ] Update frontend API client
- [ ] Test full integration
- [ ] Setup CI/CD pipeline

---

## 🔒 Security Considerations

1. **Authentication:** Always use JWT + secure storage (httpOnly cookies)
2. **Password:** Hash with bcrypt, never store plaintext
3. **CORS:** Whitelist only your frontend domain
4. **Rate Limiting:** Prevent brute force attacks
5. **Input Validation:** Validate all user inputs
6. **Environment Variables:** Never commit secrets
7. **HTTPS:** Always use in production
8. **SQL Injection:** Use parameterized queries (Prisma handles this)

---

## 📚 Recommended Learning Resources

- Express.js: https://expressjs.com
- Prisma ORM: https://www.prisma.io
- JWT: https://jwt.io
- PostgreSQL: https://www.postgresql.org
- RESTful API Design: https://restfulapi.net

---

## 🤔 Quick Start Recommendation

For fastest implementation:
1. **Use Node.js + Express + PostgreSQL + Prisma** (same language as frontend)
2. **Start with Firebase** (zero infrastructure setup)
3. **Deploy on Railway or Heroku** (easiest for beginners)

This will let you go from zero to full-stack in ~1-2 weeks!
