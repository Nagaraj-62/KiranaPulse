@echo off
echo ===============================
echo 🚀 Starting Grocery Tracker App
echo ===============================

REM Step 1: Activate virtual environment and start FastAPI backend
echo.
echo ▶ Starting FastAPI backend...
start cmd /k "cd /d %~dp0 && venv\Scripts\activate && uvicorn backend.main:app --reload"

REM Step 2: Start React frontend
echo.
echo ▶ Starting React frontend...
start cmd /k "cd grocery-frontend && npm start"

echo.
echo ✅ All systems up! Backend and frontend are running in separate terminals.
pause
