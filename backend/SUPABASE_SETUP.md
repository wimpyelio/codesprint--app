# Supabase Integration Setup

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database
- Real-time subscriptions
- Authentication
- REST API
- Vector storage

## Current Configuration

Your backend is now configured to use Supabase PostgreSQL. Here's what's been set up:

### Credentials Saved In:
- `.env` file (local, not in repo)
- Database URL: From your connection string
- Project URL: https://snlrduzrgdycivzietvb.supabase.co
- Anon Key: For frontend access

## Manual Steps to Complete Setup

### 1. Update the Database URL in .env

Your .env file has been created with placeholder `[YOUR-PASSWORD]`. Update it:

```bash
# Replace [YOUR-PASSWORD] with your actual Supabase database password
DATABASE_URL=postgresql://postgres:your-actual-password@db.snlrduzrgdycivzietvb.supabase.co:5432/postgres
```

### 2. Install Updated Dependencies

```bash
pip install -r requirements.txt
```

This adds:
- `supabase` - Supabase Python client
- `email-validator` - For email validation
- PostgreSQL driver improvements

### 3. Create Tables in Supabase

Go to Supabase Dashboard > SQL Editor and run:

```sql
-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(50) DEFAULT 'user',
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50),
    xp_reward INTEGER DEFAULT 100,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create Test Cases table
CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    input_data VARCHAR(1000),
    expected_output VARCHAR(1000),
    description TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    badge_name VARCHAR(255),
    badge_icon VARCHAR(255),
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
```

### 4. Enable Row Level Security (RLS)

Optional but recommended for production:

Go to Supabase Dashboard > Authentication > Policies and set up RLS policies for each table.

### 5. Test the Connection

```bash
python -c "from app.config import engine; engine.connect(); print('✅ Connected to Supabase!')"
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres |
| `SUPABASE_URL` | Your Supabase project URL | https://xxx.supabase.co |
| `SUPABASE_KEY` | Anonymous key for client-side | sb_publishable_xxx |
| `SECRET_KEY` | JWT signing key | your-secret-key |
| `FRONTEND_URL` | CORS allowed origin | http://localhost:5173 |

## Troubleshooting

### Connection Timeout
- Check if your IP is whitelisted in Supabase
- Verify DATABASE_URL is correct
- Ensure password doesn't have special characters that need escaping

### SSL/TLS Issues
- Supabase requires SSL connection
- The config.py is set to `sslmode=require`

### Database Empty
- Run the SQL scripts in Supabase SQL Editor
- Or use SQLAlchemy to auto-create tables: `Base.metadata.create_all(bind=engine)`

## Restarting Backend with Supabase

```bash
# Kill previous process (Ctrl+C)
# Then run:
python main.py
```

The backend will now:
1. Connect to your Supabase database
2. Create all tables automatically (if not exists)
3. Start on port 8001
4. Serve API at http://localhost:8001/api

## Next: Frontend Integration

Once backend is running, connect your React app:

```javascript
const API_BASE_URL = "http://localhost:8001/api";

// Example: Register
const register = async (email, username, password, fullName) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, full_name: fullName, password })
  });
  return response.json();
};

// Store token for future requests
localStorage.setItem("token", data.access_token);
```

## Monitoring

Watch database activity in Supabase Dashboard:
- Logs > Database Logs
- Monitoring > Realtime
- Backups > View all backups

## Production Deployment

When deploying to production:
1. Use Railway, Render, or Heroku
2. Set environment variables on the hosting platform
3. Update FRONTEND_URL to production domain
4. Change SECRET_KEY to a strong random value
5. Set ENV=production and DEBUG=False
