from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.config import engine, Base
from app.routers import auth, projects, users, progress, leaderboard, stats, achievements

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CodeSprint API",
    description="Backend API for CodeSprint - Gamified Learning Platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(achievements.router, prefix="/api/achievements", tags=["achievements"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to CodeSprint API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    import socket
    
    # Find an available port
    def find_free_port(start_port=8000):
        for port in range(start_port, start_port + 100):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(('0.0.0.0', port))
                    return port
                except OSError:
                    continue
        return start_port
    
    port = find_free_port()
    print(f"Starting CodeSprint API on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
