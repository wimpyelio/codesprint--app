#!/usr/bin/env python3
"""
Database Setup Script for CodeSprint Backend
Creates all necessary tables in Supabase PostgreSQL database
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Load environment variables
load_dotenv()

def create_tables():
    """Create all database tables for CodeSprint"""

    # Get database URL
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        print("❌ ERROR: DATABASE_URL not found in .env file")
        return False

    print("🔗 Connecting to database...")

    try:
        # Create engine
        engine = create_engine(database_url, echo=True)

        # Test connection
        with engine.connect() as conn:
            print("✅ Database connection successful!")

            # SQL commands to create tables
            sql_commands = [
                # Create enum type for user roles
                """
                DO $$ BEGIN
                    CREATE TYPE userrole AS ENUM ('USER', 'ADMIN');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
                """,

                # Create Users table
                """
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    hashed_password VARCHAR(255) NOT NULL,
                    full_name VARCHAR(255),
                    is_active BOOLEAN DEFAULT TRUE,
                    role userrole DEFAULT 'USER',
                    xp INTEGER DEFAULT 0,
                    level INTEGER DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """,

                # Create Projects table
                """
                CREATE TABLE IF NOT EXISTS projects (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    difficulty VARCHAR(50),
                    xp_reward INTEGER DEFAULT 100,
                    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    is_completed BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    completed_at TIMESTAMP
                );
                """,

                # Create Test Cases table
                """
                CREATE TABLE IF NOT EXISTS test_cases (
                    id SERIAL PRIMARY KEY,
                    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                    input_data VARCHAR(1000),
                    expected_output VARCHAR(1000),
                    description TEXT
                );
                """,

                # Create Achievements table
                """
                CREATE TABLE IF NOT EXISTS achievements (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    badge_name VARCHAR(255),
                    badge_icon VARCHAR(255),
                    description TEXT,
                    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """,

                # Create indexes for better performance
                """
                CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
                CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
                CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
                CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
                """,

                # Insert some sample data (optional)
                """
                -- Insert sample projects if table is empty
                INSERT INTO projects (title, description, difficulty, xp_reward, owner_id)
                SELECT 'Hello World', 'Create a program that prints Hello World', 'beginner', 50, 1
                WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);
                """
            ]

            # Execute each SQL command
            for i, sql in enumerate(sql_commands, 1):
                try:
                    print(f"📝 Executing SQL command {i}/{len(sql_commands)}...")
                    conn.execute(text(sql))
                    conn.commit()
                    print(f"✅ Command {i} completed successfully")
                except SQLAlchemyError as e:
                    print(f"⚠️  Warning on command {i}: {str(e)}")
                    continue

            print("\n🎉 Database setup completed successfully!")
            print("\n📊 Tables created:")
            print("  - users (with userrole enum)")
            print("  - projects")
            print("  - test_cases")
            print("  - achievements")
            print("  - Performance indexes")

            return True

    except SQLAlchemyError as e:
        print(f"❌ Database error: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

def verify_tables():
    """Verify that tables were created successfully"""
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        print("❌ DATABASE_URL not found")
        return

    try:
        engine = create_engine(database_url)

        with engine.connect() as conn:
            print("\n🔍 Verifying table creation...")

            # Check if tables exist
            tables_to_check = ['users', 'projects', 'test_cases', 'achievements']

            for table in tables_to_check:
                result = conn.execute(text(f"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '{table}')"))
                exists = result.fetchone()[0]

                if exists:
                    print(f"✅ Table '{table}' exists")

                    # Get row count
                    count_result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = count_result.fetchone()[0]
                    print(f"   📊 Records: {count}")
                else:
                    print(f"❌ Table '{table}' does not exist")

    except Exception as e:
        print(f"❌ Verification error: {str(e)}")

if __name__ == "__main__":
    print("🚀 CodeSprint Database Setup Script")
    print("=" * 40)

    # Create tables
    success = create_tables()

    if success:
        # Verify tables
        verify_tables()

        print("\n🎯 Next Steps:")
        print("1. Your backend API is ready at: http://localhost:8002")
        print("2. API documentation: http://localhost:8002/docs")
        print("3. Test the API endpoints")
        print("4. Connect your React frontend")

        print("\n💡 Ready to integrate with frontend!")
    else:
        print("\n❌ Database setup failed. Please check your .env configuration.")
        sys.exit(1)