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

- `GET /stats/me/stats`
- `GET /stats/{user_id}/public-stats`
- `GET /stats/progress/by-difficulty`
- `GET /stats/badges/my-badges`

## Achievements

- `GET /achievements/`
- `GET /achievements/user`
- `GET /achievements/progress`
