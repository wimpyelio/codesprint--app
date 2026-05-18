# CodeSprint

CodeSprint is a gamified coding platform with a React frontend and FastAPI backend.

## Repository Layout

```text
codesprint-app/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── utils/
│   ├── tests/
│   └── package.json
├── docs/
│   ├── design.md
│   ├── ux.md
│   ├── api.md
│   ├── tracking.md
│   └── archive/
├── scripts/
├── .env.example
├── .gitignore
└── LICENSE
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment

Copy root `.env.example` to `.env` and update values as needed.

## Validation Commands

```bash
cd backend
python -m pytest
```

```bash
cd frontend
npm run lint
npm run test
```

## Latest Updates

**May 18, 2026**: Applied critical surgical fix pass (10 fixes). See [docs/FIXES.md](docs/FIXES.md) for details.

Key improvements:
- ✅ Fixed auth loading flash
- ✅ Eliminated redundant API calls
- ✅ Fixed Dashboard crash
- ✅ Fixed N+1 leaderboard query (99% reduction)
- ✅ Extended stats endpoint with 13 new fields
- ✅ Added secure defaults warnings
- ✅ Archived dead code

Frontend builds successfully, backend syntax validated.

## Contributing

1. Create a feature branch.
2. Use Conventional Commits.
3. Open a PR with a short summary, testing notes, and rollback notes.
