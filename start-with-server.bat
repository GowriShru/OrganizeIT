@echo off
echo Starting OrganizeIT Platform with Backend Server...
echo.

echo [1/3] Installing dependencies (if needed)...
call npm install --silent

echo [2/3] Starting backend API server...
start "OrganizeIT API Server" cmd /k "npm run server"

echo [3/3] Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Starting frontend development server...
npm run dev

echo.
echo If you see any "Failed to fetch" errors, make sure the API server window is still running.
echo Backend Server: http://localhost:8080
echo Frontend App: http://localhost:3000
pause