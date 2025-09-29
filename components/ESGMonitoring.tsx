import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Leaf, 
  TrendingDown, 
  TrendingUp, 
  Target,
  Zap,
  Droplets,
  Recycle,
  Globe,
  Award,
  AlertCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const carbonEmissionData = [
  { month: 'Jan', scope1: 12.5, scope2: 28.3, scope3: 15.2, total: 56.0 },
  { month: 'Feb', scope1: 11.8, scope2: 26.1, scope3: 14.8, total: 52.7 },
  { month: 'Mar', scope1: 10.9, scope2: 24.5, scope3: 13.9, total: 49.3 },
  { month: 'Apr', scope1: 10.2, scope2: 22.8, scope3: 13.1, total: 46.1 },
  { month: 'May', scope1: 9.8, scope2: 21.4, scope3: 12.5, total: 43.7 },
  { month: 'Jun', scope1: 9.1, scope2: 19.8, scope3: 11.8, total: 40.7 },
]

const energyConsumption = [
  { source: 'Renewable Energy', percentage: 68, amount: 2450, color: '#22c55e' },
  { source: 'Natural Gas', percentage: 18, amount: 648, color: '#eab308' },
  { source: 'Grid Electricity', percentage: 14, amount: 504, color: '#ef4444' },
]

const sustainabilityMetrics = [
  { category: 'Data Centers', efficiency: 89, target: 95, unit: '% renewable' },
  { category: 'Cloud Workloads', efficiency: 76, target: 85, unit: '% optimized' },
  { category: 'Waste Reduction', efficiency: 92, target: 90, unit: '% recycled' },
  { category: 'Water Usage', efficiency: 83, target: 90, unit: '% efficiency' },
]

const complianceStatus = [
  { framework: 'ISO 14001', status: 'Compliant', lastAudit: '2024-03-15', nextAudit: '2025-03-15' },
  { framework: 'GHG Protocol', status: 'Compliant', lastAudit: '2024-06-01', nextAudit: '2024-12-01' },
  { framework: 'CDP Climate', status: 'In Progress', lastAudit: '2024-01-20', nextAudit: '2024-07-20' },
  { framework: 'TCFD', status: 'Compliant', lastAudit: '2024-02-10', nextAudit: '2025-02-10' },
]

const esgGoals = [
  {
    title: 'Carbon Neutral by 2030',
    progress: 67,
    description: 'Achieve net-zero carbon emissions across all operations',
    deadline: '2030-12-31'
  },
  {
    title: '100% Renewable Energy',
    progress: 68,
    description: 'Power all data centers with renewable energy sources',
    deadline: '2028-12-31'
  },
  {
    title: 'Zero Waste to Landfill',
    progress: 92,
    description: 'Divert all operational waste from landfills',
    deadline: '2025-12-31'
  },
  {
    title: 'Water Neutrality',
    progress: 83,
    description: 'Achieve water neutrality in water-stressed regions',
    deadline: '2027-12-31'
  }
]

export function ESGMonitoring() {
  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'text-green-600'
      case 'In Progress': return 'text-yellow-600'
      case 'Non-Compliant': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600'
    if (progress >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>ESG Monitoring</h1>
          <p className="text-muted-foreground">Environmental, Social, and Governance tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Generate Report</Button>
          <Button>Sustainability Dashboard</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Carbon Footprint</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">40.7 tCO₂</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-green-600" />
              <span className="text-green-600">-27% reduction YTD</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Renewable Energy</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">68%</div>
            <p className="text-xs text-muted-foreground">Target: 85% by 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Water Efficiency</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">83%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+12% improvement</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Waste Diverted</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">92%</div>
            <p className="text-xs text-muted-foreground">Zero waste goal: 95%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="emissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="emissions">Carbon Emissions</TabsTrigger>
          <TabsTrigger value="energy">Energy & Resources</TabsTrigger>
          <TabsTrigger value="goals">ESG Goals</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="emissions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Emissions Trend</CardTitle>
                <CardDescription>Monthly CO₂ emissions by scope (metric tons)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={carbonEmissionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Area type="monotone" dataKey="scope1" stackId="1" stroke="#ef4444" fill="#ef4444" />
                    <Area type="monotone" dataKey="scope2" stackId="1" stroke="#f97316" fill="#f97316" />
                    <Area type="monotone" dataKey="scope3" stackId="1" stroke="#eab308" fill="#eab308" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Performance</CardTitle>
                <CardDescription>Progress toward environmental targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sustainabilityMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {metric.efficiency}% / {metric.target}% {metric.unit}
                      </span>
                    </div>
                    <Progress value={(metric.efficiency / metric.target) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Source Distribution</CardTitle>
                <CardDescription>Current energy mix across all facilities (MWh)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={energyConsumption}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={(entry) => `${entry.source}: ${entry.percentage}%`}
                    >
                      {energyConsumption.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Efficiency Trends</CardTitle>
                <CardDescription>6-month efficiency improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium">Energy Efficiency</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">+15%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Power Usage Effectiveness improved through AI optimization</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Water Conservation</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">+12%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Advanced cooling systems reducing water usage</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Recycle className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Waste Reduction</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">+8%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Circular economy initiatives in hardware lifecycle</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ESG Goals Progress</CardTitle>
              <CardDescription>Track progress toward key sustainability commitments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {esgGoals.map((goal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getProgressColor(goal.progress)}`}>
                          {goal.progress}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>ESG framework compliance and audit schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{item.framework}</h4>
                        <Badge variant={item.status === 'Compliant' ? 'secondary' : 'destructive'}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last audit: {new Date(item.lastAudit).toLocaleDateString()} | 
                        Next audit: {new Date(item.nextAudit).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === 'Compliant' ? (
                        <Award className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}