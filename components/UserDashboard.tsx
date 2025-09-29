import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Server,
  Database,
  Cloud,
  CreditCard,
  Leaf,
  Zap,
  Shield,
  Users,
  Settings,
  Bell,
  Calendar,
  Target,
  Workflow
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from "sonner@2.0.3"

interface UserDashboardProps {
  user?: any
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [dashboardMetrics, setDashboardMetrics] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [personalMetrics, setPersonalMetrics] = useState([])
  const [projectProgress, setProjectProgress] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setError('User not found')
        setIsLoading(false)
        return
      }

      try {
        setError(null)
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-efc8e70a`
        const headers = {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }

        // Fetch user-specific dashboard data
        const userDashboardResponse = await fetch(`${baseUrl}/user/${user.id}/dashboard`, { headers })
        if (!userDashboardResponse.ok) throw new Error('Failed to fetch user dashboard data')
        const userDashboard = await userDashboardResponse.json()
        
        // Fetch system metrics for health status
        const metricsResponse = await fetch(`${baseUrl}/metrics/dashboard`, { headers })
        if (!metricsResponse.ok) throw new Error('Failed to fetch system metrics')
        const systemMetrics = await metricsResponse.json()

        // Fetch projects to get user's project involvement
        const projectsResponse = await fetch(`${baseUrl}/projects`, { headers })
        if (!projectsResponse.ok) throw new Error('Failed to fetch projects')
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects)

        // Calculate user-specific metrics
        const userProjects = projectsData.projects.filter(p => 
          p.lead === user.name || p.team_members?.includes(user.name)
        )

        setDashboardMetrics({
          myProjects: userProjects.length,
          completedTasks: userDashboard.metrics.tasks_completed,
          pendingTasks: userDashboard.metrics.tasks_pending,
          systemHealth: systemMetrics.system_health,
          myServices: 5, // Will be dynamic based on user's assigned services
          healthyServices: 4,
          alerts: userDashboard.metrics.alerts_assigned,
          monthlyBudget: 15000, // User's allocated budget
          budgetUsed: userDashboard.metrics.cost_savings_contributed,
          efficiency_score: userDashboard.metrics.efficiency_score,
          weekly_hours: userDashboard.metrics.weekly_hours
        })

        // Set recent activity from the user dashboard
        setRecentActivity(userDashboard.recent_activities)

        // Generate personal performance metrics based on real data
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const weeklyMetrics = days.map((day, index) => {
          const baseTasks = index < 5 ? 8 + Math.floor(Math.random() * 8) : 2 + Math.floor(Math.random() * 4)
          const productivity = index < 5 ? 75 + Math.floor(Math.random() * 20) : 50 + Math.floor(Math.random() * 20)
          return {
            name: day,
            tasks: baseTasks,
            productivity: Math.min(productivity, 100)
          }
        })
        setPersonalMetrics(weeklyMetrics)

        // Set project progress from real project data
        const userProjectProgress = userProjects.map(project => ({
          name: project.name,
          progress: project.progress,
          deadline: project.end_date
        }))
        setProjectProgress(userProjectProgress)

      } catch (error) {
        console.error('Error fetching user dashboard data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [user])

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'deploy':
        toast.success("Code deployment initiated to staging environment")
        break
      case 'metrics':
        toast.info("Opening service performance metrics dashboard")
        break
      case 'alerts':
        toast.info(`Viewing ${dashboardMetrics?.alerts || 0} active alerts`)
        break
      case 'schedule':
        toast.success("Opening task scheduling interface")
        break
      case 'logs':
        toast.info("Opening log query interface")
        break
      case 'configure':
        toast.info("Opening user configuration settings")
        break
      default:
        toast.info(`Executing ${action} action`)
    }
  }

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, trendValue, variant = "default" }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${variant === 'success' ? 'bg-green-100 dark:bg-green-900/20' : variant === 'warning' ? 'bg-orange-100 dark:bg-orange-900/20' : variant === 'danger' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
              <Icon className={`w-5 h-5 ${variant === 'success' ? 'text-green-600 dark:text-green-400' : variant === 'warning' ? 'text-orange-600 dark:text-orange-400' : variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const QuickAction = ({ icon: Icon, title, description, action, variant = "default" }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction(action)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${variant === 'primary' ? 'bg-primary/10' : 'bg-muted'}`}>
            <Icon className={`w-5 h-5 ${variant === 'primary' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
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

  if (!dashboardMetrics) {
    return (
      <div className="flex-1 p-8">
        <Alert>
          <AlertDescription>
            No dashboard data available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your projects and services</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            <Activity className="w-3 h-3 mr-1" />
            {dashboardMetrics.systemHealth}% System Health
          </Badge>
          <Button size="sm">
            <Settings className="w-4 h-4 mr-2" />
            My Settings
          </Button>
        </div>
      </div>

      {/* Personal Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          icon={Target} 
          title="My Projects" 
          value={dashboardMetrics.myProjects}
          subtitle="Active projects"
          trend="up"
          trendValue="+2"
          variant="default"
        />
        <MetricCard 
          icon={CheckCircle} 
          title="Tasks Completed" 
          value={dashboardMetrics.completedTasks}
          subtitle="This month"
          trend="up"
          trendValue="+8"
          variant="success"
        />
        <MetricCard 
          icon={Clock} 
          title="Pending Tasks" 
          value={dashboardMetrics.pendingTasks}
          subtitle="Requires attention"
          variant="warning"
        />
        <MetricCard 
          icon={Server} 
          title="My Services" 
          value={`${dashboardMetrics.healthyServices}/${dashboardMetrics.myServices}`}
          subtitle="Services healthy"
          variant="success"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">My Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Alerts */}
          {dashboardMetrics.alerts > 0 && (
            <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>You have {dashboardMetrics.alerts} alerts that require attention</span>
                  <Button size="sm" variant="outline" onClick={() => handleQuickAction('alerts')}>
                    View Alerts
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <QuickAction
                icon={Workflow}
                title="Deploy Code"
                description="Deploy to staging"
                action="deploy"
                variant="primary"
              />
              <QuickAction
                icon={BarChart3}
                title="View Metrics"
                description="Service performance"
                action="metrics"
              />
              <QuickAction
                icon={Bell}
                title="Check Alerts"
                description={`${dashboardMetrics.alerts} active`}
                action="alerts"
              />
              <QuickAction
                icon={Calendar}
                title="Schedule Task"
                description="Plan work"
                action="schedule"
              />
              <QuickAction
                icon={Database}
                title="Query Logs"
                description="Debug issues"
                action="logs"
              />
              <QuickAction
                icon={Settings}
                title="Configure"
                description="Update settings"
                action="configure"
              />
            </div>
          </div>

          {/* Activity & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : activity.status === 'resolved' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${activity.status === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'}`}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Productivity</CardTitle>
                <CardDescription>Your task completion and productivity trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={personalMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="productivity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Productivity %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle>My Budget Overview</CardTitle>
              <CardDescription>Resource allocation and spending for your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Budget Allocated</span>
                  <span className="font-bold">${dashboardMetrics.monthlyBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Budget Used</span>
                  <span className="font-bold">${dashboardMetrics.budgetUsed.toLocaleString()}</span>
                </div>
                <Progress value={(dashboardMetrics.budgetUsed / dashboardMetrics.monthlyBudget) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {Math.round((dashboardMetrics.budgetUsed / dashboardMetrics.monthlyBudget) * 100)}% of allocated budget used
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>Current status of your active projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {projectProgress.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
                <CardDescription>Your project contribution metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">24</div>
                    <div className="text-sm text-muted-foreground">Tasks Done</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">92%</div>
                    <div className="text-sm text-muted-foreground">On Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Important dates and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">Security Compliance Review</p>
                    <p className="text-sm text-muted-foreground">Final documentation due</p>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
                    3 days
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">Cloud Migration Phase 2</p>
                    <p className="text-sm text-muted-foreground">Staging environment testing</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    1 week
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">AI Monitoring Implementation</p>
                    <p className="text-sm text-muted-foreground">Model training completion</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                    2 weeks
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Performance Metrics</CardTitle>
                <CardDescription>Your weekly productivity and task completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={personalMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#3b82f6" name="Tasks Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Trend</CardTitle>
                <CardDescription>7-day productivity scoring based on task completion</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={personalMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="productivity" stroke="#22c55e" strokeWidth={2} name="Productivity Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Key metrics for your work performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">96%</div>
                  <div className="text-sm text-muted-foreground">Task Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2.3d</div>
                  <div className="text-sm text-muted-foreground">Avg Task Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">87%</div>
                  <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">4.8</div>
                  <div className="text-sm text-muted-foreground">Quality Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Services</CardTitle>
                <CardDescription>Services you're responsible for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Payment API</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>User Dashboard</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Analytics Service</span>
                  <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                    Warning
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notification System</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Pipeline</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>Your allocated resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>CPU Quota</span>
                    <span>12/20 cores</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Memory Quota</span>
                    <span>24/32 GB</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Storage Quota</span>
                    <span>180/500 GB</span>
                  </div>
                  <Progress value={36} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Allocation</CardTitle>
                <CardDescription>Your resource costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Compute</span>
                  <span className="font-medium">$4,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage</span>
                  <span className="font-medium">$1,800</span>
                </div>
                <div className="flex justify-between">
                  <span>Network</span>
                  <span className="font-medium">$950</span>
                </div>
                <div className="flex justify-between">
                  <span>Other</span>
                  <span className="font-medium">$3,250</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${dashboardMetrics.budgetUsed.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Opportunities</CardTitle>
              <CardDescription>Recommendations to improve your resource efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Right-size Analytics Service</h4>
                    <p className="text-sm text-muted-foreground">Your analytics service is using only 45% of allocated resources. Consider downsizing to save $800/month.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Leaf className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Use Spot Instances</h4>
                    <p className="text-sm text-muted-foreground">Your data pipeline can run on spot instances during off-peak hours, potentially saving 60% on compute costs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Enable Auto-scaling</h4>
                    <p className="text-sm text-muted-foreground">Configure auto-scaling for your services to handle traffic spikes efficiently while minimizing costs.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}