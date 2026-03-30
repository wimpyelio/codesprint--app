# CodeSprint Backend

FastAPI backend for authentication, projects, progress tracking, leaderboard, and achievements.

## Run Locally

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── routers/
│   ├── models/
│   ├── services/
│   └── utils/
├── tests/
├── requirements.txt
└── Dockerfile
```

## API Docs

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
