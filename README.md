# OrganizeIT Platform

A comprehensive AI-driven platform for intelligent IT operations that unifies IT operations, FinOps, ESG monitoring, project collaboration, and decentralized identity management in hybrid cloud environments.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Visual Studio Code** - [Download here](https://code.visualstudio.com/)
- **Git** (optional) - [Download here](https://git-scm.com/)

### Installation & Setup

#### Option 1: Automatic Start (Recommended)

**Windows:**
1. Open the project folder in VS Code
2. Double-click `start.bat` or run it from terminal:
   ```bash
   ./start.bat
   ```

**macOS/Linux:**
1. Open the project folder in VS Code
2. Make the script executable and run it:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

#### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm run server
   ```
   The API server will start on `http://localhost:8080`

3. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   npm run dev
   ```
   The React app will open at `http://localhost:3000`

#### Option 3: Run Both Simultaneously
```bash
npm run dev:full
```

## 🔐 Login Credentials

Use these demo credentials to access the platform:
- **Email:** `demo@organizeit.com`
- **Password:** `demo123`

Or you can use any email/password combination as the system currently accepts any credentials for demo purposes.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4 with custom design system
- **UI Components:** ShadCN/UI component library
- **Charts:** Recharts for data visualization
- **Icons:** Lucide React
- **Build Tool:** Vite

### Backend (Node.js + Express)
- **Server:** Express.js with CORS enabled
- **Data Storage:** In-memory storage for demo purposes
- **API Endpoints:** RESTful API design
- **Real-time Data:** Dynamic data generation with realistic variations

## 📊 Key Features

### Dashboard Views
- **Admin Dashboard:** System overview, user management, security monitoring
- **User Dashboard:** Personalized workspace for regular users
- **IT Operations:** Infrastructure monitoring, incident management, performance metrics
- **FinOps:** Cost optimization, budget tracking, multi-cloud financial analytics
- **ESG Monitoring:** Carbon footprint tracking, sustainability metrics
- **AI Insights:** Machine learning-powered recommendations and analytics

### Global Features
- **Global Search (Cmd/Ctrl + K):** Cross-module intelligent search
- **Notification Center:** Real-time alerts and system notifications
- **Export Manager:** Multi-format data export (PDF, Excel, CSV, JSON)
- **Theme Management:** Light/dark mode with system preference detection
- **User Profiles:** Comprehensive profile management and preferences

## 🛠️ Development

### File Structure
```
├── components/           # React components
│   ├── ui/              # ShadCN UI components
│   ├── AdminDashboard.tsx
│   ├── ITOperations.tsx
│   ├── FinOps.tsx
│   └── ...
├── styles/              # Global CSS and theme configuration
├── utils/               # Utility functions
├── server.js            # Backend API server
├── App.tsx              # Main React application
└── main.tsx             # Application entry point
```

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both frontend and backend simultaneously
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### API Endpoints
- `GET /api/health` - Server health check
- `GET /api/admin-dashboard` - Admin dashboard metrics
- `GET /api/operations` - IT operations data
- `GET /api/finops` - Financial operations data
- `GET /api/esg` - ESG monitoring data
- `GET /api/projects` - Project collaboration data
- `GET /api/notifications` - User notifications

## 🔧 Troubleshooting

### Common Issues

**1. Port Already in Use**
If port 3000 or 8080 is busy:
- Frontend will automatically try ports 3001, 3002, etc.
- For backend, change the PORT in `server.js` or set environment variable:
  ```bash
  PORT=8081 npm run server
  ```

**2. Dependencies Issues**
Clear and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

**3. API Connection Errors**
Ensure both servers are running:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

**4. TypeScript Errors**
Check TypeScript configuration:
```bash
npx tsc --noEmit
```

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Auto Rename Tag

## 🌟 Key Metrics & Features

### Demonstrated Capabilities
- **MTTD/MTTR Monitoring:** Mean Time to Detect (8.2 min) and Mean Time to Recover (24.5 min)
- **Cost Optimization:** $67,500/month potential savings identified
- **Carbon Footprint:** 42.3 tons CO2 with 12% monthly reduction
- **System Health:** 98.7% overall system health score
- **Uptime Monitoring:** 99.87% system uptime tracking
- **Budget Management:** Real-time budget utilization and alerts
- **Multi-Cloud Support:** AWS, Azure, and GCP cost analytics

### Enterprise-Grade Features
- Role-based access control and user management
- Real-time performance monitoring and alerting
- Comprehensive audit trails and compliance tracking
- AI-powered cost optimization recommendations
- ESG metrics and sustainability reporting
- Project collaboration and resource management
- Blockchain-based audit trails for security
- Advanced data visualization and reporting

## 📈 Data & Analytics

The platform generates realistic enterprise data including:
- Live performance metrics with business hour patterns
- Dynamic cost data with growth trends and variations
- Realistic alert scenarios and incident management
- User activity patterns and engagement metrics
- ESG compliance data and sustainability initiatives
- Project progress tracking and resource allocation

## 🔒 Security & Compliance

- JWT-based authentication system
- Role-based access control (RBAC)
- Audit trail logging for all operations
- SOC2 Type II compliance framework
- Data encryption and secure communication
- Privacy-first design with minimal data collection

## 📧 Support

For technical issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure all prerequisites are properly installed
4. Verify both frontend and backend servers are running

## 🚀 Production Deployment

For production deployment:
1. Build the frontend: `npm run build`
2. Set up environment variables for production APIs
3. Configure proper database connections
4. Implement real authentication system
5. Set up monitoring and logging
6. Configure SSL certificates and security headers

---

**OrganizeIT Platform** - Transforming IT Operations with AI-Driven Intelligence