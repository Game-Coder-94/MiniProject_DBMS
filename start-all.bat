@echo off
echo Starting AstroPin...
echo.
echo Starting Backend Server (Port 3000)...
cd server
start cmd /k "npm install & node server.js"

timeout /t 2

echo.
echo Starting Frontend Dev Server (Port 5173)...
cd ../client
start cmd /k "npm install & npm run dev"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
