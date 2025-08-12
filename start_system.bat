@echo off
echo Starting Hospital Overcrowding Management System...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "python hospital_system.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "npm start"

echo.
echo System started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause