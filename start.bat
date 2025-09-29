@echo off
echo Starting OrganizeIT Platform...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting backend server and frontend development server...
echo Backend API: http://localhost:8080
echo Frontend App: http://localhost:3000
echo.

start cmd /k "node server.js"
timeout /t 3 >nul
npm run dev

pause