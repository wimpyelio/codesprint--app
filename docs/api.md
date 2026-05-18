# API Reference (High-Level)

Base URL: `http://localhost:8000/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`

## Users

- `GET /users/me`
- `PUT /users/me`
- `GET /users/{user_id}`
- `GET /users/{user_id}/achievements`
- `GET /users/{user_id}/projects`
- `GET /users/{user_id}/stats`

## Projects

- `GET /projects/`
- `GET /projects/{project_id}`
- `POST /projects/`
- `PUT /projects/{project_id}`
- `DELETE /projects/{project_id}`
- `POST /projects/{project_id}/test-cases`

## Progress

- `GET /progress/`
- `POST /progress/{project_id}/start`
- `POST /progress/{project_id}/complete`

## Leaderboard

- `GET /leaderboard/global`
- `GET /leaderboard/friends/{user_id}`
- `GET /leaderboard/weekly`
- `GET /leaderboard/streak`

## Stats

- `GET /stats/me/stats` - Returns user statistics with rank progression, weekly stats, and breakdown by difficulty
  - Response fields:
    - `rank`: Current rank name
    - `xp_for_current_rank`, `xp_for_next_rank`: XP boundaries for rank progression
    - `rank_position`: User's position in global rankings
    - `weekly_xp`: XP earned in last 7 days
    - `weekly_xp_change`: % change vs previous 7 days
    - `projects_this_week`, `hints_this_week`: Weekly activity
    - `beginner_completed`, `intermediate_completed`, `advanced_completed`: Projects by tier
    - `accuracy_percent`: % of completions with zero hints
    - `total_badges`: Count of all badges in system
    - `best_streak`: User's longest streak
- `GET /stats/{user_id}/public-stats` - Public statistics for another user
- `GET /stats/progress/by-difficulty` - Breakdown of user progress by project tier
- `GET /stats/badges/my-badges` - List of user's earned badges

## Achievements

- `GET /achievements/`
- `GET /achievements/user`
- `GET /achievements/progress`
