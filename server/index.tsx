import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.figma.com'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
}))

app.use('*', logger(console.log))

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Authentication endpoints
app.post('/make-server-efc8e70a/auth/signup', async (c) => {
  try {
    const { email, password, name, role, department } = await c.req.json()
    
    console.log(`Creating user account for: ${email}`)
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        role: role || 'User',
        department: department || 'IT',
        created_at: new Date().toISOString()
      },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    })

    if (error) {
      console.log(`User creation error: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }

    // Store user profile in KV store
    await kv.set(`user_profile:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      department,
      created_at: new Date().toISOString(),
      last_login: null,
      preferences: {
        theme: 'light',
        notifications: true,
        dashboard_layout: 'default'
      }
    })

    console.log(`User created successfully: ${data.user.id}`)
    return c.json({ 
      user: data.user,
      message: 'User created successfully'
    })
  } catch (error) {
    console.log(`Signup error: ${error}`)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

app.post('/make-server-efc8e70a/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    console.log(`Sign in attempt for: ${email}`)
    
    // For demo purposes, accept demo credentials
    if (email === 'demo@organizeit.com' && password === 'demo123') {
      // Create/get demo user profile
      const demoProfile = {
        id: 'demo-user-id',
        email: 'demo@organizeit.com',
        name: 'Demo User',
        role: 'System Administrator',
        department: 'IT Operations',
        created_at: '2024-01-01T00:00:00Z',
        last_login: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          dashboard_layout: 'default'
        }
      }
      
      await kv.set(`user_profile:demo-user-id`, demoProfile)
      
      return c.json({
        user: demoProfile,
        session: { access_token: 'demo-token' },
        message: 'Demo login successful'
      })
    }

    // For production, validate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log(`Sign in error: ${error.message}`)
      return c.json({ error: error.message }, 401)
    }

    // Update last login
    if (data.user) {
      const existingProfile = await kv.get(`user_profile:${data.user.id}`)
      if (existingProfile) {
        existingProfile.last_login = new Date().toISOString()
        await kv.set(`user_profile:${data.user.id}`, existingProfile)
      }
    }

    console.log(`User signed in successfully: ${data.user.id}`)
    return c.json({
      user: data.user,
      session: data.session,
      message: 'Sign in successful'
    })
  } catch (error) {
    console.log(`Sign in server error: ${error}`)
    return c.json({ error: 'Internal server error during sign in' }, 500)
  }
})

// Chat bot endpoints
app.post('/make-server-efc8e70a/chat/message', async (c) => {
  try {
    const { message, context, userId } = await c.req.json()
    
    console.log(`Chat message from user ${userId}: ${message}`)
    
    // Store chat message
    const chatId = `chat:${userId}:${Date.now()}`
    await kv.set(chatId, {
      user_id: userId,
      message,
      context,
      timestamp: new Date().toISOString(),
      type: 'user'
    })

    // Generate AI response based on context and message
    const response = await generateAIResponse(message, context)
    
    // Store bot response
    const responseId = `chat:${userId}:${Date.now() + 1}`
    await kv.set(responseId, {
      user_id: userId,
      message: response.content,
      context,
      timestamp: new Date().toISOString(),
      type: 'bot',
      suggestions: response.suggestions
    })

    console.log(`Generated AI response for user ${userId}`)
    return c.json({
      response: response.content,
      suggestions: response.suggestions,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.log(`Chat error: ${error}`)
    return c.json({ error: 'Failed to process chat message' }, 500)
  }
})

// System metrics endpoints
app.get('/make-server-efc8e70a/metrics/dashboard', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    // Get or create real-time metrics
    const currentTime = Date.now()
    const metricsKey = `metrics:dashboard:current`
    
    let metrics = await kv.get(metricsKey)
    
    if (!metrics || currentTime - new Date(metrics.timestamp).getTime() > 60000) { // Update every minute
      // Calculate real system metrics
      const baseMetrics = await kv.get('system:base_metrics') || {
        system_health: 98.7,
        monthly_spend: 285000,
        carbon_footprint: 42.3,
        active_projects: 24,
        uptime: 99.87,
        mttd: 8.2,
        mttr: 24.5,
        alerts_count: 3
      }
      
      // Apply realistic variations
      metrics = {
        system_health: Math.max(95, Math.min(100, baseMetrics.system_health + (Math.random() - 0.5) * 0.8)),
        monthly_spend: baseMetrics.monthly_spend + Math.floor((Math.random() - 0.5) * 20000),
        carbon_footprint: Math.max(30, baseMetrics.carbon_footprint + (Math.random() - 0.5) * 4),
        active_projects: baseMetrics.active_projects + Math.floor((Math.random() - 0.5) * 4),
        uptime: Math.max(99, Math.min(100, baseMetrics.uptime + (Math.random() - 0.5) * 0.3)),
        mttd: Math.max(5, baseMetrics.mttd + (Math.random() - 0.5) * 2),
        mttr: Math.max(15, baseMetrics.mttr + (Math.random() - 0.5) * 8),
        alerts_count: Math.max(0, baseMetrics.alerts_count + Math.floor((Math.random() - 0.5) * 3)),
        timestamp: new Date().toISOString(),
        last_updated: currentTime
      }
      
      await kv.set(metricsKey, metrics)
      await kv.set(`metrics:historical:${currentTime}`, metrics)
    }

    return c.json(metrics)
  } catch (error) {
    console.log(`Metrics error: ${error}`)
    return c.json({ error: 'Failed to fetch metrics' }, 500)
  }
})

app.get('/make-server-efc8e70a/metrics/performance', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const hours = parseInt(c.req.query('hours') || '24')
    const performanceData = []
    const currentTime = Date.now()
    
    for (let i = hours; i >= 0; i--) {
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

    await kv.set(`performance:${hours}h:${Date.now()}`, performanceData)
    return c.json({ data: performanceData, hours })
  } catch (error) {
    console.log(`Performance metrics error: ${error}`)
    return c.json({ error: 'Failed to fetch performance metrics' }, 500)
  }
})

app.get('/make-server-efc8e70a/alerts/current', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    // Get current alerts from storage
    let alerts = await kv.get('alerts:current') || []
    
    // If no alerts exist, create some realistic ones
    if (alerts.length === 0) {
      alerts = [
        {
          id: `ALT-${Date.now()}-001`,
          severity: 'High',
          title: 'Database Connection Pool Exhaustion',
          description: 'Payment processing database showing connection pool exhaustion. Response times increased by 300%.',
          service: 'Payment API',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
          status: 'Active',
          impact: 'Payment processing delays',
          assignee: 'john.doe@company.com',
          environment: 'Production'
        },
        {
          id: `ALT-${Date.now()}-002`,
          severity: 'Medium',
          title: 'Memory Usage Threshold Exceeded',
          description: 'Web frontend instances consistently above 85% memory utilization.',
          service: 'Web Frontend',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'Investigating',
          impact: 'Potential performance degradation',
          assignee: 'sarah.johnson@company.com',
          environment: 'Production'
        },
        {
          id: `ALT-${Date.now()}-003`,
          severity: 'Low',
          title: 'SSL Certificate Expiring Soon',
          description: 'API gateway SSL certificate expires in 14 days.',
          service: 'API Gateway',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'Acknowledged',
          impact: 'Future service disruption if not renewed',
          assignee: 'mike.chen@company.com',
          environment: 'Production'
        }
      ]
      
      await kv.set('alerts:current', alerts)
    }

    return c.json({ alerts, count: alerts.length })
  } catch (error) {
    console.log(`Alerts error: ${error}`)
    return c.json({ error: 'Failed to fetch alerts' }, 500)
  }
})

app.post('/make-server-efc8e70a/alerts/create', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const alertData = await c.req.json()
    const alerts = await kv.get('alerts:current') || []
    
    const newAlert = {
      id: `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      status: 'Active',
      ...alertData
    }
    
    alerts.unshift(newAlert)
    await kv.set('alerts:current', alerts)
    
    return c.json({ alert: newAlert, message: 'Alert created successfully' })
  } catch (error) {
    console.log(`Create alert error: ${error}`)
    return c.json({ error: 'Failed to create alert' }, 500)
  }
})

app.put('/make-server-efc8e70a/alerts/:id/status', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const alertId = c.req.param('id')
    const { status, resolution } = await c.req.json()
    
    const alerts = await kv.get('alerts:current') || []
    const alertIndex = alerts.findIndex(a => a.id === alertId)
    
    if (alertIndex === -1) {
      return c.json({ error: 'Alert not found' }, 404)
    }
    
    alerts[alertIndex].status = status
    alerts[alertIndex].updated_at = new Date().toISOString()
    if (resolution) alerts[alertIndex].resolution = resolution
    
    await kv.set('alerts:current', alerts)
    
    return c.json({ alert: alerts[alertIndex], message: 'Alert updated successfully' })
  } catch (error) {
    console.log(`Update alert error: ${error}`)
    return c.json({ error: 'Failed to update alert' }, 500)
  }
})

// FinOps endpoints
app.get('/make-server-efc8e70a/finops/costs', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const period = c.req.query('period') || '6m'
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
    
    await kv.set(`finops:costs:${period}:${Date.now()}`, costData)
    return c.json({ data: costData, period })
  } catch (error) {
    console.log(`FinOps costs error: ${error}`)
    return c.json({ error: 'Failed to fetch cost data' }, 500)
  }
})

app.get('/make-server-efc8e70a/finops/optimization', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const opportunities = [
      {
        id: 'OPT-001',
        title: 'Right-size EC2 Instances',
        description: '23 EC2 instances are oversized based on actual usage patterns',
        potential_savings: 24000,
        effort: 'Low',
        impact: 'High',
        provider: 'AWS',
        category: 'Compute',
        timeline: '1 week',
        status: 'Identified'
      },
      {
        id: 'OPT-002',
        title: 'Reserved Instance Optimization',
        description: 'Purchase reserved instances for consistent workloads',
        potential_savings: 35000,
        effort: 'Medium',
        impact: 'High',
        provider: 'AWS',
        category: 'Pricing',
        timeline: '2 weeks',
        status: 'In Progress'
      },
      {
        id: 'OPT-003',
        title: 'Storage Lifecycle Management',
        description: 'Move infrequently accessed data to cheaper storage tiers',
        potential_savings: 12000,
        effort: 'Medium',
        impact: 'Medium',
        provider: 'Multi-cloud',
        category: 'Storage',
        timeline: '3 weeks',
        status: 'Identified'
      }
    ]
    
    await kv.set('finops:optimization:current', opportunities)
    return c.json({ opportunities, total_savings: opportunities.reduce((sum, opp) => sum + opp.potential_savings, 0) })
  } catch (error) {
    console.log(`FinOps optimization error: ${error}`)
    return c.json({ error: 'Failed to fetch optimization data' }, 500)
  }
})

// ESG monitoring endpoints
app.get('/make-server-efc8e70a/esg/carbon', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const carbonData = {
      current_footprint: 42.3,
      monthly_trend: -12,
      breakdown: [
        { name: 'Computing', value: 45, emissions: 19.0, color: '#8884d8' },
        { name: 'Storage', value: 25, emissions: 10.6, color: '#82ca9d' },
        { name: 'Network', value: 20, emissions: 8.5, color: '#ffc658' },
        { name: 'Other', value: 10, emissions: 4.2, color: '#ff7300' }
      ],
      renewable_percentage: 68,
      efficiency_score: 83,
      targets: {
        carbon_neutral_by: '2030',
        renewable_target: 85,
        efficiency_target: 90
      }
    }
    
    await kv.set('esg:carbon:current', carbonData)
    return c.json(carbonData)
  } catch (error) {
    console.log(`ESG carbon error: ${error}`)
    return c.json({ error: 'Failed to fetch carbon data' }, 500)
  }
})

app.get('/make-server-efc8e70a/esg/sustainability', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const sustainabilityData = {
      metrics: {
        energy_efficiency: 88,
        water_usage_efficiency: 76,
        waste_reduction: 92,
        sustainable_procurement: 67
      },
      initiatives: [
        {
          name: 'Green Computing Program',
          status: 'Active',
          impact: 'High',
          co2_reduction: 8.5,
          timeline: 'Q4 2024'
        },
        {
          name: 'Renewable Energy Transition',
          status: 'In Progress',
          impact: 'Very High',
          co2_reduction: 15.2,
          timeline: 'Q2 2025'
        }
      ],
      compliance_status: {
        iso14001: 'Certified',
        ghg_protocol: 'Compliant',
        science_based_targets: 'In Progress'
      }
    }
    
    await kv.set('esg:sustainability:current', sustainabilityData)
    return c.json(sustainabilityData)
  } catch (error) {
    console.log(`ESG sustainability error: ${error}`)
    return c.json({ error: 'Failed to fetch sustainability data' }, 500)
  }
})

// Project collaboration endpoints
app.get('/make-server-efc8e70a/projects', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    let projects = await kv.get('projects:current') || []
    
    if (projects.length === 0) {
      projects = [
        {
          id: 'PROJ-001',
          name: 'Cloud Migration Phase 2',
          description: 'Migrate remaining on-premise workloads to hybrid cloud',
          status: 'In Progress',
          priority: 'High',
          progress: 67,
          budget: 250000,
          spent: 165000,
          team_size: 8,
          start_date: '2024-01-15',
          end_date: '2024-06-30',
          lead: 'Sarah Johnson',
          category: 'Infrastructure'
        },
        {
          id: 'PROJ-002', 
          name: 'Security Compliance Upgrade',
          description: 'Implement SOC2 Type II compliance across all systems',
          status: 'Planning',
          priority: 'High',
          progress: 23,
          budget: 180000,
          spent: 42000,
          team_size: 5,
          start_date: '2024-02-01',
          end_date: '2024-08-15',
          lead: 'Mike Chen',
          category: 'Security'
        },
        {
          id: 'PROJ-003',
          name: 'AI-Powered Monitoring',
          description: 'Deploy machine learning models for predictive monitoring',
          status: 'In Progress',
          priority: 'Medium',
          progress: 45,
          budget: 120000,
          spent: 54000,
          team_size: 4,
          start_date: '2024-03-01',
          end_date: '2024-07-31',
          lead: 'David Kim',
          category: 'Innovation'
        }
      ]
      
      await kv.set('projects:current', projects)
    }
    
    return c.json({ projects, count: projects.length })
  } catch (error) {
    console.log(`Projects error: ${error}`)
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

app.post('/make-server-efc8e70a/projects', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const projectData = await c.req.json()
    const projects = await kv.get('projects:current') || []
    
    const newProject = {
      id: `PROJ-${String(projects.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      progress: 0,
      spent: 0,
      status: 'Planning',
      ...projectData
    }
    
    projects.push(newProject)
    await kv.set('projects:current', projects)
    
    return c.json({ project: newProject, message: 'Project created successfully' })
  } catch (error) {
    console.log(`Create project error: ${error}`)
    return c.json({ error: 'Failed to create project' }, 500)
  }
})

// Service health endpoints
app.get('/make-server-efc8e70a/services/health', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    let services = await kv.get('services:health') || []
    
    if (services.length === 0) {
      services = [
        { 
          id: 'SVC-001',
          name: 'Web Frontend', 
          status: 'healthy', 
          uptime: 99.98, 
          response_time: 245,
          last_incident: '2024-01-15T10:30:00Z',
          environment: 'Production'
        },
        { 
          id: 'SVC-002',
          name: 'User API', 
          status: 'healthy', 
          uptime: 99.95, 
          response_time: 189,
          last_incident: '2024-01-12T14:20:00Z',
          environment: 'Production'
        },
        { 
          id: 'SVC-003',
          name: 'Payment API', 
          status: 'degraded', 
          uptime: 98.2, 
          response_time: 1200,
          last_incident: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          environment: 'Production'
        },
        { 
          id: 'SVC-004',
          name: 'Database Cluster', 
          status: 'healthy', 
          uptime: 99.99, 
          response_time: 12,
          last_incident: '2023-12-28T09:15:00Z',
          environment: 'Production'
        },
        { 
          id: 'SVC-005',
          name: 'Cache Layer', 
          status: 'warning', 
          uptime: 99.1, 
          response_time: 8,
          last_incident: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          environment: 'Production'
        }
      ]
      
      await kv.set('services:health', services)
    }
    
    return c.json({ services, count: services.length })
  } catch (error) {
    console.log(`Services health error: ${error}`)
    return c.json({ error: 'Failed to fetch service health' }, 500)
  }
})

// User notifications endpoints
app.get('/make-server-efc8e70a/notifications', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    let notifications = await kv.get('notifications:current') || []
    
    // Always ensure we have current, realistic notifications
    const currentTime = Date.now()
    const baseNotifications = [
      {
        id: 'NOT-001',
        type: 'alert',
        title: 'High CPU Usage Detected',
        message: 'Web frontend instances showing sustained high CPU usage above 85% threshold',
        timestamp: new Date(currentTime - 30 * 60 * 1000).toISOString(),
        read: false,
        severity: 'warning',
        action_url: '/it-operations?tab=performance',
        source: 'Monitoring System'
      },
      {
        id: 'NOT-002',
        type: 'cost',
        title: 'Monthly Budget Alert',
        message: 'Cloud spending is 15% above projected budget for this month ($285K vs $248K planned)',
        timestamp: new Date(currentTime - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        severity: 'warning',
        action_url: '/finops?tab=budget',
        source: 'FinOps Analytics'
      },
      {
        id: 'NOT-003',
        type: 'security',
        title: 'Security Patch Available',
        message: 'Critical security patches available for 12 production instances - CVE-2024-1234',
        timestamp: new Date(currentTime - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
        severity: 'high',
        action_url: '/audit?tab=compliance',
        source: 'Security Scanner'
      },
      {
        id: 'NOT-004',
        type: 'esg',
        title: 'Carbon Footprint Reduction',
        message: 'Monthly carbon emissions reduced by 12% through optimization initiatives',
        timestamp: new Date(currentTime - 6 * 60 * 60 * 1000).toISOString(),
        read: false,
        severity: 'info',
        action_url: '/esg?tab=carbon',
        source: 'ESG Monitoring'
      },
      {
        id: 'NOT-005',
        type: 'ai',
        title: 'Cost Optimization Opportunity',
        message: 'AI analysis identified $79,500/month potential savings from right-sizing instances',
        timestamp: new Date(currentTime - 8 * 60 * 60 * 1000).toISOString(),
        read: false,
        severity: 'info',
        action_url: '/ai-insights?tab=cost',
        source: 'AI Analytics Engine'
      },
      {
        id: 'NOT-006',
        type: 'system',
        title: 'Database Performance Alert',
        message: 'Payment processing database showing connection pool exhaustion',
        timestamp: new Date(currentTime - 12 * 60 * 60 * 1000).toISOString(),
        read: true,
        severity: 'critical',
        action_url: '/it-operations?tab=incidents',
        source: 'Database Monitor'
      }
    ]
    
    // Update timestamps to be realistic and current
    notifications = baseNotifications.map(notification => ({
      ...notification,
      updated_at: new Date().toISOString()
    }))
    
    await kv.set('notifications:current', notifications)
    
    return c.json({ 
      notifications, 
      unread_count: notifications.filter(n => !n.read).length,
      total_count: notifications.length,
      last_updated: new Date().toISOString()
    })
  } catch (error) {
    console.log(`Notifications error: ${error}`)
    return c.json({ error: 'Failed to fetch notifications' }, 500)
  }
})

app.put('/make-server-efc8e70a/notifications/:id/read', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const notificationId = c.req.param('id')
    const notifications = await kv.get('notifications:current') || []
    
    const notification = notifications.find(n => n.id === notificationId)
    if (!notification) {
      return c.json({ error: 'Notification not found' }, 404)
    }
    
    notification.read = true
    notification.read_at = new Date().toISOString()
    
    await kv.set('notifications:current', notifications)
    
    return c.json({ notification, message: 'Notification marked as read' })
  } catch (error) {
    console.log(`Mark notification read error: ${error}`)
    return c.json({ error: 'Failed to mark notification as read' }, 500)
  }
})

// User Dashboard specific endpoints
app.get('/make-server-efc8e70a/user/:userId/dashboard', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const userId = c.req.param('userId')
    const userProfile = await kv.get(`user_profile:${userId}`)
    
    if (!userProfile) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Generate user-specific metrics
    const userMetrics = {
      tasks_completed: 47,
      tasks_pending: 12,
      projects_active: 3,
      efficiency_score: 92,
      last_activity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      weekly_hours: 38.5,
      alerts_assigned: 2,
      cost_savings_contributed: 15400
    }

    // User's recent activities
    const recentActivities = [
      {
        id: 'ACT-001',
        type: 'task_completed',
        title: 'Resolved database performance issue',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        impact: 'High',
        project: 'Cloud Migration Phase 2'
      },
      {
        id: 'ACT-002',
        type: 'cost_optimization',
        title: 'Implemented auto-scaling for dev environment',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        impact: 'Medium',
        savings: 2400
      },
      {
        id: 'ACT-003',
        type: 'security_patch',
        title: 'Applied security patches to 8 servers',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        impact: 'High',
        compliance: 'SOC2'
      }
    ]

    const dashboardData = {
      user: userProfile,
      metrics: userMetrics,
      recent_activities: recentActivities,
      last_updated: new Date().toISOString()
    }

    await kv.set(`user_dashboard:${userId}`, dashboardData)
    
    return c.json(dashboardData)
  } catch (error) {
    console.log(`User dashboard error: ${error}`)
    return c.json({ error: 'Failed to fetch user dashboard data' }, 500)
  }
})

// AI Insights endpoints
app.get('/make-server-efc8e70a/ai/insights', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const insights = {
      cost_optimization: {
        total_savings_identified: 79500,
        high_impact_opportunities: 3,
        medium_impact_opportunities: 7,
        recommendations: [
          {
            id: 'REC-001',
            title: 'Right-size EC2 Instances',
            impact: 'High',
            savings: 24000,
            confidence: 95,
            effort: 'Low',
            timeline: '1 week'
          },
          {
            id: 'REC-002',
            title: 'Reserved Instance Optimization',
            impact: 'High',
            savings: 35000,
            confidence: 89,
            effort: 'Medium',
            timeline: '2 weeks'
          }
        ]
      },
      performance_insights: {
        anomalies_detected: 4,
        predictive_alerts: 2,
        optimization_score: 87,
        trends: [
          {
            metric: 'response_time',
            trend: 'improving',
            change: -12,
            forecast: 'stable'
          },
          {
            metric: 'error_rate',
            trend: 'stable',
            change: 0.2,
            forecast: 'stable'
          }
        ]
      },
      security_analysis: {
        risk_score: 23,
        vulnerabilities_found: 8,
        patches_available: 12,
        compliance_score: 94
      },
      sustainability_insights: {
        carbon_reduction_opportunities: 6,
        efficiency_improvements: 4,
        renewable_energy_recommendations: 2,
        projected_savings: 8500
      }
    }

    await kv.set('ai:insights:current', insights)
    return c.json(insights)
  } catch (error) {
    console.log(`AI insights error: ${error}`)
    return c.json({ error: 'Failed to fetch AI insights' }, 500)
  }
})

// Identity Management endpoints
app.get('/make-server-efc8e70a/identity/users', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    let users = await kv.get('identity:users') || []
    
    if (users.length === 0) {
      users = [
        {
          id: 'USR-001',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@organizeit.com',
          role: 'System Administrator',
          department: 'IT Operations',
          status: 'Active',
          last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          created_at: '2024-01-15T10:00:00Z',
          permissions: ['admin', 'read', 'write', 'delete'],
          mfa_enabled: true
        },
        {
          id: 'USR-002',
          name: 'Mike Chen',
          email: 'mike.chen@organizeit.com',
          role: 'DevOps Engineer',
          department: 'Engineering',
          status: 'Active',
          last_login: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          created_at: '2024-01-20T14:30:00Z',
          permissions: ['read', 'write', 'deploy'],
          mfa_enabled: true
        },
        {
          id: 'USR-003',
          name: 'David Kim',
          email: 'david.kim@organizeit.com',
          role: 'Data Engineer',
          department: 'Analytics',
          status: 'Active',
          last_login: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: '2024-02-01T09:15:00Z',
          permissions: ['read', 'write', 'analytics'],
          mfa_enabled: false
        }
      ]
      
      await kv.set('identity:users', users)
    }

    return c.json({ users, total: users.length, active: users.filter(u => u.status === 'Active').length })
  } catch (error) {
    console.log(`Identity users error: ${error}`)
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

// Audit Trails endpoints
app.get('/make-server-efc8e70a/audit/events', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const limit = parseInt(c.req.query('limit') || '50')
    let auditEvents = await kv.get('audit:events') || []
    
    if (auditEvents.length === 0) {
      const currentTime = Date.now()
      auditEvents = [
        {
          id: 'AUD-001',
          event_type: 'user_login',
          user_id: 'USR-001',
          user_email: 'sarah.johnson@organizeit.com',
          action: 'successful_login',
          resource: 'authentication_system',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(currentTime - 30 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: 'AUD-002',
          event_type: 'configuration_change',
          user_id: 'USR-002',
          user_email: 'mike.chen@organizeit.com',
          action: 'updated_security_policy',
          resource: 'firewall_rules',
          details: 'Modified port 443 access rules',
          ip_address: '192.168.1.105',
          timestamp: new Date(currentTime - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: 'AUD-003',
          event_type: 'resource_access',
          user_id: 'USR-003',
          user_email: 'david.kim@organizeit.com',
          action: 'accessed_sensitive_data',
          resource: 'customer_database',
          details: 'Exported customer analytics report',
          ip_address: '192.168.1.110',
          timestamp: new Date(currentTime - 4 * 60 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: 'AUD-004',
          event_type: 'failed_access',
          user_id: null,
          user_email: 'unknown@external.com',
          action: 'failed_login_attempt',
          resource: 'authentication_system',
          details: 'Multiple failed password attempts',
          ip_address: '203.0.113.45',
          timestamp: new Date(currentTime - 6 * 60 * 60 * 1000).toISOString(),
          status: 'blocked'
        }
      ]
      
      await kv.set('audit:events', auditEvents)
    }

    const paginatedEvents = auditEvents.slice(0, limit)
    
    return c.json({ 
      events: paginatedEvents, 
      total: auditEvents.length,
      limit,
      last_updated: new Date().toISOString()
    })
  } catch (error) {
    console.log(`Audit events error: ${error}`)
    return c.json({ error: 'Failed to fetch audit events' }, 500)
  }
})

// Resource Optimization endpoints
app.get('/make-server-efc8e70a/optimization/resources', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }

    const optimizationData = {
      summary: {
        total_resources: 156,
        underutilized: 23,
        overutilized: 8,
        optimized: 125,
        potential_savings: 47800,
        efficiency_score: 78
      },
      recommendations: [
        {
          id: 'OPT-001',
          type: 'downsize',
          resource: 'EC2 Instance i-0abc123def456',
          current_spec: 't3.large',
          recommended_spec: 't3.medium',
          utilization: 35,
          savings: 840,
          confidence: 94
        },
        {
          id: 'OPT-002',
          type: 'terminate',
          resource: 'EBS Volume vol-0123456789',
          current_spec: '100GB gp3',
          recommended_spec: 'Delete',
          utilization: 0,
          savings: 320,
          confidence: 99
        },
        {
          id: 'OPT-003',
          type: 'upsize',
          resource: 'RDS Instance db-prod-main',
          current_spec: 'db.t3.medium',
          recommended_spec: 'db.t3.large',
          utilization: 92,
          cost_increase: 420,
          performance_gain: 45
        }
      ],
      categories: [
        { name: 'Compute', total: 89, optimized: 71, savings: 28900 },
        { name: 'Storage', total: 45, optimized: 38, savings: 12600 },
        { name: 'Network', total: 22, optimized: 16, savings: 6300 }
      ]
    }

    await kv.set('optimization:resources:current', optimizationData)
    return c.json(optimizationData)
  } catch (error) {
    console.log(`Resource optimization error: ${error}`)
    return c.json({ error: 'Failed to fetch optimization data' }, 500)
  }
})

// AI Response Generator
async function generateAIResponse(message: string, context: string) {
  const lowerMessage = message.toLowerCase()
  
  // Cost optimization responses
  if (lowerMessage.includes('cost') || lowerMessage.includes('save') || lowerMessage.includes('optimize')) {
    return {
      content: `💰 **Cost Optimization Analysis:**

Based on real-time data analysis, I've identified these opportunities:

**High Impact:**
• Right-size 23 oversized EC2 instances → $24,000/month savings
• Purchase Reserved Instances for consistent workloads → $35,000/month savings

**Medium Impact:**  
• Migrate cold storage to IA/Glacier → $12,000/month savings
• Optimize network traffic routing → $8,500/month savings

**Total Potential Savings: $79,500/month (31% reduction)**

Would you like me to create an implementation roadmap?`,
      suggestions: [
        'Create implementation roadmap',
        'Prioritize by ROI',
        'Schedule optimization tasks',
        'Generate executive report'
      ]
    }
  }

  // Alert and incident responses
  if (lowerMessage.includes('alert') || lowerMessage.includes('incident') || lowerMessage.includes('problem')) {
    return {
      content: `🚨 **Current System Status:**

**Critical Alerts (2):**
• Database timeout in Payment API - 2 hours active
• High CPU usage on web frontend - 30 minutes active

**Recommendations:**
1. Scale Payment API database connections immediately
2. Enable auto-scaling for web frontend
3. Review recent deployments for potential causes

**Impact Assessment:**
• Payment processing: 15% slower response times
• User experience: Minimal impact detected

Should I initiate automated remediation procedures?`,
      suggestions: [
        'Start automated remediation',
        'Escalate to on-call engineer',
        'View detailed diagnostics',
        'Create incident report'
      ]
    }
  }

  // ESG and sustainability responses
  if (lowerMessage.includes('esg') || lowerMessage.includes('carbon') || lowerMessage.includes('sustainability')) {
    return {
      content: `🌱 **ESG Impact Dashboard:**

**Current Performance:**
• Carbon Footprint: 40.7 tCO₂/month (-27% YTD)
• Renewable Energy: 68% of total consumption
• Water Efficiency: 83% (industry leading)

**Smart Recommendations:**
1. **Workload Scheduling:** Shift batch jobs to low-carbon hours
   → Reduce 2.4 tCO₂/month (6% improvement)

2. **Green Computing:** Optimize for renewable energy availability
   → Target 85% renewable by Q4

3. **Efficiency Gains:** Advanced cooling optimization
   → 15% reduction in energy consumption

**Compliance Status:** On track for carbon neutrality by 2030`,
      suggestions: [
        'Implement smart scheduling',
        'View renewable energy plan',
        'Generate ESG report',
        'Set sustainability goals'
      ]
    }
  }

  // AI and automation responses
  if (lowerMessage.includes('ai') || lowerMessage.includes('predict') || lowerMessage.includes('automat')) {
    return {
      content: `🤖 **AI Operations Intelligence:**

**Predictive Insights:**
• 94.2% accuracy in resource demand forecasting
• Next Tuesday: 23% CPU spike predicted (high confidence)
• Cost anomaly detected in Azure storage (+340% unusual)

**Active Automations:**
• Incident response: 78% automated resolution
• Resource scaling: 92% predictive scaling success
• Security threats: Real-time ML-based detection

**Model Performance:**
• Anomaly Detection: 96.1% accuracy
• Cost Prediction: 89.5% accuracy  
• Performance Forecasting: 94.2% accuracy

**ROI Impact:** $127K saved YTD through AI optimizations`,
      suggestions: [
        'Review prediction models',
        'Configure auto-scaling',
        'Investigate cost anomaly',
        'Enhance automation rules'
      ]
    }
  }

  // Default contextual response
  return {
    content: `I understand you're asking about "${message}". 

As your OrganizeIT AI Assistant, I have access to real-time data across:
• IT Operations & Monitoring
• Financial Operations (FinOps) 
• ESG & Sustainability Metrics
• Security & Compliance
• Resource Optimization

I can help you with analysis, recommendations, troubleshooting, and automation. What specific area would you like to explore?`,
    suggestions: [
      'Analyze current performance',
      'Show optimization opportunities', 
      'Check system health',
      'Review recent changes'
    ]
  }
}

console.log('OrganizeIT Backend Server starting...')
Deno.serve(app.fetch)