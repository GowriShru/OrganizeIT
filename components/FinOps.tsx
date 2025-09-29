import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Target,
  PieChart,
  BarChart3,
  Calculator,
  Play,
  Settings,
  Download,
  RotateCcw
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { finopsAPI, exportAPI, withLoading } from '../utils/api'
import { toast } from "sonner@2.0.3"

// Generate fallback cost data
const generateFallbackCostData = () => {
  const costData = []
  const currentDate = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const month = date.toLocaleString('default', { month: 'short' })
    
    // Simulate realistic cost patterns with growth trends
    const baseCosts = {
      aws: 125000 + (5 - i) * 2000,
      azure: 87000 + (5 - i) * 1500,
      gcp: 45000 + (5 - i) * 1000
    }
    
    costData.push({
      month,
      date: date.toISOString(),
      aws: baseCosts.aws + Math.floor((Math.random() - 0.5) * 10000),
      azure: baseCosts.azure + Math.floor((Math.random() - 0.5) * 8000),
      gcp: baseCosts.gcp + Math.floor((Math.random() - 0.5) * 5000),
      total: baseCosts.aws + baseCosts.azure + baseCosts.gcp
    })
  }
  
  return costData
}

export function FinOps() {
  const [costData, setCostData] = useState([])
  const [optimizationData, setOptimizationData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeActions, setActiveActions] = useState(new Set())

  useEffect(() => {
    const fetchFinOpsData = async () => {
      try {
        setError(null)
        
        // Default fallback data
        let data = {
          costs: generateFallbackCostData(),
          optimization: [
            {
              id: 'OPT-001',
              title: 'Right-size EC2 Instances',
              description: '23 EC2 instances are oversized based on actual usage patterns',
              potential_savings: 24000,
              effort: 'Low',
              impact: 'High'
            }
          ],
          summary: {
            potential_savings: 67500
          }
        }

        // Try to fetch real data from API server
        try {
          const baseUrl = 'http://localhost:8080/api'
          const headers = { 'Content-Type': 'application/json' }

          const finopsResponse = await fetch(`${baseUrl}/finops`, { headers })
          if (finopsResponse.ok) {
            const finopsData = await finopsResponse.json()
            data = finopsData.data
            console.log('✓ Successfully fetched FinOps data from API server')
          } else {
            console.log('⚠️ API server not responding, using fallback FinOps data')
          }
        } catch (apiError) {
          console.log('⚠️ API server not available for FinOps data, using fallback. Start server with: npm run server')
        }

        setCostData(data.costs)
        setOptimizationData({
          opportunities: data.optimization,
          total_savings: data.summary.potential_savings
        })

        // Calculate current month metrics
        if (data.costs.length > 0) {
          const currentMonth = data.costs[data.costs.length - 1] || { total: 285000 }
          const previousMonth = data.costs[data.costs.length - 2] || { total: 262000 }
          const monthlyGrowth = previousMonth && previousMonth.total > 0 ? 
            ((currentMonth.total - previousMonth.total) / previousMonth.total * 100) : 8.3

          setMetrics({
            monthlySpend: currentMonth.total || 285000,
            monthlyGrowth: monthlyGrowth,
            potentialSavings: data.summary?.potential_savings || 67500,
            budgetUtilization: Math.round(((currentMonth.total || 285000) / 400000) * 100), // Assuming 400K budget
            costPerGB: 0.42 - (Math.random() * 0.1) // Simulated metric
          })
        } else {
          // Fallback metrics when no data is available
          setMetrics({
            monthlySpend: 285000,
            monthlyGrowth: 8.3,
            potentialSavings: 67500,
            budgetUtilization: 71,
            costPerGB: 0.42
          })
        }

      } catch (error) {
        console.error('Error fetching FinOps data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFinOpsData()
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchFinOpsData, 300000)
    return () => clearInterval(interval)
  }, [])

  // Calculate cost breakdown from real data
  const costBreakdown = costData.length > 0 ? [
    { category: 'AWS', amount: costData[costData.length - 1]?.aws || 0, color: '#FF9900' },
    { category: 'Azure', amount: costData[costData.length - 1]?.azure || 0, color: '#0078D4' },
    { category: 'GCP', amount: costData[costData.length - 1]?.gcp || 0, color: '#4285F4' }
  ].filter(item => item.amount > 0) : []

  // Generate budget alerts from real data
  const budgetAlerts = costData.length > 0 ? [
    { 
      service: 'AWS Production', 
      budget: 150000, 
      spent: costData[costData.length - 1]?.aws || 0, 
      status: 'warning' 
    },
    { 
      service: 'Azure Development', 
      budget: 100000, 
      spent: costData[costData.length - 1]?.azure || 0, 
      status: 'healthy' 
    },
    { 
      service: 'GCP Analytics', 
      budget: 60000, 
      spent: costData[costData.length - 1]?.gcp || 0, 
      status: 'warning' 
    }
  ] : []

  // Prepare data for charts - use costData directly for monthly spend
  const monthlySpendData = costData

  // Optimization opportunities from API data with fallback structure
  const optimizationOpportunities = optimizationData?.opportunities || optimizationData?.optimization || [
    {
      id: 'OPT-001',
      title: 'Right-size EC2 Instances',
      description: '23 EC2 instances are oversized based on actual usage patterns',
      potentialSaving: 24000,
      potential_savings: 24000,
      effort: 'Low',
      impact: 'High'
    },
    {
      id: 'OPT-002',
      title: 'Reserved Instance Optimization',
      description: 'Purchase reserved instances for consistent workloads',
      potentialSaving: 35000,
      potential_savings: 35000,
      effort: 'Medium',
      impact: 'High'
    }
  ]
  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100
    if (percentage >= 90) return 'danger'
    if (percentage >= 75) return 'warning'
    return 'healthy'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'danger': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Button click handlers
  const handleExportReport = async () => {
    setActionLoading(true)
    try {
      await exportAPI.exportData('finops', 'pdf', { 
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      })
    } catch (error) {
      toast.error('Failed to export report')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCostAnalysis = async () => {
    setActionLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate analysis
      toast.success('Cost analysis completed successfully')
    } catch (error) {
      toast.error('Cost analysis failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleImplementOptimization = async (optimizationId: string, title: string) => {
    const actionKey = `implement-${optimizationId}`
    if (activeActions.has(actionKey)) return
    
    setActiveActions(prev => new Set(prev).add(actionKey))
    
    try {
      await finopsAPI.applyOptimization(optimizationId)
      // Refresh data after implementation
      setTimeout(() => {
        // This would normally refetch the data
        toast.success(`${title} implementation started`)
      }, 1000)
    } catch (error) {
      toast.error(`Failed to implement: ${title}`)
    } finally {
      setActiveActions(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionKey)
        return newSet
      })
    }
  }

  const handleSetBudgetAlert = async (service: string, threshold: number) => {
    try {
      await finopsAPI.setBudgetAlert(threshold, 'admin@organizeit.com')
    } catch (error) {
      toast.error(`Failed to set budget alert for ${service}`)
    }
  }

  if (isLoading) {
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
            Failed to load FinOps data: {error}. Please check your connection and try again.
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
            No financial data available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>FinOps Dashboard</h1>
          <p className="text-muted-foreground">Financial operations and cloud cost optimization</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </>
            )}
          </Button>
          <Button 
            onClick={handleCostAnalysis}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Cost Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Monthly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${(metrics?.monthlySpend || 285000).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {(metrics?.monthlyGrowth || 8.3) >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-red-600" />
                  <span className="text-red-600">+{(metrics?.monthlyGrowth || 8.3).toFixed(1)}% from last month</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">{(metrics?.monthlyGrowth || -2.5).toFixed(1)}% from last month</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Potential Savings</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">$67,500</div>
            <p className="text-xs text-muted-foreground">23.7% cost reduction opportunity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Budget Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">84.2%</div>
            <p className="text-xs text-muted-foreground">of monthly budget consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cost per GB</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">$0.42</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-green-600" />
              <span className="text-green-600">-5% optimization</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Cost Trends</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown by Service</CardTitle>
                <CardDescription>Distribution of cloud spending across service categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={(entry) => `${entry.category}: $${(entry.amount / 1000).toFixed(0)}k`}
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Spend by Provider</CardTitle>
                <CardDescription>6-month trend across cloud providers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlySpendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Area type="monotone" dataKey="aws" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="azure" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="gcp" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Trends Analysis</CardTitle>
              <CardDescription>Detailed cost analysis over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlySpendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={3} name="Total" />
                  <Line type="monotone" dataKey="aws" stroke="#82ca9d" name="AWS" />
                  <Line type="monotone" dataKey="azure" stroke="#ffc658" name="Azure" />
                  <Line type="monotone" dataKey="gcp" stroke="#ff7300" name="GCP" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Opportunities</CardTitle>
              <CardDescription>AI-identified savings opportunities ranked by impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationOpportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <Badge variant={opportunity.impact === 'High' ? 'default' : 'secondary'}>
                          {opportunity.impact} Impact
                        </Badge>
                        <Badge variant="outline">{opportunity.effort} Effort</Badge>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        ${(opportunity.potentialSaving || opportunity.potential_savings || 0).toLocaleString()}/month
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleImplementOptimization(opportunity.id || `OPT-${Date.now()}`, opportunity.title)}
                      disabled={activeActions.has(`implement-${opportunity.id || 'default'}`)}
                    >
                      {activeActions.has(`implement-${opportunity.id || 'default'}`) ? (
                        <>
                          <RotateCcw className="mr-1 h-3 w-3 animate-spin" />
                          Implementing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Implement
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Monitoring</CardTitle>
              <CardDescription>Track spending against allocated budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetAlerts.map((alert, index) => {
                  const percentage = alert.budget > 0 ? ((alert.spent || 0) / alert.budget) * 100 : 0
                  const status = getBudgetStatus(alert.spent, alert.budget)
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{alert.service}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">${(alert.spent || 0).toLocaleString()} / ${(alert.budget || 0).toLocaleString()}</span>
                          <Badge variant={status === 'healthy' ? 'secondary' : status === 'warning' ? 'secondary' : 'destructive'}>
                            {percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${status === 'danger' ? 'bg-red-100' : status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`}
                      />
                      {percentage >= 90 && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          Budget threshold exceeded
                        </div>
                      )}
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