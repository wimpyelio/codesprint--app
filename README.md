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

## Contributing

1. Create a feature branch.
2. Use Conventional Commits.
3. Open a PR with a short summary, testing notes, and rollback notes.
