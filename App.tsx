import { useState, useEffect, Suspense, lazy } from 'react'
import { LoginPage } from './components/LoginPage'
import { ChatBot } from './components/ChatBot'
import { UserProfile } from './components/UserProfile'
import { NotificationCenter } from './components/NotificationCenter'
import { GlobalSearch } from './components/GlobalSearch'
import { ExportManager } from './components/ExportManager'
import { Sidebar } from './components/Sidebar'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ServerStatus } from './components/ServerStatus'

// Lazy load heavy dashboard components
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })))
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const UserDashboard = lazy(() => import('./components/UserDashboard').then(m => ({ default: m.UserDashboard })))
const ITOperations = lazy(() => import('./components/ITOperations').then(m => ({ default: m.ITOperations })))
const FinOps = lazy(() => import('./components/FinOps').then(m => ({ default: m.FinOps })))
const ESGMonitoring = lazy(() => import('./components/ESGMonitoring').then(m => ({ default: m.ESGMonitoring })))
const ProjectCollaboration = lazy(() => import('./components/ProjectCollaboration').then(m => ({ default: m.ProjectCollaboration })))
const AIInsights = lazy(() => import('./components/AIInsights').then(m => ({ default: m.AIInsights })))
const IdentityManagement = lazy(() => import('./components/IdentityManagement').then(m => ({ default: m.IdentityManagement })))
const AuditTrails = lazy(() => import('./components/AuditTrails').then(m => ({ default: m.AuditTrails })))
const ResourceOptimization = lazy(() => import('./components/ResourceOptimization').then(m => ({ default: m.ResourceOptimization })))

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Modal states
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showExportManager, setShowExportManager] = useState(false)

  const handleLogin = (userData?: any) => {
    setIsAuthenticated(true)
    if (userData) {
      setUser(userData)
    }
  }

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser)
    setShowUserProfile(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('organizeit_session')
    setActiveSection('dashboard')
  }

  // Initialize data and check for existing session on app load
  useEffect(() => {
    let isMounted = true
    
    const initializeApp = async () => {
      try {
        // Check for existing session first (fast operation)
        const savedSession = localStorage.getItem('organizeit_session')
        if (savedSession && isMounted) {
          const sessionData = JSON.parse(savedSession)
          const { user: savedUser, timestamp } = sessionData
          
          // Check if session is still valid (within 30 days)
          const sessionAge = Date.now() - timestamp
          const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days
          
          if (sessionAge < maxAge && savedUser) {
            console.log('Restoring saved session for:', savedUser.email)
            setUser(savedUser)
            setIsAuthenticated(true)
          } else {
            // Clean up expired session
            localStorage.removeItem('organizeit_session')
          }
        }

        // Initialize data in background (non-blocking)
        setTimeout(async () => {
          if (!isMounted) return
          
          try {
            const { initializeData } = await import('./initialize-data')
            await initializeData()
          } catch (initError) {
            console.log('⚠️ Background data initialization completed with warnings')
          }
        }, 100) // Small delay to prevent blocking UI

      } catch (error) {
        console.error('Error during app initialization:', error)
        localStorage.removeItem('organizeit_session')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initializeApp()
    
    return () => {
      isMounted = false
    }
  }, [])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
      
      // Cmd/Ctrl + / for help/shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        // Could show help modal here
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowUserProfile(false)
        setShowNotifications(false)
        setShowSearch(false)
        setShowExportManager(false)
      }
    }

    if (isAuthenticated) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAuthenticated])

  const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-primary-foreground font-bold text-sm">O</span>
        </div>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    </div>
  )

  const renderContent = () => {
    // Check if user is admin or regular user
    const isAdmin = user?.role === 'Admin'
    const isRegularUser = user?.role === 'User' || user?.role === 'DevOps Engineer' || user?.role === 'Data Engineer'
    
    const content = (() => {
      switch (activeSection) {
        case 'dashboard':
          if (isAdmin) {
            return <AdminDashboard />
          } else if (isRegularUser) {
            return <UserDashboard user={user} />
          } else {
            return <Dashboard />
          }
        case 'it-operations':
          return <ITOperations />
        case 'finops':
          return <FinOps />
        case 'esg':
          return <ESGMonitoring />
        case 'collaboration':
          return <ProjectCollaboration />
        case 'ai-insights':
          return <AIInsights />
        case 'identity':
          return <IdentityManagement />
        case 'audit':
          return <AuditTrails />
        case 'optimization':
          return <ResourceOptimization />
        default:
          if (isAdmin) {
            return <AdminDashboard />
          } else if (isRegularUser) {
            return <UserDashboard user={user} />
          } else {
            return <Dashboard />
          }
      }
    })()

    return (
      <Suspense fallback={<LoadingFallback />}>
        {content}
      </Suspense>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-primary-foreground font-bold">O</span>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold">OrganizeIT</div>
            <div className="text-sm text-muted-foreground">Loading your workspace...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-background">
      <ServerStatus />
      
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        user={user}
        onShowProfile={() => setShowUserProfile(true)}
        onShowNotifications={() => setShowNotifications(true)}
        onShowSearch={() => setShowSearch(true)}
        onShowExport={() => setShowExportManager(true)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
      
      <ChatBot activeSection={activeSection} />
      
      {/* Modals */}
      {showUserProfile && (
        <UserProfile
          user={user}
          onClose={() => setShowUserProfile(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
      
      {showNotifications && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
      
      {showSearch && (
        <GlobalSearch
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onNavigate={(section) => {
            setActiveSection(section)
            setShowSearch(false)
          }}
        />
      )}
      
      {showExportManager && (
        <ExportManager
          isOpen={showExportManager}
          onClose={() => setShowExportManager(false)}
          activeModule={activeSection}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}