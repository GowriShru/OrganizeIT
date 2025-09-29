#!/bin/bash

echo "Starting OrganizeIT Platform..."
echo ""

echo "Installing dependencies..."
npm install

echo ""
echo "Starting backend server and frontend development server..."
echo "Backend API: http://localhost:8080"
echo "Frontend App: http://localhost:3000"
echo ""

# Start the backend server in the background
node server.js &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 3

# Start the frontend development server
npm run dev

# Clean up: kill the server when the script exits
trap "kill $SERVER_PID" EXIT