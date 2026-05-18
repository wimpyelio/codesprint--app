"""Phase 1 foundation schema and seed data.

Revision ID: 20260330_0001
Revises:
Create Date: 2026-03-30 10:00:00.000000
"""

from __future__ import annotations

from datetime import datetime

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260330_0001"
down_revision = None
branch_labels = None
depends_on = None


GUILDS = [
    {
        "name": "Automation Guild",
        "icon": "AUT",
        "focus_area": "Scripts that do real work",
        "weekly_challenge_theme": "Automate one real task in your life",
    },
    {
        "name": "Data Alchemists",
        "icon": "DAT",
        "focus_area": "Scraping, parsing, analysis",
        "weekly_challenge_theme": "Extract insight from a public dataset",
    },
    {
        "name": "Game Dev Guild",
        "icon": "GAM",
        "focus_area": "CLI games and interactive fiction",
        "weekly_challenge_theme": "Build a game mechanic in under 100 lines",
    },
    {
        "name": "Async Architects",
        "icon": "ASY",
        "focus_area": "Concurrent and distributed systems",
        "weekly_challenge_theme": "Make something faster with concurrency",
    },
]

BADGES = [
    {
        "id": "first-blood",
        "name": "First Blood",
        "icon": "first_blood",
        "rarity": "Common",
        "category": "Milestone",
        "trigger_condition": "progress: INSERT (first row for user)",
        "xp_requirement": None,
    },
    {
        "id": "file-whisperer",
        "name": "File Whisperer",
        "icon": "file_whisperer",
        "rarity": "Common",
        "category": "Craft",
        "trigger_condition": "All File I/O milestone projects complete",
        "xp_requirement": None,
    },
    {
        "id": "object-architect",
        "name": "Object Architect",
        "icon": "object_architect",
        "rarity": "Uncommon",
        "category": "Craft",
        "trigger_condition": "5+ OOP-tagged projects complete",
        "xp_requirement": None,
    },
    {
        "id": "api-alchemist",
        "name": "API Alchemist",
        "icon": "api_alchemist",
        "rarity": "Rare",
        "category": "Craft",
        "trigger_condition": "5+ API-tagged projects complete",
        "xp_requirement": None,
    },
    {
        "id": "pure-runner",
        "name": "Pure Runner",
        "icon": "pure_runner",
        "rarity": "Rare",
        "category": "Craft",
        "trigger_condition": "5 projects completed with hints_used = 0",
        "xp_requirement": None,
    },
    {
        "id": "davinci-pen",
        "name": "Da Vinci's Pen",
        "icon": "davinci_pen",
        "rarity": "Uncommon",
        "category": "Craft",
        "trigger_condition": "sketch_written = true on 10 project records",
        "xp_requirement": None,
    },
    {
        "id": "concurrency-wizard",
        "name": "Concurrency Wizard",
        "icon": "concurrency_wizard",
        "rarity": "Epic",
        "category": "Craft",
        "trigger_condition": "3+ async/concurrent projects complete",
        "xp_requirement": None,
    },
    {
        "id": "python-sage",
        "name": "Python Sage",
        "icon": "python_sage",
        "rarity": "Legendary",
        "category": "Milestone",
        "trigger_condition": "All 30 core projects complete",
        "xp_requirement": None,
    },
    {
        "id": "on-a-roll",
        "name": "On a Roll",
        "icon": "on_a_roll",
        "rarity": "Uncommon",
        "category": "Streak",
        "trigger_condition": "streak_days >= 7 on any day",
        "xp_requirement": None,
    },
    {
        "id": "renaissance-pace",
        "name": "Renaissance Pace",
        "icon": "renaissance_pace",
        "rarity": "Epic",
        "category": "Streak",
        "trigger_condition": "streak_days >= 30 on any day",
        "xp_requirement": None,
    },
    {
        "id": "workshop-contributor",
        "name": "Workshop Contributor",
        "icon": "workshop_contributor",
        "rarity": "Rare",
        "category": "Community",
        "trigger_condition": "First community project PR merged",
        "xp_requirement": 2000,
    },
    {
        "id": "guild-master",
        "name": "Guild Master",
        "icon": "guild_master",
        "rarity": "Legendary",
        "category": "Community",
        "trigger_condition": "Led guild to weekly challenge victory",
        "xp_requirement": 25000,
    },
    {
        "id": "master-builder",
        "name": "Master Builder",
        "icon": "master_builder",
        "rarity": "Epic",
        "category": "Community",
        "trigger_condition": "5 community project PRs merged",
        "xp_requirement": 2000,
    },
    {
        "id": "test-whisperer",
        "name": "Test Whisperer",
        "icon": "test_whisperer",
        "rarity": "Rare",
        "category": "Craft",
        "trigger_condition": "tests_passing = tests_total on first run attempt",
        "xp_requirement": None,
    },
]

BEGINNER_PROJECTS = [
    {
        "name": "Directory Cleaner",
        "concepts": ["os", "shutil", "pathlib"],
        "test_suite_path": "tests/beginner/directory-cleaner/test_suite.py",
        "description": "Organize messy folders with safe rule-based file moves.",
        "estimated_hours": 2,
    },
    {
        "name": "Personal CLI Journal",
        "concepts": ["file I/O", "datetime", "argparse"],
        "test_suite_path": "tests/beginner/cli-journal/test_suite.py",
        "description": "Capture daily notes and search entries from the terminal.",
        "estimated_hours": 2,
    },
    {
        "name": "Password Generator",
        "concepts": ["secrets", "string", "functions"],
        "test_suite_path": "tests/beginner/password-generator/test_suite.py",
        "description": "Generate secure passwords with configurable constraints.",
        "estimated_hours": 1,
    },
    {
        "name": "Expense Tracker (CSV)",
        "concepts": ["csv", "dicts", "math"],
        "test_suite_path": "tests/beginner/expense-tracker-csv/test_suite.py",
        "description": "Track spending and summarize monthly totals from CSV data.",
        "estimated_hours": 2,
    },
    {
        "name": "Countdown Timer",
        "concepts": ["time", "sys.stdout", "ANSI"],
        "test_suite_path": "tests/beginner/countdown-timer/test_suite.py",
        "description": "Build a resilient terminal countdown with pause/resume states.",
        "estimated_hours": 1,
    },
    {
        "name": "Word Frequency Analyzer",
        "concepts": ["collections.Counter", "re"],
        "test_suite_path": "tests/beginner/word-frequency-analyzer/test_suite.py",
        "description": "Parse text input and report ranked token frequencies.",
        "estimated_hours": 1,
    },
    {
        "name": "Bulk File Renamer",
        "concepts": ["pathlib", "regex", "string formatting"],
        "test_suite_path": "tests/beginner/bulk-file-renamer/test_suite.py",
        "description": "Apply deterministic rename patterns across directory trees.",
        "estimated_hours": 2,
    },
    {
        "name": "Markdown Task Board",
        "concepts": ["file parsing", "state modeling", "cli UX"],
        "test_suite_path": "tests/beginner/markdown-task-board/test_suite.py",
        "description": "Manage a local markdown Kanban board from CLI commands.",
        "estimated_hours": 2,
    },
    {
        "name": "JSON Config Validator",
        "concepts": ["json", "schema validation", "exceptions"],
        "test_suite_path": "tests/beginner/json-config-validator/test_suite.py",
        "description": "Validate config files and report actionable validation errors.",
        "estimated_hours": 2,
    },
    {
        "name": "Log File Inspector",
        "concepts": ["parsing", "datetime", "aggregation"],
        "test_suite_path": "tests/beginner/log-file-inspector/test_suite.py",
        "description": "Analyze logs and surface trend summaries and anomalies.",
        "estimated_hours": 2,
    },
]


def _has_table(table_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return table_name in inspector.get_table_names()


def _column_names(table_name: str) -> set[str]:
    if not _has_table(table_name):
        return set()
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return {column["name"] for column in inspector.get_columns(table_name)}


def _index_names(table_name: str) -> set[str]:
    if not _has_table(table_name):
        return set()
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return {index["name"] for index in inspector.get_indexes(table_name)}


def _create_table_if_missing() -> None:
    if not _has_table("guilds"):
        op.create_table(
            "guilds",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("name", sa.String(length=255), nullable=False, unique=True),
            sa.Column("icon", sa.String(length=64), nullable=False),
            sa.Column("focus_area", sa.String(length=255), nullable=True),
            sa.Column("weekly_challenge_theme", sa.Text(), nullable=True),
            sa.Column("xp_total", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("member_count", sa.Integer(), nullable=False, server_default="0"),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
        )

    if not _has_table("users"):
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("email", sa.String(length=255), nullable=True, unique=True),
            sa.Column("username", sa.String(length=255), nullable=True, unique=True),
            sa.Column("hashed_password", sa.String(length=255), nullable=True),
            sa.Column("full_name", sa.String(length=255), nullable=True),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column("role", sa.String(length=20), nullable=False, server_default="user"),
            sa.Column("xp", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("level", sa.Integer(), nullable=False, server_default="1"),
            sa.Column("github_handle", sa.String(length=255), nullable=True, unique=True),
            sa.Column("rank", sa.String(length=64), nullable=False, server_default="Curious"),
            sa.Column("streak_days", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("guild_id", sa.Integer(), sa.ForeignKey("guilds.id"), nullable=True),
            sa.Column("github_token_enc", sa.Text(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
        )

    if not _has_table("projects"):
        op.create_table(
            "projects",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("title", sa.String(length=255), nullable=True),
            sa.Column("difficulty", sa.String(length=50), nullable=True),
            sa.Column("name", sa.String(length=255), nullable=True),
            sa.Column("tier", sa.String(length=50), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("concepts", sa.JSON(), nullable=True),
            sa.Column("xp_reward", sa.Integer(), nullable=False, server_default="100"),
            sa.Column("test_suite_path", sa.String(length=512), nullable=True),
            sa.Column("estimated_hours", sa.Integer(), nullable=True),
            sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
            sa.Column(
                "is_completed",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            ),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.Column("completed_at", sa.DateTime(), nullable=True),
        )

    if not _has_table("test_cases"):
        op.create_table(
            "test_cases",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
            sa.Column("input_data", sa.String(length=1000), nullable=True),
            sa.Column("expected_output", sa.String(length=1000), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
        )

    if not _has_table("badge_catalog"):
        op.create_table(
            "badge_catalog",
            sa.Column("id", sa.String(length=64), primary_key=True),
            sa.Column("name", sa.String(length=255), nullable=False, unique=True),
            sa.Column("icon", sa.String(length=128), nullable=True),
            sa.Column("rarity", sa.String(length=32), nullable=False),
            sa.Column("category", sa.String(length=32), nullable=False),
            sa.Column("trigger_condition", sa.Text(), nullable=False),
            sa.Column("xp_requirement", sa.Integer(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
        )

    if not _has_table("achievements"):
        op.create_table(
            "achievements",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
            sa.Column(
                "badge_id",
                sa.String(length=64),
                sa.ForeignKey("badge_catalog.id"),
                nullable=True,
            ),
            sa.Column("badge_name", sa.String(length=255), nullable=True),
            sa.Column("badge_icon", sa.String(length=255), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column(
                "earned_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.UniqueConstraint(
                "user_id",
                "badge_id",
                name="uq_achievements_user_badge",
            ),
        )

    if not _has_table("user_progress"):
        op.create_table(
            "user_progress",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
            sa.Column("status", sa.String(length=50), nullable=False, server_default="in_progress"),
            sa.Column("tests_passed", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("total_tests", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("hints_used", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("xp_earned", sa.Integer(), nullable=False, server_default="0"),
            sa.Column(
                "started_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.Column("completed_at", sa.DateTime(), nullable=True),
        )

    if not _has_table("progress"):
        op.create_table(
            "progress",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
            sa.Column("status", sa.String(length=50), nullable=False, server_default="in_progress"),
            sa.Column("tests_passing", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("tests_total", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("hints_used", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("xp_earned", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("sketch_text", sa.Text(), nullable=True),
            sa.Column("pure_run", sa.Boolean(), nullable=False, server_default=sa.false()),
            sa.Column(
                "started_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.Column("completed_at", sa.DateTime(), nullable=True),
            sa.Column(
                "updated_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.UniqueConstraint(
                "user_id",
                "project_id",
                name="uq_progress_user_project",
            ),
        )

    if not _has_table("leaderboard"):
        op.create_table(
            "leaderboard",
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), primary_key=True),
            sa.Column("xp", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("rank", sa.String(length=64), nullable=False, server_default="Curious"),
            sa.Column("completed_count", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("streak_days", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("guild_id", sa.Integer(), sa.ForeignKey("guilds.id"), nullable=True),
            sa.Column(
                "last_active",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
        )

    if not _has_table("activity_log"):
        op.create_table(
            "activity_log",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("event_type", sa.String(length=64), nullable=False),
            sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'::jsonb")),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
        )

    if not _has_table("weekly_challenges"):
        op.create_table(
            "weekly_challenges",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("title", sa.String(length=255), nullable=False),
            sa.Column("guild_id", sa.Integer(), sa.ForeignKey("guilds.id"), nullable=False),
            sa.Column("ends_at", sa.DateTime(), nullable=False),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
        )

    if not _has_table("challenge_submissions"):
        op.create_table(
            "challenge_submissions",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column(
                "challenge_id",
                sa.Integer(),
                sa.ForeignKey("weekly_challenges.id"),
                nullable=False,
            ),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("repo_url", sa.String(length=512), nullable=False),
            sa.Column(
                "submitted_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.UniqueConstraint(
                "challenge_id",
                "user_id",
                name="uq_challenge_submissions_challenge_user",
            ),
        )

    if not _has_table("github_repos"):
        op.create_table(
            "github_repos",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
            sa.Column("repo_name", sa.String(length=255), nullable=False),
            sa.Column("repo_url", sa.String(length=512), nullable=False),
            sa.Column("commit_count", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("last_push_at", sa.DateTime(), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.UniqueConstraint("user_id", "project_id", name="uq_github_repos_user_project"),
        )


def _add_columns_if_missing() -> None:
    users_columns = _column_names("users")
    if "github_handle" not in users_columns:
        op.add_column("users", sa.Column("github_handle", sa.String(length=255), nullable=True))
    if "rank" not in users_columns:
        op.add_column(
            "users",
            sa.Column(
                "rank",
                sa.String(length=64),
                nullable=False,
                server_default="Curious",
            ),
        )
    if "streak_days" not in users_columns:
        op.add_column(
            "users",
            sa.Column("streak_days", sa.Integer(), nullable=False, server_default="0"),
        )
    if "guild_id" not in users_columns:
        op.add_column("users", sa.Column("guild_id", sa.Integer(), nullable=True))
        op.create_foreign_key(
            "fk_users_guild_id_guilds",
            "users",
            "guilds",
            ["guild_id"],
            ["id"],
        )
    if "github_token_enc" not in users_columns:
        op.add_column("users", sa.Column("github_token_enc", sa.Text(), nullable=True))

    projects_columns = _column_names("projects")
    if "name" not in projects_columns:
        op.add_column("projects", sa.Column("name", sa.String(length=255), nullable=True))
    if "tier" not in projects_columns:
        op.add_column("projects", sa.Column("tier", sa.String(length=50), nullable=True))
    if "concepts" not in projects_columns:
        op.add_column("projects", sa.Column("concepts", sa.JSON(), nullable=True))
    if "test_suite_path" not in projects_columns:
        op.add_column(
            "projects",
            sa.Column("test_suite_path", sa.String(length=512), nullable=True),
        )
    if "estimated_hours" not in projects_columns:
        op.add_column(
            "projects",
            sa.Column("estimated_hours", sa.Integer(), nullable=True),
        )

    achievements_columns = _column_names("achievements")
    if "badge_id" not in achievements_columns:
        op.add_column("achievements", sa.Column("badge_id", sa.String(length=64), nullable=True))
        op.create_foreign_key(
            "fk_achievements_badge_id_badge_catalog",
            "achievements",
            "badge_catalog",
            ["badge_id"],
            ["id"],
        )


def _create_indexes_if_missing() -> None:
    if "ix_users_github_handle" not in _index_names("users"):
        op.create_index("ix_users_github_handle", "users", ["github_handle"], unique=True)

    if "ix_projects_tier" not in _index_names("projects"):
        op.create_index("ix_projects_tier", "projects", ["tier"], unique=False)

    if "ix_projects_name" not in _index_names("projects"):
        op.create_index("ix_projects_name", "projects", ["name"], unique=False)

    if "ix_progress_user_id" not in _index_names("progress"):
        op.create_index("ix_progress_user_id", "progress", ["user_id"], unique=False)

    if "ix_progress_project_id" not in _index_names("progress"):
        op.create_index("ix_progress_project_id", "progress", ["project_id"], unique=False)

    if "ix_leaderboard_xp" not in _index_names("leaderboard"):
        op.create_index("ix_leaderboard_xp", "leaderboard", ["xp"], unique=False)

    if "ix_activity_log_created_at" not in _index_names("activity_log"):
        op.create_index(
            "ix_activity_log_created_at",
            "activity_log",
            ["created_at"],
            unique=False,
        )

    if "ix_github_repos_repo_name" not in _index_names("github_repos"):
        op.create_index(
            "ix_github_repos_repo_name",
            "github_repos",
            ["repo_name"],
            unique=False,
        )


def _normalize_existing_columns() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if _has_table("projects"):
        project_columns = {c["name"]: c for c in inspector.get_columns("projects")}
        owner_col = project_columns.get("owner_id")
        if owner_col and not owner_col.get("nullable", True):
            op.alter_column(
                "projects",
                "owner_id",
                existing_type=sa.Integer(),
                nullable=True,
            )

    if _has_table("users"):
        user_columns = {c["name"]: c for c in inspector.get_columns("users")}
        hashed_password_col = user_columns.get("hashed_password")
        if hashed_password_col and not hashed_password_col.get("nullable", True):
            op.alter_column(
                "users",
                "hashed_password",
                existing_type=sa.String(length=255),
                nullable=True,
            )

    projects_table = sa.table(
        "projects",
        sa.column("name", sa.String),
        sa.column("title", sa.String),
        sa.column("tier", sa.String),
        sa.column("difficulty", sa.String),
    )
    if _has_table("projects"):
        bind.execute(
            sa.update(projects_table)
            .where(projects_table.c.name.is_(None))
            .where(projects_table.c.title.is_not(None))
            .values(name=projects_table.c.title)
        )
        bind.execute(
            sa.update(projects_table)
            .where(projects_table.c.tier.is_(None))
            .where(projects_table.c.difficulty.is_not(None))
            .values(tier=projects_table.c.difficulty)
        )

    users_table = sa.table(
        "users",
        sa.column("rank", sa.String),
        sa.column("streak_days", sa.Integer),
    )
    if _has_table("users"):
        bind.execute(
            sa.update(users_table)
            .where(users_table.c.rank.is_(None))
            .values(rank="Curious")
        )
        bind.execute(
            sa.update(users_table)
            .where(users_table.c.streak_days.is_(None))
            .values(streak_days=0)
        )


def _seed_phase_one_data() -> None:
    bind = op.get_bind()

    guilds_table = sa.table(
        "guilds",
        sa.column("name", sa.String),
        sa.column("icon", sa.String),
        sa.column("focus_area", sa.String),
        sa.column("weekly_challenge_theme", sa.Text),
        sa.column("xp_total", sa.Integer),
        sa.column("member_count", sa.Integer),
        sa.column("created_at", sa.DateTime),
    )
    for guild in GUILDS:
        exists = bind.execute(
            sa.select(guilds_table.c.name).where(guilds_table.c.name == guild["name"])
        ).first()
        if exists is None:
            bind.execute(
                sa.insert(guilds_table).values(
                    **guild,
                    xp_total=0,
                    member_count=0,
                    created_at=datetime.utcnow(),
                )
            )

    badge_catalog_table = sa.table(
        "badge_catalog",
        sa.column("id", sa.String),
        sa.column("name", sa.String),
        sa.column("icon", sa.String),
        sa.column("rarity", sa.String),
        sa.column("category", sa.String),
        sa.column("trigger_condition", sa.Text),
        sa.column("xp_requirement", sa.Integer),
        sa.column("created_at", sa.DateTime),
    )
    for badge in BADGES:
        exists = bind.execute(
            sa.select(badge_catalog_table.c.id).where(badge_catalog_table.c.id == badge["id"])
        ).first()
        if exists is None:
            bind.execute(
                sa.insert(badge_catalog_table).values(
                    **badge,
                    created_at=datetime.utcnow(),
                )
            )

    projects_table = sa.table(
        "projects",
        sa.column("title", sa.String),
        sa.column("difficulty", sa.String),
        sa.column("name", sa.String),
        sa.column("tier", sa.String),
        sa.column("description", sa.Text),
        sa.column("concepts", sa.JSON),
        sa.column("xp_reward", sa.Integer),
        sa.column("test_suite_path", sa.String),
        sa.column("estimated_hours", sa.Integer),
        sa.column("owner_id", sa.Integer),
        sa.column("is_completed", sa.Boolean),
        sa.column("created_at", sa.DateTime),
    )
    for project in BEGINNER_PROJECTS:
        exists = bind.execute(
            sa.select(projects_table.c.name).where(
                projects_table.c.name == project["name"]
            )
        ).first()
        if exists is None:
            bind.execute(
                sa.insert(projects_table).values(
                    title=project["name"],
                    difficulty="beginner",
                    name=project["name"],
                    tier="beginner",
                    description=project["description"],
                    concepts=project["concepts"],
                    xp_reward=100,
                    test_suite_path=project["test_suite_path"],
                    estimated_hours=project["estimated_hours"],
                    owner_id=None,
                    is_completed=False,
                    created_at=datetime.utcnow(),
                )
            )


def upgrade() -> None:
    # [x] Step 1 - Schema audit and gap fill completed in migration 20260330_0001.
    _create_table_if_missing()
    _add_columns_if_missing()
    _create_indexes_if_missing()
    _normalize_existing_columns()
    _seed_phase_one_data()


def downgrade() -> None:
    # This migration is intentionally additive to respect existing user data.
    pass
