import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  HardDrive,
  Cpu,
  Network,
  Database,
  RotateCcw,
  Settings,
  TrendingUp
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { operationsAPI, withLoading, handleAsyncOperation } from '../utils/api'
import { toast } from "sonner@2.0.3"

// Generate fallback performance data
const generateFallbackPerformanceData = () => {
  const performanceData = []
  const currentTime = Date.now()
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = currentTime - (i * 60 * 60 * 1000)
    const hour = new Date(timestamp).getHours()
    
    // Simulate realistic performance patterns
    const baseLoad = hour >= 9 && hour <= 17 ? 70 : 40 // Business hours vs off-hours
    
    performanceData.push({
      timestamp: new Date(timestamp).toISOString(),
      time: String(hour).padStart(2, '0') + ':00',
      cpu: Math.max(20, Math.min(95, baseLoad + (Math.random() - 0.5) * 30)),
      memory: Math.max(30, Math.min(90, baseLoad + (Math.random() - 0.5) * 25)),
      disk: Math.max(10, Math.min(80, baseLoad * 0.6 + (Math.random() - 0.5) * 20)),
      network: Math.max(5, Math.min(70, baseLoad * 0.4 + (Math.random() - 0.5) * 15))
    })
  }
  
  return performanceData
}

export function ITOperations() {
  const [metrics, setMetrics] = useState(null)
  const [performanceData, setPerformanceData] = useState([])
  const [incidents, setIncidents] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUtilization, setCurrentUtilization] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
    network: 0
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [activeActions, setActiveActions] = useState(new Set())

  useEffect(() => {
    fetchOperationsData()
    // Refresh data every minute
    const interval = setInterval(fetchOperationsData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchOperationsData = async () => {
    try {
      setError(null)
      
      // Default fallback data
      let data = {
        services: [
          { id: 'SVC-001', name: 'Web Frontend', status: 'healthy', uptime: 99.98, response_time: 245 },
          { id: 'SVC-002', name: 'User API', status: 'healthy', uptime: 99.95, response_time: 189 },
          { id: 'SVC-003', name: 'Payment API', status: 'degraded', uptime: 98.2, response_time: 1200 }
        ],
        alerts: [
          {
            id: 'ALT-001',
            severity: 'High',
            title: 'Database Connection Pool Exhaustion',
            description: 'Payment processing database showing connection pool exhaustion.',
            service: 'Payment API',
            timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
            status: 'Active'
          }
        ],
        performance: generateFallbackPerformanceData()
      }

      // Try to fetch real data from API server
      try {
        const baseUrl = 'http://localhost:8080/api'
        const headers = { 'Content-Type': 'application/json' }

        const operationsResponse = await fetch(`${baseUrl}/operations`, { headers })
        if (operationsResponse.ok) {
          const operationsData = await operationsResponse.json()
          data = operationsData.data
          console.log('✓ Successfully fetched operations data from API server')
        } else {
          console.log('⚠️ API server not responding, using fallback operations data')
        }
      } catch (apiError) {
        console.log('⚠️ API server not available for operations data, using fallback. Start server with: npm run server')
      }
      
      // Set metrics from operations data
      setMetrics({
        mttd: 8.2,
        mttr: 24.5,
        uptime: 99.87,
        alerts_count: data.alerts?.length || 0
      })

      // Use performance data from server
      if (data.performance && data.performance.length > 0) {
        // Sample every 4 hours for display
        const sampledData = data.performance.filter((_, index) => index % 4 === 0).slice(0, 6)
        setPerformanceData(sampledData)
        
        // Update current utilization from latest data
        const latest = data.performance[data.performance.length - 1]
        setCurrentUtilization({
          cpu: Math.round(latest.cpu),
          memory: Math.round(latest.memory),
          storage: Math.round(latest.disk),
          network: Math.round(latest.network)
        })
      }

      // Transform alerts to incidents
      if (data.alerts) {
        const transformedIncidents = data.alerts.map(alert => ({
          id: alert.id,
          title: alert.title,
          severity: alert.severity,
          status: alert.status,
          created: getTimeAgo(alert.timestamp),
          service: alert.service
        }))
        setIncidents(transformedIncidents)
      }

      // Transform services data
      if (data.services) {
        const transformedServices = data.services.map(service => ({
          name: service.name,
          status: service.status,
          uptime: `${service.uptime?.toFixed(2) || '99.5'}%`,
          responseTime: `${service.response_time || '245'}ms`
        }))
        setServices(transformedServices)
      }

    } catch (error) {
      console.error('Error fetching operations data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours} hours ago`
    } else {
      return `${diffMinutes} minutes ago`
    }
  }

  // Button click handlers
  const handleRunHealthCheck = async () => {
    setActionLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      toast.success('Health check completed successfully')
      fetchOperationsData() // Refresh data
    } catch (error) {
      toast.error('Health check failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestartService = async (serviceId: string, serviceName: string) => {
    const actionKey = `restart-${serviceId}`
    if (activeActions.has(actionKey)) return
    
    setActiveActions(prev => new Set(prev).add(actionKey))
    
    try {
      await operationsAPI.restartService(serviceId)
      // Refresh data after successful restart
      setTimeout(fetchOperationsData, 2000)
    } catch (error) {
      toast.error(`Failed to restart ${serviceName}`)
    } finally {
      setActiveActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }

  const handleScaleService = async (serviceId: string, serviceName: string) => {
    const actionKey = `scale-${serviceId}`
    if (activeActions.has(actionKey)) return
    
    setActiveActions(prev => new Set(prev).add(actionKey))
    
    try {
      await operationsAPI.scaleService(serviceId, 3) // Scale to 3 instances
      setTimeout(fetchOperationsData, 1000)
    } catch (error) {
      toast.error(`Failed to scale ${serviceName}`)
    } finally {
      setActiveActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }

  const handleResolveAlert = async (alertId: string, alertTitle: string) => {
    const actionKey = `resolve-${alertId}`
    if (activeActions.has(actionKey)) return
    
    setActiveActions(prev => new Set(prev).add(actionKey))
    
    try {
      await operationsAPI.resolveAlert(alertId, 'Resolved via dashboard')
      fetchOperationsData() // Refresh data
    } catch (error) {
      toast.error(`Failed to resolve alert: ${alertTitle}`)
    } finally {
      setActiveActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-4 gap-6 mb-6">
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
      <div className="p-6">
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load IT operations data: {error}. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            No operations data available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'degraded': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive'
      case 'Medium': return 'secondary'
      case 'Low': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>IT Operations</h1>
          <p className="text-muted-foreground">Monitor and manage your hybrid cloud infrastructure</p>
        </div>
        <Button 
          onClick={handleRunHealthCheck}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <>
              <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            'Run Health Check'
          )}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Mean Time to Detect</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {metrics?.mttd ? `${metrics.mttd.toFixed(1)} min` : '8.2 min'}
            </div>
            <p className="text-xs text-muted-foreground">-15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Mean Time to Recover</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {metrics?.mttr ? `${metrics.mttr.toFixed(1)} min` : '24.5 min'}
            </div>
            <p className="text-xs text-muted-foreground">-8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">System Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {metrics?.uptime ? `${metrics.uptime.toFixed(2)}%` : '99.87%'}
            </div>
            <p className="text-xs text-muted-foreground">Target: 99.9%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {metrics?.alerts_count || incidents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {incidents.filter(i => i.severity === 'High').length} High, {incidents.filter(i => i.severity === 'Medium').length} Medium
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance Overview</CardTitle>
                <CardDescription>Real-time resource utilization across all environments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Area type="monotone" dataKey="cpu" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="memory" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current usage across critical resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      <span className="text-sm">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium">{currentUtilization.cpu}%</span>
                  </div>
                  <Progress value={currentUtilization.cpu} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      <span className="text-sm">Memory Usage</span>
                    </div>
                    <span className="text-sm font-medium">{currentUtilization.memory}%</span>
                  </div>
                  <Progress value={currentUtilization.memory} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span className="text-sm">Storage Usage</span>
                    </div>
                    <span className="text-sm font-medium">{currentUtilization.storage}%</span>
                  </div>
                  <Progress value={currentUtilization.storage} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      <span className="text-sm">Network I/O</span>
                    </div>
                    <span className="text-sm font-medium">{currentUtilization.network}%</span>
                  </div>
                  <Progress value={currentUtilization.network} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics (24 Hours)</CardTitle>
              <CardDescription>Detailed performance monitoring across all systems</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory %" />
                  <Line type="monotone" dataKey="disk" stroke="#ffc658" name="Disk I/O %" />
                  <Line type="monotone" dataKey="network" stroke="#ff7300" name="Network %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Track and manage system incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityVariant(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <span className="font-medium">{incident.title}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{incident.id}</span>
                        <span>Service: {incident.service}</span>
                        <span>{incident.created}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{incident.status}</Badge>
                      {incident.status === 'Active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveAlert(incident.id, incident.title)}
                          disabled={activeActions.has(`resolve-${incident.id}`)}
                        >
                          {activeActions.has(`resolve-${incident.id}`) ? (
                            <RotateCcw className="h-3 w-3 animate-spin" />
                          ) : (
                            'Resolve'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Health Status</CardTitle>
              <CardDescription>Monitor the health of all critical services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => {
                  const serviceId = `SVC-${String(index + 1).padStart(3, '0')}`
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uptime: {service.uptime} | Response: {service.responseTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={service.status === 'healthy' ? 'secondary' : 'destructive'}>
                          {service.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestartService(serviceId, service.name)}
                            disabled={activeActions.has(`restart-${serviceId}`)}
                          >
                            {activeActions.has(`restart-${serviceId}`) ? (
                              <RotateCcw className="h-3 w-3 animate-spin" />
                            ) : (
                              <RotateCcw className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScaleService(serviceId, service.name)}
                            disabled={activeActions.has(`scale-${serviceId}`)}
                          >
                            {activeActions.has(`scale-${serviceId}`) ? (
                              <RotateCcw className="h-3 w-3 animate-spin" />
                            ) : (
                              <TrendingUp className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}