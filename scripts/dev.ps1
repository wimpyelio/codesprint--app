Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Starting backend and frontend in separate terminals..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; uvicorn app.main:app --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
