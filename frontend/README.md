# CodeSprint Frontend

React + Vite frontend for the CodeSprint platform.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
```

## Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   └── utils/
├── tests/
└── package.json
```

## Environment

Use `VITE_API_BASE_URL` to point to backend API:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```
