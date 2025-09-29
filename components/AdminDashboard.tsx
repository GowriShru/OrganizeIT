import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Database,
  Cloud,
  BarChart3,
  UserCheck,
  Lock,
  Server,
  CreditCard,
  Leaf,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from "sonner@2.0.3"

export function AdminDashboard() {
  const [systemStats, setSystemStats] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [notifications, setNotifications] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [userActivity, setUserActivity] = useState([])
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [auditEvents, setAuditEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Calculate service data from real services data
  const serviceData = services.length > 0 ? [
    { name: 'Healthy', value: services.filter(s => s.status === 'healthy').length, color: '#22c55e' },
    { name: 'Degraded', value: services.filter(s => s.status === 'degraded').length, color: '#f59e0b' },
    { name: 'Warning', value: services.filter(s => s.status === 'warning').length, color: '#f59e0b' },
    { name: 'Down', value: services.filter(s => s.status === 'down').length, color: '#ef4444' }
  ].filter(item => item.value > 0) : []

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        let metricsData = {
          system_health: 98.7,
          monthly_spend: 285000,
          carbon_footprint: 42.3,
          uptime: 99.87
        }

        // Try to fetch real data from API server
        try {
          const baseUrl = 'http://localhost:8080/api'
          const headers = {
            'Content-Type': 'application/json'
          }

          const dashboardResponse = await fetch(`${baseUrl}/admin-dashboard`, { headers })
          if (dashboardResponse.ok) {
            const dashboardData = await dashboardResponse.json()
            metricsData = dashboardData.data
            console.log('✓ Successfully fetched real data from API server')
          } else {
            console.log('⚠️ API server not responding, using fallback data')
          }
        } catch (apiError) {
          console.log('⚠️ API server not available, using fallback data. Start server with: npm run server')
        }
        
        // Mock user data for now
        const mockUsers = [
          { id: 1, name: 'John Doe', status: 'Active', role: 'Admin' },
          { id: 2, name: 'Jane Smith', status: 'Active', role: 'User' },
          { id: 3, name: 'Mike Johnson', status: 'Inactive', role: 'User' }
        ]
        setUsers(mockUsers)

        // Mock services data for now
        const mockServices = [
          { id: 'SVC-001', name: 'Web Frontend', status: 'healthy' },
          { id: 'SVC-002', name: 'User API', status: 'healthy' },
          { id: 'SVC-003', name: 'Payment API', status: 'degraded' }
        ]
        setServices(mockServices)

        // Calculate comprehensive system stats
        const healthyServices = mockServices.filter(s => s.status === 'healthy').length
        const degradedServices = mockServices.filter(s => s.status === 'degraded' || s.status === 'warning').length
        const downServices = mockServices.filter(s => s.status === 'down').length
        const totalServices = mockServices.length
        const activeUsers = mockUsers.filter(u => u.status === 'Active').length

        setSystemStats({
          totalUsers: mockUsers.length,
          activeUsers: activeUsers,
          systemHealth: metricsData.system_health,
          totalServices: totalServices,
          healthyServices: healthyServices,
          degradedServices: degradedServices,
          downServices: downServices,
          monthlySpend: metricsData.monthly_spend,
          budgetUtilization: Math.round((metricsData.monthly_spend / 400000) * 100), // Assuming 400K budget
          carbonFootprint: metricsData.carbon_footprint,
          sustainabilityScore: 83,
          uptime: metricsData.uptime || 99.87,
          mttd: 8.2,
          mttr: 24.5
        })

        // Try to fetch notifications
        let notificationsData = []
        try {
          const baseUrl = 'http://localhost:8080/api'
          const headers = { 'Content-Type': 'application/json' }
          const notificationsResponse = await fetch(`${baseUrl}/notifications`, { headers })
          if (notificationsResponse.ok) {
            const data = await notificationsResponse.json()
            notificationsData = data.data.notifications
          }
        } catch {
          // Use fallback notifications
          notificationsData = [
            {
              id: 'NOT-001',
              type: 'alert',
              title: 'High CPU Usage Detected',
              message: 'Web frontend instances showing sustained high CPU usage',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              read: false,
              severity: 'warning'
            }
          ]
        }
        setNotifications(notificationsData)

        // Mock alerts for now
        const mockAlerts = [
          {
            id: 'ALT-001',
            severity: 'High',
            title: 'Database Connection Pool Exhaustion',
            description: 'Payment processing database showing connection pool exhaustion.',
            service: 'Payment API',
            timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
            status: 'Active'
          }
        ]
        setAlerts(mockAlerts)

        // Generate mock performance data for weekly view
        const weeklyData = []
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        for (let i = 0; i < 7; i++) {
          weeklyData.push({
            name: days[i],
            uptime: Math.max(98, Math.min(100, 99.5 + (Math.random() - 0.5) * 1)),
            response: Math.max(100, Math.min(800, 250 + (Math.random() - 0.5) * 100))
          })
        }
        setPerformanceData(weeklyData)

        // Generate user activity data based on current hour
        const currentHour = new Date().getHours()
        const hourlyActivity = []
        for (let hour = 0; hour < 24; hour += 4) {
          const baseActivity = hour >= 8 && hour <= 18 ? 60 : 20 // Business hours
          const variance = Math.floor(Math.random() * 40) - 20
          hourlyActivity.push({
            time: String(hour).padStart(2, '0') + ':00',
            active: Math.max(5, Math.min(100, baseActivity + variance))
          })
        }
        setUserActivity(hourlyActivity)

        // Mock audit events for now
        const mockAuditEvents = [
          {
            id: 'AUD-001',
            action: 'User Login',
            user: 'john.doe@company.com',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            status: 'Success'
          },
          {
            id: 'AUD-002',
            action: 'System Configuration Change',
            user: 'admin@company.com',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'Success'
          }
        ]
        setAuditEvents(mockAuditEvents)

      } catch (error) {
        console.error('Error fetching admin dashboard data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'Manage Users':
        toast.success("Opening user management interface")
        break
      case 'Run Audit':
        toast.info("Initiating security audit scan")
        break
      case 'Start Backup':
        toast.success("System backup initiated")
        break
      case 'Configure':
        toast.info("Opening system configuration")
        break
      case 'Generate':
        toast.success("Generating comprehensive system reports")
        break
      case 'Resolve Now':
        toast.warning("Opening critical issues dashboard")
        break
      case 'View All Alerts':
        toast.info("Opening alerts management console")
        break
      default:
        toast.info(`Executing ${actionType} action`)
    }
  }

  const QuickActionCard = ({ icon: Icon, title, description, action, variant = "default" }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction(action)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${variant === 'critical' ? 'bg-destructive/10' : variant === 'warning' ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-primary/10'}`}>
            <Icon className={`w-6 h-6 ${variant === 'critical' ? 'text-destructive' : variant === 'warning' ? 'text-orange-600 dark:text-orange-400' : 'text-primary'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            <Button size="sm" variant={variant === 'critical' ? 'destructive' : 'outline'}>
              {action}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const SystemMetric = ({ icon: Icon, label, value, trend, trendValue, status = 'good' }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${status === 'critical' ? 'bg-destructive/10' : status === 'warning' ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
            <Icon className={`w-6 h-6 ${status === 'critical' ? 'text-destructive' : status === 'warning' ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{value}</span>
              {trend && (
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {trendValue}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data: {error}. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!systemStats) {
    return (
      <div className="flex-1 p-8">
        <Alert>
          <AlertDescription>
            No system data available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and administrative controls</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
          <Button size="sm">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SystemMetric 
          icon={Users} 
          label="Active Users" 
          value={`${systemStats.activeUsers}/${systemStats.totalUsers}`}
          trend="up"
          trendValue="+12%"
          status="good"
        />
        <SystemMetric 
          icon={Activity} 
          label="System Health" 
          value={`${systemStats.systemHealth}%`}
          trend="up"
          trendValue="+0.3%"
          status="good"
        />
        <SystemMetric 
          icon={Server} 
          label="Services Status" 
          value={`${systemStats.healthyServices}/${systemStats.totalServices}`}
          trend="down"
          trendValue="-2"
          status={systemStats.downServices > 0 ? 'critical' : systemStats.degradedServices > 0 ? 'warning' : 'good'}
        />
        <SystemMetric 
          icon={CreditCard} 
          label="Budget Usage" 
          value={`${systemStats.budgetUtilization}%`}
          trend="up"
          trendValue="+5%"
          status={systemStats.budgetUtilization > 80 ? 'warning' : 'good'}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Critical Alerts */}
          {alerts.length > 0 && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>{alerts.filter(a => a.severity === 'High').length} critical alerts require immediate attention</span>
                  <Button size="sm" variant="destructive" onClick={() => handleQuickAction('View All Alerts')}>
                    View All Alerts
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickActionCard
                icon={Users}
                title="User Management"
                description="Manage user accounts, roles, and permissions"
                action="Manage Users"
              />
              <QuickActionCard
                icon={Shield}
                title="Security Audit"
                description="Review security logs and compliance status"
                action="Run Audit"
                variant="warning"
              />
              <QuickActionCard
                icon={Database}
                title="System Backup"
                description="Initiate system-wide backup and recovery"
                action="Start Backup"
              />
              <QuickActionCard
                icon={Settings}
                title="Configuration"
                description="Update system settings and preferences"
                action="Configure"
              />
              <QuickActionCard
                icon={BarChart3}
                title="Generate Reports"
                description="Create comprehensive system reports"
                action="Generate"
              />
              <QuickActionCard
                icon={AlertTriangle}
                title="Critical Issues"
                description={`${alerts.filter(a => a.severity === 'High').length} issues need attention`}
                action="Resolve Now"
                variant="critical"
              />
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance Trend</CardTitle>
                <CardDescription>Weekly uptime and response time metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" domain={[98, 100]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="uptime" stroke="#22c55e" strokeWidth={2} name="Uptime %" />
                    <Line yAxisId="right" type="monotone" dataKey="response" stroke="#3b82f6" strokeWidth={2} name="Response Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Health Distribution</CardTitle>
                <CardDescription>Current status of all monitored services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{systemStats.healthyServices}</div>
                    <div className="text-sm text-muted-foreground">Healthy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{systemStats.degradedServices}</div>
                    <div className="text-sm text-muted-foreground">Degraded</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{systemStats.downServices}</div>
                    <div className="text-sm text-muted-foreground">Down</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Monitoring</CardTitle>
              <CardDescription>Real-time user activity and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" fill="#3b82f6" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Users</span>
                  <span className="font-bold">{systemStats.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Today</span>
                  <span className="font-bold text-green-600">{systemStats.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>New This Week</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Inactive (30d)</span>
                  <span className="font-bold text-orange-600">23</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Administrators</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>System Admins</span>
                  <span className="font-bold">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>DevOps Engineers</span>
                  <span className="font-bold">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Regular Users</span>
                  <span className="font-bold">190</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span>New user registered</span>
                  <span className="text-muted-foreground ml-auto">2m ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <span>Account locked (failed login)</span>
                  <span className="text-muted-foreground ml-auto">15m ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span>Role permissions updated</span>
                  <span className="text-muted-foreground ml-auto">1h ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current system resource usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>CPU Usage</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Memory Usage</span>
                    <span>74%</span>
                  </div>
                  <Progress value={74} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Disk Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Network I/O</span>
                    <span>32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.87%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">245ms</div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">8.2min</div>
                    <div className="text-sm text-muted-foreground">MTTD</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">24.5min</div>
                    <div className="text-sm text-muted-foreground">MTTR</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              All security systems are operational. Last security scan completed 2 hours ago.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Firewall Status</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>SSL Certificates</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Valid
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Intrusion Detection</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Monitoring
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Encryption</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>SOC 2 Type II</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Compliant
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>ISO 27001</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Certified
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>GDPR</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Compliant
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>HIPAA</span>
                  <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                    In Progress
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Security patch applied</span>
                  <span className="text-muted-foreground ml-auto">1h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span>Failed login attempts detected</span>
                  <span className="text-muted-foreground ml-auto">3h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Vulnerability scan completed</span>
                  <span className="text-muted-foreground ml-auto">6h ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Analytics</CardTitle>
                <CardDescription>Monthly spending breakdown by service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Monthly Spend</span>
                    <span className="text-2xl font-bold">${systemStats.monthlySpend.toLocaleString()}</span>
                  </div>
                  <Progress value={systemStats.budgetUtilization} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {systemStats.budgetUtilization}% of monthly budget utilized
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
                <CardDescription>Sustainability metrics and carbon footprint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Carbon Footprint</span>
                    <span className="text-2xl font-bold">{systemStats.carbonFootprint} tCO2e</span>
                  </div>
                  <Progress value={systemStats.sustainabilityScore} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Sustainability score: {systemStats.sustainabilityScore}/100
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}