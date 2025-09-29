import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Target,
  Clock,
  DollarSign,
  Server
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { aiAPI } from '../utils/api'
import { useState } from 'react'

const aiInsights = [
  {
    id: 'AI-001',
    title: 'Predictive Scaling Opportunity',
    type: 'Performance',
    confidence: 94,
    impact: 'High',
    description: 'ML models predict 23% increase in CPU demand next Tuesday. Pre-scale EC2 instances to avoid performance degradation.',
    potentialSaving: 15000,
    timeframe: 'Next 7 days',
    actions: ['Auto-scale configuration', 'Instance pre-provisioning']
  },
  {
    id: 'AI-002',
    title: 'Cost Anomaly Detection',
    type: 'Cost',
    confidence: 87,
    impact: 'Medium',
    description: 'Unusual spending pattern in Azure Blob Storage - 340% increase compared to baseline. Investigate data ingestion pipeline.',
    potentialSaving: 8200,
    timeframe: 'Immediate',
    actions: ['Storage audit', 'Pipeline optimization']
  },
  {
    id: 'AI-003',
    title: 'Security Risk Assessment',
    type: 'Security',
    confidence: 91,
    impact: 'High',
    description: 'Increased failed authentication attempts detected. Potential brute force attack targeting user API endpoints.',
    potentialSaving: 0,
    timeframe: 'Urgent',
    actions: ['Rate limiting', 'IP blocking', 'Alert escalation']
  },
  {
    id: 'AI-004',
    title: 'Carbon Optimization',
    type: 'ESG',
    confidence: 89,
    impact: 'Medium',
    description: 'Shift 35% of batch processing workloads to low-carbon hours. Reduce emissions by 2.4 tCO₂ monthly.',
    potentialSaving: 0,
    timeframe: 'Next 30 days',
    actions: ['Workload scheduling', 'Carbon-aware computing']
  }
]

const predictionAccuracy = [
  { metric: 'Resource Demand', accuracy: 94, predictions: 1247 },
  { metric: 'Cost Forecasting', accuracy: 89, predictions: 892 },
  { metric: 'Anomaly Detection', accuracy: 96, predictions: 634 },
  { metric: 'Performance Issues', accuracy: 87, predictions: 445 },
  { metric: 'Security Threats', accuracy: 92, predictions: 278 },
]

const mlModels = [
  {
    name: 'Resource Demand Predictor',
    status: 'Active',
    accuracy: 94.2,
    lastTrained: '2024-07-20',
    version: 'v2.3.1',
    dataPoints: 2.4
  },
  {
    name: 'Anomaly Detection Engine',
    status: 'Active',
    accuracy: 96.1,
    lastTrained: '2024-07-18',
    version: 'v1.8.2',
    dataPoints: 1.8
  },
  {
    name: 'Cost Optimization Model',
    status: 'Training',
    accuracy: 89.5,
    lastTrained: '2024-07-22',
    version: 'v3.1.0',
    dataPoints: 3.2
  },
  {
    name: 'Carbon Impact Calculator',
    status: 'Active',
    accuracy: 91.3,
    lastTrained: '2024-07-19',
    version: 'v1.2.4',
    dataPoints: 0.9
  }
]

const automationMetrics = [
  { category: 'Incident Response', automated: 78, manual: 22 },
  { category: 'Resource Scaling', automated: 92, manual: 8 },
  { category: 'Cost Optimization', automated: 64, manual: 36 },
  { category: 'Security Remediation', automated: 45, manual: 55 },
  { category: 'Compliance Monitoring', automated: 89, manual: 11 },
]

export function AIInsights() {
  const [loading, setLoading] = useState(false)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Performance': return 'bg-blue-100 text-blue-800'
      case 'Cost': return 'bg-green-100 text-green-800'
      case 'Security': return 'bg-red-100 text-red-800'
      case 'ESG': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleModelTraining = async () => {
    setLoading(true)
    try {
      await aiAPI.trainModel(
        'Resource Demand Predictor',
        { dataPoints: '2.8M', features: ['cpu', 'memory', 'network'] },
        { epochs: 100, learning_rate: 0.001 }
      )
    } catch (error) {
      console.error('Failed to start model training:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    try {
      await aiAPI.generateReport('comprehensive', 'last_30_days', true)
    } catch (error) {
      console.error('Failed to generate AI report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismissInsight = async (insightId: string) => {
    try {
      await aiAPI.dismissInsight(insightId, 'Not applicable to current infrastructure')
    } catch (error) {
      console.error('Failed to dismiss insight:', error)
    }
  }

  const handleImplementInsight = async (insightId: string) => {
    try {
      await aiAPI.implementInsight(insightId, { auto_execute: true, rollback_enabled: true })
    } catch (error) {
      console.error('Failed to implement insight:', error)
    }
  }

  const handleRetrainModel = async (modelName: string) => {
    try {
      const modelId = modelName.toLowerCase().replace(/\s+/g, '-')
      await aiAPI.retrainModel(modelId, true, { use_enhanced_features: true })
    } catch (error) {
      console.error('Failed to retrain model:', error)
    }
  }

  const handleDeployModel = async (modelName: string) => {
    try {
      const modelId = modelName.toLowerCase().replace(/\s+/g, '-')
      await aiAPI.deployModel(modelId, 'production', 'gradual')
    } catch (error) {
      console.error('Failed to deploy model:', error)
    }
  }

  const getImpactVariant = (impact: string) => {
    switch (impact) {
      case 'High': return 'destructive'
      case 'Medium': return 'secondary'
      case 'Low': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600'
      case 'Training': return 'text-blue-600'
      case 'Inactive': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>AI Insights</h1>
          <p className="text-muted-foreground">Machine learning powered recommendations and predictions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleModelTraining} disabled={loading}>
            Model Training
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">12</div>
            <p className="text-xs text-muted-foreground">3 training, 9 deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Prediction Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">92.4%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+2.1% this month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Automation Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">73.6%</div>
            <p className="text-xs text-muted-foreground">of incidents auto-resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">$127K</div>
            <p className="text-xs text-muted-foreground">AI-driven optimizations YTD</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <Card key={insight.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge className={getTypeColor(insight.type)}>
                          {insight.type}
                        </Badge>
                        <Badge variant={getImpactVariant(insight.impact)}>
                          {insight.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{insight.id}</span>
                        <span>Confidence: {insight.confidence}%</span>
                        <span>Timeframe: {insight.timeframe}</span>
                        {insight.potentialSaving > 0 && (
                          <span className="text-green-600 font-medium">
                            Potential Saving: ${insight.potentialSaving.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium mb-2">Confidence</div>
                      <div className="text-2xl font-semibold">{insight.confidence}%</div>
                      <Progress value={insight.confidence} className="w-20 mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Recommended Actions:</div>
                      <div className="flex flex-wrap gap-2">
                        {insight.actions.map((action, index) => (
                          <Badge key={index} variant="outline">{action}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDismissInsight(insight.id)}>
                        Dismiss
                      </Button>
                      <Button size="sm" onClick={() => handleImplementInsight(insight.id)}>
                        Implement
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {mlModels.map((model, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{model.name}</h4>
                        <Badge variant={model.status === 'Active' ? 'secondary' : 'outline'}>
                          {model.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <div className="font-medium text-foreground">Accuracy</div>
                          <div>{model.accuracy}%</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Version</div>
                          <div>{model.version}</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Last Trained</div>
                          <div>{new Date(model.lastTrained).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Data Points</div>
                          <div>{model.dataPoints}M</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleRetrainModel(model.name)}>
                        Retrain
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeployModel(model.name)}>
                        Deploy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Coverage</CardTitle>
              <CardDescription>Percentage of automated vs manual operations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={automationMetrics} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="category" type="category" width={150} />
                  <Bar dataKey="automated" fill="#22c55e" name="Automated" />
                  <Bar dataKey="manual" fill="#ef4444" name="Manual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Accuracy rates across different prediction categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictionAccuracy.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {metric.predictions} predictions
                          </span>
                          <span className="text-sm font-semibold">{metric.accuracy}%</span>
                        </div>
                      </div>
                      <Progress value={metric.accuracy} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prediction Trends</CardTitle>
                <CardDescription>Weekly accuracy trends for key models</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={[
                    { week: 'W1', resource: 91, cost: 87, anomaly: 94, performance: 85 },
                    { week: 'W2', resource: 93, cost: 89, anomaly: 95, performance: 86 },
                    { week: 'W3', resource: 94, cost: 88, anomaly: 96, performance: 87 },
                    { week: 'W4', resource: 94, cost: 89, anomaly: 96, performance: 87 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[80, 100]} />
                    <Line type="monotone" dataKey="resource" stroke="#8884d8" name="Resource" />
                    <Line type="monotone" dataKey="cost" stroke="#82ca9d" name="Cost" />
                    <Line type="monotone" dataKey="anomaly" stroke="#ffc658" name="Anomaly" />
                    <Line type="monotone" dataKey="performance" stroke="#ff7300" name="Performance" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}