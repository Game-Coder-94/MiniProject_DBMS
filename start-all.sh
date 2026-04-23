#!/bin/bash

# AstroPin Startup Script for macOS/Linux

echo "Starting AstroPin..."
echo ""

# Start Backend Server
echo "Starting Backend Server (Port 3000)..."
cd server
npm install > /dev/null 2>&1
node server.js &
BACKEND_PID=$!

sleep 2

# Start Frontend Dev Server
echo "Starting Frontend Dev Server (Port 5173)..."
cd ../client
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!

echo ""
echo "AstroPin is starting up..."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Keep script running
wait
