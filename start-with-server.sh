#!/bin/bash

echo "Starting OrganizeIT Platform with Backend Server..."
echo

echo "[1/3] Installing dependencies (if needed)..."
npm install --silent

echo "[2/3] Starting backend API server..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="OrganizeIT API Server" -- bash -c "npm run server; exec bash"
elif command -v osascript &> /dev/null; then
    osascript -e 'tell app "Terminal" to do script "cd \"$(pwd)\" && npm run server"'
else
    echo "Starting server in background..."
    npm run server &
    SERVER_PID=$!
    echo "Server PID: $SERVER_PID"
fi

echo "[3/3] Waiting for server to start..."
sleep 3

echo "Starting frontend development server..."
npm run dev

echo
echo "If you see any 'Failed to fetch' errors, make sure the API server is still running."
echo "Backend Server: http://localhost:8080"
echo "Frontend App: http://localhost:3000"