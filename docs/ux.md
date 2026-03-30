# UX Flows

## Authentication

1. User opens app.
2. If no valid token exists, `AuthModal` is shown.
3. Successful login/register stores JWT and loads dashboard data.

## Core Navigation

1. User lands on Dashboard.
2. Nav tabs switch between Dashboard, Leaderboard, Achievements, and Community.
3. API errors are surfaced in-page and rendering failures are caught by `ErrorBoundary`.

## Progress Loop

1. User starts/completes projects.
2. Backend updates XP, level, and progress state.
3. Achievements and leaderboard reflect updated performance.
