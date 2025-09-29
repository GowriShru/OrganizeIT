import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Server, 
  DollarSign, 
  Leaf, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Brain
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function Dashboard() {
  const [dashboardMetrics, setDashboardMetrics] = useState(null)
  const [performanceData, setPerformanceData] = useState([])
  const [costData, setCostData] = useState([])
  const [carbonData, setCarbonData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    // Refresh data every 2 minutes
    const interval = setInterval(fetchDashboardData, 120000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-efc8e70a`
      const headers = {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }

      // Try to fetch from backend first
      try {
        // Fetch dashboard metrics
        const metricsResponse = await fetch(`${baseUrl}/metrics/dashboard`, { headers })
        if (metricsResponse.ok) {
          const metrics = await metricsResponse.json()
          setDashboardMetrics(metrics)
        } else {
          throw new Error('Backend not available')
        }

        // Fetch performance data
        const performanceResponse = await fetch(`${baseUrl}/metrics/performance?hours=7`, { headers })
        if (performanceResponse.ok) {
          const performance = await performanceResponse.json()
          // Convert to daily averages for the week view
          const dailyData = []
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          
          for (let i = 0; i < 7; i++) {
            const dayData = performance.data.filter((_, index) => Math.floor(index / 24) === i)
            if (dayData.length > 0) {
              const avgCpu = dayData.reduce((sum, d) => sum + d.cpu, 0) / dayData.length
              const avgMemory = dayData.reduce((sum, d) => sum + d.memory, 0) / dayData.length
              const avgNetwork = dayData.reduce((sum, d) => sum + d.network, 0) / dayData.length
              
              dailyData.push({
                name: days[i],
                cpu: Math.round(avgCpu),
                memory: Math.round(avgMemory),
                network: Math.round(avgNetwork)
              })
            }
          }
          setPerformanceData(dailyData)
        }

        // Fetch cost data
        const costResponse = await fetch(`${baseUrl}/finops/costs`, { headers })
        if (costResponse.ok) {
          const costs = await costResponse.json()
          setCostData(costs.data)
        }

        // Fetch carbon data
        const carbonResponse = await fetch(`${baseUrl}/esg/carbon`, { headers })
        if (carbonResponse.ok) {
          const carbon = await carbonResponse.json()
          setCarbonData(carbon.breakdown)
        }

        // Fetch current alerts
        const alertsResponse = await fetch(`${baseUrl}/alerts/current`, { headers })
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          setAlerts(alertsData.alerts.slice(0, 2)) // Show only first 2 alerts
        }

      } catch (backendError) {
        console.log('Backend not available, using local data:', backendError)
        // Fallback to realistic local data
        generateLocalData()
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      generateLocalData()
      setLoading(false)
    }
  }

  const generateLocalData = () => {
    // Generate realistic dashboard metrics
    setDashboardMetrics({
      system_health: 98.7 + (Math.random() - 0.5) * 0.4,
      monthly_spend: 285000 + Math.floor((Math.random() - 0.5) * 20000),
      carbon_footprint: 42.3 + (Math.random() - 0.5) * 2,
      active_projects: 24,
      uptime: 99.87,
      mttd: 8.2,
      mttr: 24.5,
      alerts_count: 3
    })

    // Generate performance data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const performanceData = days.map(day => ({
      name: day,
      cpu: 65 + Math.floor(Math.random() * 20),
      memory: 68 + Math.floor(Math.random() * 15),
      network: 45 + Math.floor(Math.random() * 10)
    }))
    setPerformanceData(performanceData)

    // Generate cost data
    const costData = [
      { month: 'Jan', aws: 125000, azure: 87000, gcp: 45000 },
      { month: 'Feb', aws: 132000, azure: 91000, gcp: 48000 },
      { month: 'Mar', aws: 128000, azure: 89000, gcp: 46000 },
      { month: 'Apr', aws: 135000, azure: 94000, gcp: 51000 },
      { month: 'May', aws: 142000, azure: 97000, gcp: 53000 },
      { month: 'Jun', aws: 138000, azure: 95000, gcp: 52000 },
    ]
    setCostData(costData)

    // Generate carbon data
    setCarbonData([
      { name: 'Computing', value: 45, color: '#8884d8' },
      { name: 'Storage', value: 25, color: '#82ca9d' },
      { name: 'Network', value: 20, color: '#ffc658' },
      { name: 'Other', value: 10, color: '#ff7300' },
    ])

    // Generate alerts
    setAlerts([
      {
        id: 'ALT-001',
        title: 'Database Connection Pool Exhaustion',
        description: 'Payment processing database showing connection pool exhaustion. Response times increased by 300%.'
      },
      {
        id: 'ALT-002',
        title: 'Memory Usage Threshold Exceeded',
        description: 'Web frontend instances consistently above 85% memory utilization.'
      }
    ])
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>IT Operations Dashboard</h1>
          <p className="text-muted-foreground">Unified view of your hybrid cloud infrastructure</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">System Health</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {dashboardMetrics?.system_health ? `${dashboardMetrics.system_health.toFixed(1)}%` : '98.7%'}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +0.3% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Monthly Cloud Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              ${dashboardMetrics?.monthly_spend ? dashboardMetrics.monthly_spend.toLocaleString() : '285,000'}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.2% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Carbon Footprint</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {dashboardMetrics?.carbon_footprint ? `${dashboardMetrics.carbon_footprint.toFixed(1)} tCO₂` : '42.3 tCO₂'}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {dashboardMetrics?.active_projects || 24}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +3 new this week
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Alert key={alert.id}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">{alert.title}:</span> {alert.description}
            </AlertDescription>
          </Alert>
        ))}
        
        {alerts.length === 0 && (
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">AI Insight:</span> All systems operating normally. 
              Predictive models show stable performance expected.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health Chart */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance (7 Days)</CardTitle>
            <CardDescription>CPU, Memory, and Network utilization trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory %" />
                <Line type="monotone" dataKey="network" stroke="#ffc658" name="Network %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cloud Spend by Provider</CardTitle>
            <CardDescription>Monthly cost breakdown across cloud providers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="aws" fill="#8884d8" name="AWS" />
                <Bar dataKey="azure" fill="#82ca9d" name="Azure" />
                <Bar dataKey="gcp" fill="#ffc658" name="GCP" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Carbon Footprint */}
        <Card>
          <CardHeader>
            <CardTitle>Carbon Footprint Distribution</CardTitle>
            <CardDescription>CO₂ emissions by service category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={carbonData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {carbonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <Zap className="w-5 h-5 mb-2 text-blue-600" />
                <p className="font-medium text-sm">Scale Resources</p>
                <p className="text-xs text-muted-foreground">Auto-scale based on demand</p>
              </div>
              
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <DollarSign className="w-5 h-5 mb-2 text-green-600" />
                <p className="font-medium text-sm">Cost Analysis</p>
                <p className="text-xs text-muted-foreground">Generate cost report</p>
              </div>
              
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <Leaf className="w-5 h-5 mb-2 text-green-600" />
                <p className="font-medium text-sm">ESG Report</p>
                <p className="text-xs text-muted-foreground">Download sustainability metrics</p>
              </div>
              
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <Brain className="w-5 h-5 mb-2 text-purple-600" />
                <p className="font-medium text-sm">AI Recommendations</p>
                <p className="text-xs text-muted-foreground">Get optimization insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}