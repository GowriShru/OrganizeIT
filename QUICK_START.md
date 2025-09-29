# 🚀 OrganizeIT Platform - Quick Start Guide

## ⚠️ IMPORTANT: Start Backend Server First!

The platform requires both a backend API server and the frontend React app to run properly.

## 🔧 Start Instructions

### Option 1: Automatic Start (Windows)
```bash
# Double-click or run:
start.bat
```

### Option 2: Automatic Start (Mac/Linux)
```bash
chmod +x start.sh
./start.sh
```

### Option 3: Manual Start (Step by Step)

**Step 1: Install Dependencies**
```bash
npm install
```

**Step 2: Start Backend Server (FIRST!)**
```bash
npm run server
```
✅ API Server should now be running on: `http://localhost:8080`

**Step 3: Start Frontend (In a NEW terminal)**
```bash
npm run dev
```
✅ React App should now be running on: `http://localhost:3000`

### Option 4: Run Both Together
```bash
npm run dev:full
```

## 🔐 Login Credentials
- **Email:** `demo@organizeit.com`
- **Password:** `demo123`

## 🚨 Troubleshooting

### Error: "Failed to fetch"
This means the backend server is not running. Make sure to:
1. Start the backend server first: `npm run server`
2. Verify it's running at `http://localhost:8080`
3. Then start the frontend: `npm run dev`

### Port Already in Use
- Frontend will automatically try ports 3001, 3002, etc.
- For backend, kill any existing processes on port 8080

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## ✅ Success Indicators

You should see:
- Backend console: "🚀 OrganizeIT API Server running on http://localhost:8080"
- Frontend console: "Local: http://localhost:3000"
- No "Failed to fetch" errors in browser console

## 📊 Features Available

Once both servers are running, you'll have access to:
- **Admin Dashboard** - System metrics and management
- **IT Operations** - Performance monitoring and incident management  
- **FinOps** - Cost optimization and budget tracking
- **ESG Monitoring** - Carbon footprint and sustainability metrics
- **AI Insights** - Predictive analytics and recommendations
- **Global Search** - Press Cmd/Ctrl + K
- **Notifications** - Real-time system alerts
- **Export Manager** - Multi-format data export

Enjoy exploring the OrganizeIT Platform! 🎉