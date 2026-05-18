# Restructure Tracking

Date: 2026-03-29

## Pain Points Identified

- Frontend and backend were mixed at repository root.
- Duplicate dependency files existed in backend (`requirements.txt` + typo variant).
- Shared auth and achievement logic lived inside routers.
- API access patterns were inconsistent across frontend services.
- Root README and docs did not describe actual project state.

## Changes Applied

- Moved backend to `backend/` and frontend to `frontend/`.
- Added backend `models/`, `services/`, and `utils/` package boundaries.
- Moved page-level React views into `frontend/src/pages/`.
- Renamed frontend API client to `apiService.js` and centralized API calls.
- Added docs and templates: `README.md`, `.env.example`, `LICENSE`, `docs/*`.

## Follow-Up Recommendations

- Add CI workflows for backend tests and frontend lint/test.
- Replace remaining mojibake strings in legacy UI/test files.
- Add stricter typed contracts for API responses between frontend/backend.

---

# Surgical Fix Pass - May 18, 2026

Date: 2026-05-18

## Critical Issues Resolved

Applied 10 targeted fixes to address identified bottlenecks and issues:

1. **Rank Calculation System** - Centralized rank logic with RANK_THRESHOLDS and getRankFromXP()
2. **Auth Loading Flash** - Added loading guard to prevent auth modal during token validation
3. **Redundant Stats Calls** - Removed duplicate statsService.getMyStats() from App.jsx
4. **Dashboard Crash** - Added getRecentProjects() method and data transformation logic
5. **Missing Stats Fields** - Extended StatisticsSchema with 13 new fields
6. **False Leaderboard Data** - Replaced Math.random() with honest placeholders
7. **Incomplete Features** - Added development notices for streak tracking
8. **N+1 Query Problem** - Fixed leaderboard query using aggregation (101→1 query)
9. **Insecure Defaults** - Added SECRET_KEY runtime warning
10. **Dead Code** - Archived unused CodeSprint.jsx component

## Validation Status

- ✅ Frontend builds successfully (Vite v7.3.2)
- ✅ Backend syntax validated (all files compile)
- ✅ No new packages introduced
- ✅ All architectural constraints maintained
- ⚠️  pytest infrastructure not available (backend tests pending)

## Detailed Documentation

See `docs/FIXES.md` for complete fix details, impact analysis, and deployment checklist.

## GitHub Status

- Commit: `57cd641`
- Branch: master
- Status: Pushed successfully to origin
- Files changed: 31 files, 5647 insertions
- New files: 20+ (docs, security configs, scripts)
