# Backend Server Setup Guide

## 🚨 Important: API Server Required for Full Functionality

The OrganizeIT platform requires a backend API server to function properly. Without it, you'll see "Failed to fetch" errors and limited functionality.

## Quick Start

### Option 1: Automatic (Recommended)
```bash
npm run dev:full
```
This starts both the backend API server and frontend simultaneously.

### Option 2: Manual Start
1. **Start Backend Server:**
   ```bash
   npm run server
   ```
   Server will run on `http://localhost:8080`

2. **Start Frontend (in new terminal):**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## Troubleshooting

### Error: "Failed to fetch" or "TypeError: Failed to fetch"
This indicates the API server is not running. Solutions:

1. **Check if server is running:**
   - Visit `http://localhost:8080/api/health` in your browser
   - Should return: `{"status":"OK","message":"OrganizeIT API Server is running"}`

2. **Start the server:**
   ```bash
   npm run server
   ```

3. **Check for port conflicts:**
   - Default server port: 8080
   - If busy, server will auto-increment to 8081, 8082, etc.
   - Check console output for actual port

### Port Already in Use
If port 8080 is busy:
```bash
PORT=8081 npm run server
```

Then update the API base URL in `/utils/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8081/api'
```

## Server Features

When running, the server provides:
- ✅ Real-time metrics and data
- ✅ Working button actions and API calls
- ✅ Admin and user dashboard functionality
- ✅ Project management operations
- ✅ AI insights and optimization features
- ✅ Audit trail logging
- ✅ Resource optimization recommendations

## Without Server (Demo Mode)

If you choose not to run the server:
- ❌ API-dependent buttons will show errors
- ❌ Real-time data updates won't work
- ❌ Some dashboards may have limited functionality
- ✅ UI components and basic navigation still work
- ✅ Mock data is displayed for demo purposes

## Verification

To verify everything is working:
1. Open the application at `http://localhost:3000`
2. Login with demo credentials
3. Try clicking action buttons (should show success messages)
4. Check browser console for any "Failed to fetch" errors

If you see success messages when clicking buttons, the server is running correctly!