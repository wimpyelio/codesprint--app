# CodeSprint Backend API

A FastAPI-based backend for the CodeSprint gamified learning platform.

## Features

- User authentication (registration, login)
- Project management (CRUD operations)
- Test case management
- User achievements and badges
- XP and leveling system
- CORS support for frontend integration

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite (default) or PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (Python-Jose)
- **Password Hashing**: Bcrypt

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
# or
source venv/bin/activate  # On macOS/Linux
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 4. Run the Server

```bash
python main.py
```

Or directly with Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8004`

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8004/docs
- **ReDoc**: http://localhost:8004/redoc

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Projects

- `GET /api/projects/` - Get all projects
- `GET /api/projects/{project_id}` - Get specific project
- `POST /api/projects/` - Create new project
- `PUT /api/projects/{project_id}` - Update project
- `DELETE /api/projects/{project_id}` - Delete project
- `POST /api/projects/{project_id}/test-cases` - Add test case

### Users

- `GET /api/users/me` - Get current user profile
- `GET /api/users/{user_id}` - Get user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/{user_id}/achievements` - Get user achievements
- `GET /api/users/{user_id}/projects` - Get user projects
- `GET /api/users/{user_id}/stats` - Get user statistics

## Database

The project uses SQLite by default. To switch to PostgreSQL:

1. Update the `DATABASE_URL` in `.env`:

   ```
   DATABASE_URL=postgresql://user:password@localhost/codesprint
   ```

2. Install PostgreSQL driver:

   ```bash
   pip install psycopg2-binary
   ```

3. Restart the server

## Project Structure

```
codesprint-backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # Database configuration
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   └── routers/
│       ├── __init__.py
│       ├── auth.py        # Authentication routes
│       ├── projects.py    # Project routes
│       └── users.py       # User routes
├── main.py               # Application entry point
├── requirements.txt      # Dependencies
├── .env.example         # Environment template
└── README.md            # This file
```

## Example Usage

### Register a User

```bash
curl -X POST "http://localhost:8004/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john_doe",
    "full_name": "John Doe",
    "password": "securepassword"
  }'
```

### Login

```bash
curl -X POST "http://localhost:8004/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Create a Project

```bash
curl -X POST "http://localhost:8004/api/projects/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Variables and Data Types",
    "description": "Learn about JavaScript variables",
    "difficulty": "beginner",
    "xp_reward": 100
  }'
```

## Development

For development with auto-reload:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8004
```

## Production Deployment

For production, use a production ASGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## License

MIT License
