import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ThemeToggle } from './ThemeToggle'
import { 
  LayoutDashboard, 
  Server, 
  DollarSign, 
  Leaf, 
  Users, 
  Brain, 
  Shield, 
  FileText, 
  Zap,
  Settings,
  Bell,
  Search,
  Download,
  User,
  LogOut
} from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  user?: any
  onShowProfile?: () => void
  onShowNotifications?: () => void
  onShowSearch?: () => void
  onShowExport?: () => void
  onLogout?: () => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'it-operations', label: 'IT Operations', icon: Server, badge: '3' },
  { id: 'finops', label: 'FinOps', icon: DollarSign },
  { id: 'esg', label: 'ESG Monitoring', icon: Leaf },
  { id: 'collaboration', label: 'Project Collaboration', icon: Users, badge: '12' },
  { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  { id: 'identity', label: 'Identity Management', icon: Shield },
  { id: 'audit', label: 'Audit Trails', icon: FileText },
  { id: 'optimization', label: 'Resource Optimization', icon: Zap },
]

export function Sidebar({ 
  activeSection, 
  onSectionChange, 
  user,
  onShowProfile,
  onShowNotifications,
  onShowSearch,
  onShowExport,
  onLogout
}: SidebarProps) {
  const getInitials = (name: string) => {
    if (!name) return 'DU'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('organizeit_session')
      window.location.reload()
    }
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">O</span>
          </div>
          <div>
            <h1 className="font-semibold">OrganizeIT</h1>
            <p className="text-xs text-muted-foreground">AI-Driven IT Platform</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShowSearch}
            className="flex items-center gap-2 text-xs"
          >
            <Search className="w-3 h-3" />
            Search
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShowNotifications}
            className="flex items-center gap-2 text-xs relative"
          >
            <Bell className="w-3 h-3" />
            Alerts
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>
        </div>
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShowExport}
            className="w-full flex items-center gap-2 text-xs"
          >
            <Download className="w-3 h-3" />
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>
      
      {/* User Section */}
      <div className="p-4 border-t border-border space-y-3">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-xs">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Demo User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role || 'System Administrator'}</p>
          </div>
        </div>

        {/* User Actions */}
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start gap-3 h-8"
            onClick={onShowProfile}
          >
            <User className="w-3 h-3" />
            Profile & Settings
          </Button>
          
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-1 justify-start gap-3 h-8"
              onClick={handleLogout}
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}