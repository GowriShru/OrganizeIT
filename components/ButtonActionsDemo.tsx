import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings, 
  Download, 
  Upload,
  Trash2,
  Edit3,
  Save,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Target,
  TrendingUp,
  Database,
  Server,
  Activity,
  Plus
} from 'lucide-react'
import { toast } from "sonner@2.0.3"
import { 
  operationsAPI, 
  finopsAPI, 
  esgAPI, 
  projectsAPI, 
  aiAPI, 
  resourcesAPI, 
  identityAPI, 
  notificationsAPI,
  searchAPI,
  exportAPI,
  bulkAPI,
  withLoading 
} from '../utils/api'

export function ButtonActionsDemo() {
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState(0)
  const [demoData, setDemoData] = useState({
    services: [
      { id: 'SVC-001', name: 'Web Frontend', status: 'healthy', uptime: 99.98 },
      { id: 'SVC-002', name: 'User API', status: 'degraded', uptime: 98.2 },
      { id: 'SVC-003', name: 'Payment API', status: 'healthy', uptime: 99.95 }
    ],
    costs: { monthly: 285000, growth: 8.3, potential_savings: 67500 },
    projects: [
      { id: 'PROJ-001', name: 'Cloud Migration', status: 'In Progress', progress: 67 },
      { id: 'PROJ-002', name: 'Security Upgrade', status: 'Planning', progress: 23 }
    ]
  })

  const setActionLoading = (key: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }))
  }

  // IT Operations Demo Actions
  const handleRestartService = async (serviceId: string, serviceName: string) => {
    const actionKey = `restart-${serviceId}`
    setActionLoading(actionKey, true)
    
    try {
      const result = await operationsAPI.restartService(serviceId)
      
      // Update demo data
      setDemoData(prev => ({
        ...prev,
        services: prev.services.map(service => 
          service.id === serviceId 
            ? { ...service, status: 'healthy', uptime: Math.min(99.99, service.uptime + 0.1) }
            : service
        )
      }))
      
      toast.success(`${serviceName} restarted successfully`)
    } catch (error) {
      toast.error(`Failed to restart ${serviceName}`)
    } finally {
      setActionLoading(actionKey, false)
    }
  }

  const handleScaleService = async (serviceId: string, instances: number) => {
    const actionKey = `scale-${serviceId}`
    setActionLoading(actionKey, true)
    
    try {
      await operationsAPI.scaleService(serviceId, instances)
      toast.success(`Service scaled to ${instances} instances`)
    } catch (error) {
      toast.error('Failed to scale service')
    } finally {
      setActionLoading(actionKey, false)
    }
  }

  const handleRunHealthCheck = async () => {
    setActionLoading('health-check', true)
    
    try {
      // Simulate health check progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      toast.success('Health check completed - All systems operational')
      setProgress(0)
    } catch (error) {
      toast.error('Health check failed')
    } finally {
      setActionLoading('health-check', false)
    }
  }

  // FinOps Demo Actions
  const handleApplyOptimization = async (optimizationId: string) => {
    const actionKey = `optimize-${optimizationId}`
    setActionLoading(actionKey, true)
    
    try {
      const result = await finopsAPI.applyOptimization(optimizationId)
      
      // Update demo cost data
      setDemoData(prev => ({
        ...prev,
        costs: {
          ...prev.costs,
          monthly: prev.costs.monthly - 15000,
          potential_savings: prev.costs.potential_savings - 25000
        }
      }))
      
      toast.success(`Optimization applied - Estimated savings: $25,000/month`)
    } catch (error) {
      toast.error('Failed to apply optimization')
    } finally {
      setActionLoading(actionKey, false)
    }
  }

  const handleExportFinancialReport = async () => {
    setActionLoading('export-financial', true)
    
    try {
      await exportAPI.exportData('finops', 'pdf', {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      })
    } catch (error) {
      toast.error('Failed to export financial report')
    } finally {
      setActionLoading('export-financial', false)
    }
  }

  // Project Management Demo Actions
  const handleUpdateProjectStatus = async (projectId: string, newStatus: string) => {
    const actionKey = `project-${projectId}`
    setActionLoading(actionKey, true)
    
    try {
      await projectsAPI.updateProjectStatus(projectId, newStatus, 'Status updated via demo')
      
      // Update demo project data
      setDemoData(prev => ({
        ...prev,
        projects: prev.projects.map(project => 
          project.id === projectId 
            ? { ...project, status: newStatus }
            : project
        )
      }))
      
      toast.success(`Project status updated to: ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update project status')
    } finally {
      setActionLoading(actionKey, false)
    }
  }

  const handleCreateProject = async () => {
    setActionLoading('create-project', true)
    
    try {
      const projectData = {
        name: 'AI Implementation Initiative',
        description: 'Deploy AI-driven analytics across the platform',
        priority: 'High',
        budget: 150000,
        team_size: 6,
        end_date: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      const result = await projectsAPI.createProject(projectData)
      
      // Add to demo data
      setDemoData(prev => ({
        ...prev,
        projects: [...prev.projects, {
          id: result.project_id || 'PROJ-003',
          name: projectData.name,
          status: 'Planning',
          progress: 0
        }]
      }))
      
      toast.success('New project created successfully')
    } catch (error) {
      toast.error('Failed to create project')
    } finally {
      setActionLoading('create-project', false)
    }
  }

  // AI & Analytics Demo Actions
  const handleRunAIAnalysis = async (dataType: string) => {
    const actionKey = `ai-${dataType}`
    setActionLoading(actionKey, true)
    
    try {
      const result = await aiAPI.runAnalysis(dataType, { 
        scope: 'full-system',
        time_range: '7d'
      })
      
      toast.success(`AI analysis completed - ${result.insights?.length || 3} insights generated`)
    } catch (error) {
      toast.error('AI analysis failed')
    } finally {
      setActionLoading(actionKey, false)
    }
  }

  const handleRunOptimization = async () => {
    setActionLoading('ai-optimize', true)
    
    try {
      const result = await aiAPI.runOptimization('cost', 'monthly_spend')
      toast.success(`AI optimization completed - ${result.improvement_percentage}% improvement projected`)
    } catch (error) {
      toast.error('AI optimization failed')
    } finally {
      setActionLoading('ai-optimize', false)
    }
  }

  // Resource Management Demo Actions
  const handleConfigureAutoScaling = async () => {
    setActionLoading('auto-scale', true)
    
    try {
      await resourcesAPI.configureAutoScaling('compute', {
        min: 2,
        max: 10,
        target_cpu: 70,
        scale_up_cooldown: 300,
        scale_down_cooldown: 600
      })
      
      toast.success('Auto-scaling configuration updated')
    } catch (error) {
      toast.error('Failed to configure auto-scaling')
    } finally {
      setActionLoading('auto-scale', false)
    }
  }

  const handleResourceCleanup = async () => {
    setActionLoading('cleanup', true)
    
    try {
      const result = await resourcesAPI.startCleanup([
        'unused-volumes',
        'orphaned-snapshots',
        'idle-instances',
        'unattached-load-balancers'
      ])
      
      toast.success(`Resource cleanup initiated - Est. savings: $${result.estimated_savings?.toLocaleString()}`)
    } catch (error) {
      toast.error('Failed to start resource cleanup')
    } finally {
      setActionLoading('cleanup', false)
    }
  }

  // Bulk Operations Demo
  const handleBulkAction = async (action: string, items: string[]) => {
    const actionKey = `bulk-${action}`
    setActionLoading(actionKey, true)
    
    try {
      await bulkAPI.executeBulkAction(action, items, { 
        force: false,
        notify: true
      })
      
      toast.success(`Bulk ${action} completed on ${items.length} items`)
    } catch (error) {
      toast.error(`Bulk ${action} failed`)
    } finally {
      setActionLoading(actionKey, false)
    }
  }

  // Search Demo
  const handleGlobalSearch = async (query: string) => {
    setActionLoading('search', true)
    
    try {
      const results = await searchAPI.search(query, {
        modules: ['operations', 'finops', 'projects'],
        limit: 10
      })
      
      toast.success(`Found ${results.total_count} results in ${results.search_time_ms}ms`)
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setActionLoading('search', false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Interactive Button Actions Demo</h1>
          <p className="text-muted-foreground">
            Comprehensive demonstration of working button interactions with real API calls
          </p>
        </div>
        <Button 
          onClick={() => handleGlobalSearch('system performance')}
          disabled={loading.search}
          variant="outline"
        >
          {loading.search ? (
            <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Info className="mr-2 h-4 w-4" />
          )}
          Test Global Search
        </Button>
      </div>

      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="operations">IT Operations</TabsTrigger>
          <TabsTrigger value="finops">FinOps</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="ai">AI & Analytics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* IT Operations Demo */}
        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Service Management
                </CardTitle>
                <CardDescription>Restart, scale, and manage services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoData.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uptime: {service.uptime}%
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestartService(service.id, service.name)}
                        disabled={loading[`restart-${service.id}`]}
                      >
                        {loading[`restart-${service.id}`] ? (
                          <RotateCcw className="h-3 w-3 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScaleService(service.id, 3)}
                        disabled={loading[`scale-${service.id}`]}
                      >
                        {loading[`scale-${service.id}`] ? (
                          <RotateCcw className="h-3 w-3 animate-spin" />
                        ) : (
                          <TrendingUp className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>Run comprehensive health checks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={handleRunHealthCheck}
                  disabled={loading['health-check']}
                >
                  {loading['health-check'] ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Running Health Check...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Run Full Health Check
                    </>
                  )}
                </Button>
                
                {loading['health-check'] && progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <div className="space-y-2 pt-4">
                  <h4 className="font-medium">Bulk Operations</h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('restart', ['SVC-001', 'SVC-002'])}
                      disabled={loading['bulk-restart']}
                    >
                      {loading['bulk-restart'] ? (
                        <RotateCcw className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Play className="mr-1 h-3 w-3" />
                      )}
                      Bulk Restart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('update', ['SVC-001', 'SVC-002', 'SVC-003'])}
                      disabled={loading['bulk-update']}
                    >
                      {loading['bulk-update'] ? (
                        <RotateCcw className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Upload className="mr-1 h-3 w-3" />
                      )}
                      Bulk Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FinOps Demo */}
        <TabsContent value="finops" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization</CardTitle>
                <CardDescription>Apply AI-identified cost optimizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Right-size EC2 Instances</h4>
                    <Badge variant="default">High Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    23 instances are oversized based on usage patterns
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-600">
                      $25,000/month savings
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleApplyOptimization('OPT-001')}
                      disabled={loading['optimize-OPT-001']}
                    >
                      {loading['optimize-OPT-001'] ? (
                        <>
                          <RotateCcw className="mr-1 h-3 w-3 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Current monthly spend: <strong>${demoData.costs.monthly.toLocaleString()}</strong>
                    <br />
                    Potential savings: <strong>${demoData.costs.potential_savings.toLocaleString()}</strong>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Export financial reports and analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  onClick={handleExportFinancialReport}
                  disabled={loading['export-financial']}
                >
                  {loading['export-financial'] ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export Financial Report
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3 w-3" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-3 w-3" />
                    Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Demo */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Update project status and create new projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoData.projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateProjectStatus(
                          project.id, 
                          project.status === 'Planning' ? 'In Progress' : 'Completed'
                        )}
                        disabled={loading[`project-${project.id}`]}
                      >
                        {loading[`project-${project.id}`] ? (
                          <RotateCcw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Edit3 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                  </div>
                ))}

                <Button
                  className="w-full"
                  onClick={handleCreateProject}
                  disabled={loading['create-project']}
                >
                  {loading['create-project'] ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Project
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI & Analytics Demo */}
        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>Run AI-powered analysis on different data types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {['performance', 'cost', 'security'].map((dataType) => (
                    <Button
                      key={dataType}
                      size="sm"
                      variant="outline"
                      onClick={() => handleRunAIAnalysis(dataType)}
                      disabled={loading[`ai-${dataType}`]}
                    >
                      {loading[`ai-${dataType}`] ? (
                        <RotateCcw className="h-3 w-3 animate-spin" />
                      ) : (
                        dataType.charAt(0).toUpperCase() + dataType.slice(1)
                      )}
                    </Button>
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={handleRunOptimization}
                  disabled={loading['ai-optimize']}
                >
                  {loading['ai-optimize'] ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Run AI Optimization
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Demo */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Management</CardTitle>
                <CardDescription>Configure auto-scaling and resource optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  onClick={handleConfigureAutoScaling}
                  disabled={loading['auto-scale']}
                >
                  {loading['auto-scale'] ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Configuring...
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Auto-Scaling
                    </>
                  )}
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleResourceCleanup}
                  disabled={loading['cleanup']}
                >
                  {loading['cleanup'] ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Start Resource Cleanup
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

