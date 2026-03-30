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
