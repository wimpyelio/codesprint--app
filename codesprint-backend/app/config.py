from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import ssl

load_dotenv()

# Database URL - Using Supabase PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")

print(f"[DB] Connecting to database: {DATABASE_URL[:50]}...")

# Create engine with proper PostgreSQL settings
if DATABASE_URL:
    # Create PostgreSQL engine with SSL
    engine = create_engine(
        DATABASE_URL,
        echo=os.getenv("DEBUG", "False") == "True",
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={
            "connect_timeout": 10,
            "sslmode": "require"
        }
    )
else:
    raise ValueError("DATABASE_URL environment variable is not set")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Supabase settings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Environment
ENV = os.getenv("ENV", "development")
DEBUG = os.getenv("DEBUG", "False") == "True"

