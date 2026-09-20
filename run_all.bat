@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not on PATH.
  echo Please install Node.js and then run this file again.
  pause
  exit /b 1
)

call npm install

set PORT=3001
start "FLX Real Estate Backend" cmd /k "node server.js"
start "FLX Real Estate Frontend" cmd /k "npm run dev"

start "" http://localhost:3000

echo.
echo FLX Real Estate app starting...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001/api/health
echo.
echo Both processes are starting in separate windows.
echo Close those windows when you are done.
pause
