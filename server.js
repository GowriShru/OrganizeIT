import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// In-memory storage for demo purposes
let storage = new Map();

// Initialize with some demo data
const initializeStorage = () => {
  // Admin dashboard metrics
  storage.set('admin:dashboard', {
    system_health: 98.7,
    monthly_spend: 285000,
    carbon_footprint: 42.3,
    active_projects: 24,
    uptime: 99.87,
    alerts_count: 3,
    timestamp: new Date().toISOString()
  });

  // IT Operations data
  storage.set('operations:current', {
    services: [
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
      }
    ],
    alerts: [
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
      }
    ],
    performance: generatePerformanceData(24)
  });

  // FinOps data
  storage.set('finops:current', {
    costs: generateCostData(),
    optimization: [
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
      }
    ]
  });
};

// Helper functions
function generatePerformanceData(hours) {
  const performanceData = [];
  const currentTime = Date.now();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = currentTime - (i * 60 * 60 * 1000);
    const hour = new Date(timestamp).getHours();
    
    // Simulate realistic performance patterns
    const baseLoad = hour >= 9 && hour <= 17 ? 70 : 40; // Business hours vs off-hours
    
    performanceData.push({
      timestamp: new Date(timestamp).toISOString(),
      time: String(hour).padStart(2, '0') + ':00',
      cpu: Math.max(20, Math.min(95, baseLoad + (Math.random() - 0.5) * 30)),
      memory: Math.max(30, Math.min(90, baseLoad + (Math.random() - 0.5) * 25)),
      disk: Math.max(10, Math.min(80, baseLoad * 0.6 + (Math.random() - 0.5) * 20)),
      network: Math.max(5, Math.min(70, baseLoad * 0.4 + (Math.random() - 0.5) * 15))
    });
  }
  
  return performanceData;
}

function generateCostData() {
  const costData = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = date.toLocaleString('default', { month: 'short' });
    
    // Simulate realistic cost patterns with growth trends
    const baseCosts = {
      aws: 125000 + (5 - i) * 2000,
      azure: 87000 + (5 - i) * 1500,
      gcp: 45000 + (5 - i) * 1000
    };
    
    costData.push({
      month,
      date: date.toISOString(),
      aws: baseCosts.aws + Math.floor((Math.random() - 0.5) * 10000),
      azure: baseCosts.azure + Math.floor((Math.random() - 0.5) * 8000),
      gcp: baseCosts.gcp + Math.floor((Math.random() - 0.5) * 5000),
      total: baseCosts.aws + baseCosts.azure + baseCosts.gcp
    });
  }
  
  return costData;
}

// API Routes
app.get('/api/admin-dashboard', (req, res) => {
  try {
    const data = storage.get('admin:dashboard');
    
    // Add some realistic variations
    const updatedData = {
      ...data,
      system_health: Math.max(95, Math.min(100, data.system_health + (Math.random() - 0.5) * 0.8)),
      monthly_spend: data.monthly_spend + Math.floor((Math.random() - 0.5) * 20000),
      carbon_footprint: Math.max(30, data.carbon_footprint + (Math.random() - 0.5) * 4),
      timestamp: new Date().toISOString()
    };
    
    storage.set('admin:dashboard', updatedData);
    
    res.json({
      success: true,
      data: updatedData
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard data' });
  }
});

app.get('/api/operations', (req, res) => {
  try {
    const data = storage.get('operations:current');
    
    res.json({
      success: true,
      data: {
        services: data.services,
        alerts: data.alerts,
        performance: generatePerformanceData(24), // Generate fresh performance data
        metrics: {
          total_services: data.services.length,
          healthy_services: data.services.filter(s => s.status === 'healthy').length,
          active_alerts: data.alerts.filter(a => a.status === 'Active').length,
          avg_response_time: Math.round(data.services.reduce((sum, s) => sum + s.response_time, 0) / data.services.length)
        }
      }
    });
  } catch (error) {
    console.error('Operations error:', error);
    res.status(500).json({ error: 'Failed to fetch operations data' });
  }
});

app.get('/api/finops', (req, res) => {
  try {
    const data = storage.get('finops:current');
    
    res.json({
      success: true,
      data: {
        costs: generateCostData(), // Generate fresh cost data
        optimization: data.optimization,
        summary: {
          total_monthly_cost: data.costs.reduce((sum, item) => sum + item.total, 0) / data.costs.length,
          potential_savings: data.optimization.reduce((sum, opp) => sum + opp.potential_savings, 0),
          optimization_opportunities: data.optimization.length
        }
      }
    });
  } catch (error) {
    console.error('FinOps error:', error);
    res.status(500).json({ error: 'Failed to fetch FinOps data' });
  }
});

app.get('/api/esg', (req, res) => {
  try {
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
    };
    
    res.json({
      success: true,
      data: carbonData
    });
  } catch (error) {
    console.error('ESG error:', error);
    res.status(500).json({ error: 'Failed to fetch ESG data' });
  }
});

app.get('/api/projects', (req, res) => {
  try {
    const projects = [
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
      }
    ];
    
    res.json({
      success: true,
      data: { projects, count: projects.length }
    });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects data' });
  }
});

app.get('/api/notifications', (req, res) => {
  try {
    const currentTime = Date.now();
    const notifications = [
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
      }
    ];
    
    res.json({
      success: true,
      data: {
        notifications,
        unread_count: notifications.filter(n => !n.read).length,
        total_count: notifications.length,
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications data' });
  }
});

// Action endpoints for button clicks

// IT Operations Actions
app.post('/api/operations/restart-service', (req, res) => {
  try {
    const { serviceId } = req.body;
    console.log(`🔄 Restarting service: ${serviceId}`);
    
    // Simulate service restart
    setTimeout(() => {
      const operations = storage.get('operations:current');
      const service = operations.services.find(s => s.id === serviceId);
      if (service) {
        service.status = 'healthy';
        service.response_time = Math.floor(service.response_time * 0.7); // Improve response time
        service.last_incident = new Date().toISOString();
        storage.set('operations:current', operations);
      }
    }, 2000);
    
    res.json({
      success: true,
      message: `Service ${serviceId} restart initiated`,
      estimated_completion: '2 minutes'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restart service' });
  }
});

app.post('/api/operations/resolve-alert', (req, res) => {
  try {
    const { alertId, resolution } = req.body;
    console.log(`✅ Resolving alert: ${alertId}`);
    
    const operations = storage.get('operations:current');
    const alertIndex = operations.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      operations.alerts[alertIndex].status = 'Resolved';
      operations.alerts[alertIndex].resolution = resolution;
      operations.alerts[alertIndex].resolved_at = new Date().toISOString();
      storage.set('operations:current', operations);
    }
    
    res.json({
      success: true,
      message: `Alert ${alertId} resolved successfully`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

app.post('/api/operations/scale-service', (req, res) => {
  try {
    const { serviceId, instances } = req.body;
    console.log(`📈 Scaling service ${serviceId} to ${instances} instances`);
    
    res.json({
      success: true,
      message: `Service ${serviceId} scaling to ${instances} instances`,
      estimated_completion: '5 minutes'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scale service' });
  }
});

// FinOps Actions
app.post('/api/finops/apply-optimization', (req, res) => {
  try {
    const { optimizationId } = req.body;
    console.log(`💰 Applying optimization: ${optimizationId}`);
    
    const finops = storage.get('finops:current');
    const optimization = finops.optimization.find(o => o.id === optimizationId);
    if (optimization) {
      optimization.status = 'In Progress';
      optimization.started_at = new Date().toISOString();
      storage.set('finops:current', finops);
    }
    
    res.json({
      success: true,
      message: `Optimization ${optimizationId} implementation started`,
      estimated_savings: optimization?.potential_savings || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply optimization' });
  }
});

app.post('/api/finops/set-budget-alert', (req, res) => {
  try {
    const { threshold, email } = req.body;
    console.log(`📧 Setting budget alert: ${threshold}% threshold for ${email}`);
    
    res.json({
      success: true,
      message: `Budget alert configured for ${threshold}% threshold`,
      alert_email: email
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set budget alert' });
  }
});

app.post('/api/finops/export-report', (req, res) => {
  try {
    const { reportType, dateRange, format } = req.body;
    console.log(`📊 Exporting ${reportType} report in ${format} format`);
    
    res.json({
      success: true,
      message: `${reportType} report exported successfully`,
      download_url: `/api/downloads/finops-${reportType}-${Date.now()}.${format}`,
      file_size: '2.3 MB'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export report' });
  }
});

// ESG Actions
app.post('/api/esg/update-target', (req, res) => {
  try {
    const { target, value } = req.body;
    console.log(`🌱 Updating ESG target: ${target} to ${value}`);
    
    res.json({
      success: true,
      message: `ESG target ${target} updated to ${value}`,
      effective_date: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ESG target' });
  }
});

app.post('/api/esg/generate-report', (req, res) => {
  try {
    const { period, scope } = req.body;
    console.log(`📋 Generating ESG report for ${period} with scope ${scope}`);
    
    res.json({
      success: true,
      message: `ESG report generated for ${period}`,
      report_id: `ESG-RPT-${Date.now()}`,
      carbon_footprint: 42.3,
      renewable_percentage: 68
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate ESG report' });
  }
});

// Project Management Actions
app.post('/api/projects/update-status', (req, res) => {
  try {
    const { projectId, status, notes } = req.body;
    console.log(`📋 Updating project ${projectId} status to: ${status}`);
    
    res.json({
      success: true,
      message: `Project ${projectId} status updated to ${status}`,
      updated_at: new Date().toISOString(),
      notes: notes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project status' });
  }
});

app.post('/api/projects/create', (req, res) => {
  try {
    const { name, description, priority, budget, team_size, end_date } = req.body;
    console.log(`➕ Creating new project: ${name}`);
    
    const projectId = `PROJ-${String(Date.now()).slice(-3)}`;
    
    res.json({
      success: true,
      message: `Project ${name} created successfully`,
      project_id: projectId,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// AI Insights Actions
app.post('/api/ai/analyze', (req, res) => {
  try {
    const { dataType, parameters } = req.body;
    console.log(`🤖 Running AI analysis: ${dataType}`);
    
    // Simulate AI analysis
    const insights = {
      performance: [
        'CPU utilization patterns suggest optimal scaling at 3:00 PM daily',
        'Memory usage spikes correlate with batch processing jobs',
        'Network latency increased 23% during peak hours this week'
      ],
      cost: [
        'Reserved instances could save $35K annually for consistent workloads',
        'Unused storage volumes detected: $2.4K monthly waste',
        'Auto-scaling policies could reduce costs by 18%'
      ],
      security: [
        'Anomalous login patterns detected from 3 IP ranges',
        'SSL certificates expiring in next 30 days: 5 services',
        'Privilege escalation attempts blocked: 12 this week'
      ]
    };
    
    res.json({
      success: true,
      analysis_id: `AI-${Date.now()}`,
      insights: insights[dataType] || insights.performance,
      confidence_score: Math.round(Math.random() * 20 + 80), // 80-100%
      recommendations_count: 3
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to run AI analysis' });
  }
});

app.post('/api/ai/optimize', (req, res) => {
  try {
    const { optimization_type, target_metric } = req.body;
    console.log(`⚡ Running AI optimization: ${optimization_type}`);
    
    res.json({
      success: true,
      message: `AI optimization for ${optimization_type} completed`,
      optimization_id: `OPT-AI-${Date.now()}`,
      improvement_percentage: Math.round(Math.random() * 25 + 10), // 10-35%
      estimated_savings: Math.round(Math.random() * 50000 + 10000) // $10K-60K
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to run AI optimization' });
  }
});

// Resource Optimization Actions
app.post('/api/resources/auto-scale', (req, res) => {
  try {
    const { resource_type, scaling_policy } = req.body;
    console.log(`🔄 Configuring auto-scaling: ${resource_type}`);
    
    res.json({
      success: true,
      message: `Auto-scaling configured for ${resource_type}`,
      policy_id: `SCALE-${Date.now()}`,
      min_instances: scaling_policy.min || 2,
      max_instances: scaling_policy.max || 10
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to configure auto-scaling' });
  }
});

app.post('/api/resources/cleanup', (req, res) => {
  try {
    const { resource_types } = req.body;
    console.log(`🧹 Starting resource cleanup: ${resource_types.join(', ')}`);
    
    res.json({
      success: true,
      message: `Resource cleanup initiated for ${resource_types.length} resource types`,
      cleanup_id: `CLEANUP-${Date.now()}`,
      estimated_savings: Math.round(Math.random() * 15000 + 5000), // $5K-20K
      completion_time: '45 minutes'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start resource cleanup' });
  }
});

// Identity Management Actions
app.post('/api/identity/reset-password', (req, res) => {
  try {
    const { userId, email } = req.body;
    console.log(`🔐 Password reset initiated for: ${email}`);
    
    res.json({
      success: true,
      message: `Password reset email sent to ${email}`,
      reset_token_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate password reset' });
  }
});

app.post('/api/identity/update-permissions', (req, res) => {
  try {
    const { userId, permissions } = req.body;
    console.log(`👤 Updating permissions for user: ${userId}`);
    
    res.json({
      success: true,
      message: `Permissions updated for user ${userId}`,
      updated_permissions: permissions,
      effective_immediately: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update permissions' });
  }
});

// Notifications Actions
app.post('/api/notifications/mark-read', (req, res) => {
  try {
    const { notificationIds } = req.body;
    console.log(`📬 Marking ${notificationIds.length} notifications as read`);
    
    res.json({
      success: true,
      message: `${notificationIds.length} notifications marked as read`,
      updated_count: notificationIds.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

app.post('/api/notifications/configure', (req, res) => {
  try {
    const { channels, frequency, types } = req.body;
    console.log(`⚙️ Configuring notification preferences`);
    
    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      active_channels: channels,
      notification_types: types
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to configure notifications' });
  }
});

// Search endpoint
app.post('/api/search', (req, res) => {
  try {
    const { query, filters } = req.body;
    console.log(`🔍 Searching for: ${query}`);
    
    // Mock search results
    const mockResults = [
      {
        id: 'srv-001',
        title: 'Web Frontend Service',
        type: 'service',
        description: 'Production web frontend with load balancing',
        module: 'it-operations',
        relevance: 95
      },
      {
        id: 'alert-001',
        title: 'High CPU Usage Alert',
        type: 'alert',
        description: 'Critical performance alert for production systems',
        module: 'it-operations',
        relevance: 88
      },
      {
        id: 'cost-001',
        title: 'Monthly Cost Report',
        type: 'report',
        description: 'Detailed breakdown of cloud infrastructure costs',
        module: 'finops',
        relevance: 75
      }
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({
      success: true,
      query,
      results: mockResults,
      total_count: mockResults.length,
      search_time_ms: Math.round(Math.random() * 100 + 50)
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Audit Trails Actions
app.post('/api/audit/filter', (req, res) => {
  try {
    const { filters, date_range, risk_levels, users, services } = req.body;
    console.log(`🔍 Applying audit log filters: ${JSON.stringify(filters)}`);
    
    res.json({
      success: true,
      message: 'Audit log filters applied successfully',
      filter_id: `FILTER-${Date.now()}`,
      matched_logs: Math.round(Math.random() * 5000 + 1000),
      processing_time_ms: Math.round(Math.random() * 200 + 50)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply audit filters' });
  }
});

app.post('/api/audit/export', (req, res) => {
  try {
    const { format, date_range, include_blockchain, filters } = req.body;
    console.log(`📤 Exporting audit logs in ${format} format`);
    
    res.json({
      success: true,
      message: `Audit logs exported successfully in ${format} format`,
      download_url: `/api/downloads/audit-logs-${Date.now()}.${format}`,
      file_size: `${Math.round(Math.random() * 50 + 10)}.${Math.round(Math.random() * 9)}MB`,
      record_count: Math.round(Math.random() * 10000 + 5000),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

app.post('/api/audit/search', (req, res) => {
  try {
    const { query, filters, search_type } = req.body;
    console.log(`🔎 Searching audit logs: "${query}"`);
    
    res.json({
      success: true,
      message: `Audit log search completed`,
      query,
      search_type,
      results_count: Math.round(Math.random() * 500 + 50),
      search_time_ms: Math.round(Math.random() * 300 + 100)
    });
  } catch (error) {
    res.status(500).json({ error: 'Audit log search failed' });
  }
});

app.get('/api/audit/:logId/details', (req, res) => {
  try {
    const { logId } = req.params;
    console.log(`📋 Retrieving audit log details: ${logId}`);
    
    res.json({
      success: true,
      log_details: {
        id: logId,
        timestamp: new Date().toISOString(),
        action: 'Resource Access',
        user: 'john.doe@company.com',
        resource: 'Production Database',
        status: 'Success',
        risk_level: 'Medium',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0',
        additional_context: 'User accessed customer data export functionality'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve audit log details' });
  }
});

// Resource Optimization Additional Actions
app.post('/api/resources/schedule-optimization', (req, res) => {
  try {
    const { optimization_type, schedule_time, resources, parameters } = req.body;
    console.log(`⏰ Scheduling optimization: ${optimization_type} at ${schedule_time}`);
    
    res.json({
      success: true,
      message: `Optimization scheduled for ${new Date(schedule_time).toLocaleString()}`,
      schedule_id: `SCHED-${Date.now()}`,
      optimization_type,
      estimated_completion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      affected_resources: resources?.length || Math.round(Math.random() * 20 + 5)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule optimization' });
  }
});

app.post('/api/resources/apply-all-recommendations', (req, res) => {
  try {
    const { confirm_apply, exclude_high_risk } = req.body;
    console.log(`🚀 Applying all resource optimization recommendations`);
    
    res.json({
      success: true,
      message: 'All optimization recommendations applied successfully',
      batch_id: `BATCH-${Date.now()}`,
      applied_count: Math.round(Math.random() * 50 + 20),
      excluded_count: exclude_high_risk ? Math.round(Math.random() * 10 + 5) : 0,
      estimated_savings: `${Math.round(Math.random() * 100000 + 50000).toLocaleString()}`,
      completion_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply optimization recommendations' });
  }
});

app.get('/api/resources/recommendations/:recommendationId/details', (req, res) => {
  try {
    const { recommendationId } = req.params;
    console.log(`📊 Retrieving recommendation details: ${recommendationId}`);
    
    res.json({
      success: true,
      recommendation: {
        id: recommendationId,
        title: 'Right-size EC2 Instances',
        category: 'Compute',
        impact: 'High',
        effort: 'Low',
        potential_saving: 24000,
        current_cost: 45000,
        affected_resources: 23,
        estimated_time: '2 hours',
        implementation_steps: [
          'Analyze current instance utilization',
          'Identify undersized instances',
          'Schedule downtime for resizing',
          'Update auto-scaling policies'
        ],
        risk_assessment: 'Low risk with proper testing',
        rollback_plan: 'Automated rollback available within 1 hour'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recommendation details' });
  }
});

app.post('/api/resources/recommendations/:recommendationId/implement', (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { confirm_implementation, rollback_plan } = req.body;
    console.log(`⚡ Implementing recommendation: ${recommendationId}`);
    
    res.json({
      success: true,
      message: 'Optimization recommendation implemented successfully',
      implementation_id: `IMPL-${Date.now()}`,
      recommendation_id: recommendationId,
      status: 'In Progress',
      estimated_completion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      tracking_url: `/api/implementations/${recommendationId}/status`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to implement recommendation' });
  }
});

app.post('/api/resources/workload-configure', (req, res) => {
  try {
    const { workload_name, schedule_config, carbon_aware, cost_optimization } = req.body;
    console.log(`📅 Configuring workload scheduling: ${workload_name}`);
    
    res.json({
      success: true,
      message: `Smart scheduling configured for ${workload_name}`,
      config_id: `CONFIG-${Date.now()}`,
      workload_name,
      schedule_active: true,
      estimated_cost_savings: `${Math.round(Math.random() * 15000 + 5000).toLocaleString()}`,
      carbon_reduction: `${Math.round(Math.random() * 30 + 15)}%`,
      next_optimization: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to configure workload scheduling' });
  }
});

// Export endpoints
app.post('/api/export', (req, res) => {
  try {
    const { module, format, dateRange, includeCharts } = req.body;
    console.log(`📤 Exporting ${module} data in ${format} format`);
    
    res.json({
      success: true,
      message: `${module} data exported successfully`,
      download_url: `/api/downloads/${module}-export-${Date.now()}.${format}`,
      file_size: `${Math.round(Math.random() * 5 + 1)}.${Math.round(Math.random() * 9)}MB`,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// Bulk operations
app.post('/api/bulk-actions', (req, res) => {
  try {
    const { action, items, parameters } = req.body;
    console.log(`🔄 Executing bulk action: ${action} on ${items.length} items`);
    
    res.json({
      success: true,
      message: `Bulk ${action} completed on ${items.length} items`,
      operation_id: `BULK-${Date.now()}`,
      processed_count: items.length,
      failed_count: 0,
      estimated_completion: '2 minutes'
    });
  } catch (error) {
    res.status(500).json({ error: 'Bulk operation failed' });
  }
});

// Extended Project Collaboration API Routes
app.post('/api/projects/create-task', (req, res) => {
  try {
    const { title, project, assignee, priority, dueDate, description } = req.body;
    console.log(`📋 Creating new task: ${title}`);
    
    const taskId = `TASK-${String(Date.now()).slice(-3)}`;
    
    res.json({
      success: true,
      message: `Task "${title}" created successfully`,
      task_id: taskId,
      assignee: assignee,
      project: project,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.get('/api/projects/:projectId/details', (req, res) => {
  try {
    const { projectId } = req.params;
    console.log(`📊 Fetching project details: ${projectId}`);
    
    // Mock detailed project data
    const projectDetails = {
      id: projectId,
      name: 'Cloud Migration Initiative',
      description: 'Comprehensive migration of legacy systems to hybrid cloud infrastructure',
      status: 'In Progress',
      priority: 'High',
      progress: 78,
      budget: 250000,
      spent: 195000,
      team: [
        { name: 'Alice Johnson', role: 'Project Lead', allocation: 100 },
        { name: 'Bob Smith', role: 'Cloud Architect', allocation: 80 },
        { name: 'Carol Davis', role: 'Security Specialist', allocation: 60 }
      ],
      milestones: [
        { name: 'Infrastructure Assessment', status: 'Completed', date: '2024-02-15' },
        { name: 'Migration Planning', status: 'Completed', date: '2024-03-30' },
        { name: 'Pilot Migration', status: 'In Progress', date: '2024-07-15' },
        { name: 'Full Migration', status: 'Pending', date: '2024-08-30' }
      ],
      tasks: 23,
      completedTasks: 18,
      risks: ['Database downtime', 'Data transfer bottlenecks'],
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: projectDetails
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

app.post('/api/projects/tasks/:taskId/edit', (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, assignee, priority, dueDate, notes } = req.body;
    console.log(`✏️ Editing task: ${taskId}`);
    
    res.json({
      success: true,
      message: `Task ${taskId} updated successfully`,
      updated_fields: { status, assignee, priority, dueDate },
      updated_at: new Date().toISOString(),
      notes: notes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit task' });
  }
});

app.post('/api/team/message', (req, res) => {
  try {
    const { userId, message, channel } = req.body;
    console.log(`💬 Sending message to user: ${userId}`);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      message_id: `MSG-${Date.now()}`,
      delivered_at: new Date().toISOString(),
      channel: channel || 'direct'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Extended AI Insights API Routes
app.post('/api/ai/train-model', (req, res) => {
  try {
    const { model_name, training_data, parameters } = req.body;
    console.log(`🤖 Starting model training: ${model_name}`);
    
    res.json({
      success: true,
      message: `Model training started for ${model_name}`,
      training_id: `TRAIN-${Date.now()}`,
      estimated_completion: '2-4 hours',
      status: 'Training',
      started_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start model training' });
  }
});

app.post('/api/ai/generate-report', (req, res) => {
  try {
    const { report_type, time_period, include_predictions } = req.body;
    console.log(`📊 Generating AI insights report: ${report_type}`);
    
    res.json({
      success: true,
      message: `AI insights report generated successfully`,
      report_id: `AI-RPT-${Date.now()}`,
      report_type: report_type,
      time_period: time_period,
      insights_count: Math.floor(Math.random() * 20 + 10),
      confidence_avg: Math.round(Math.random() * 15 + 85),
      download_url: `/api/downloads/ai-report-${Date.now()}.pdf`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI report' });
  }
});

app.post('/api/ai/dismiss-insight', (req, res) => {
  try {
    const { insightId, reason } = req.body;
    console.log(`🚫 Dismissing AI insight: ${insightId}`);
    
    res.json({
      success: true,
      message: `Insight ${insightId} dismissed`,
      dismissed_at: new Date().toISOString(),
      reason: reason,
      feedback_recorded: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to dismiss insight' });
  }
});

app.post('/api/ai/implement-insight', (req, res) => {
  try {
    const { insightId, implementation_plan } = req.body;
    console.log(`⚡ Implementing AI insight: ${insightId}`);
    
    res.json({
      success: true,
      message: `Implementation started for insight ${insightId}`,
      implementation_id: `IMPL-${Date.now()}`,
      estimated_completion: '30 minutes',
      status: 'In Progress',
      started_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to implement insight' });
  }
});

app.post('/api/ai/models/:modelId/retrain', (req, res) => {
  try {
    const { modelId } = req.params;
    const { use_latest_data, training_parameters } = req.body;
    console.log(`🔄 Retraining model: ${modelId}`);
    
    res.json({
      success: true,
      message: `Model ${modelId} retraining initiated`,
      retraining_id: `RETRAIN-${Date.now()}`,
      estimated_completion: '3-6 hours',
      data_points: use_latest_data ? '2.8M' : '2.4M',
      started_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrain model' });
  }
});

app.post('/api/ai/models/:modelId/deploy', (req, res) => {
  try {
    const { modelId } = req.params;
    const { environment, rollout_strategy } = req.body;
    console.log(`🚀 Deploying model: ${modelId} to ${environment}`);
    
    res.json({
      success: true,
      message: `Model ${modelId} deployment started`,
      deployment_id: `DEPLOY-${Date.now()}`,
      environment: environment || 'production',
      rollout_strategy: rollout_strategy || 'gradual',
      estimated_completion: '15 minutes'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deploy model' });
  }
});

// Extended Identity Management API Routes
app.post('/api/identity/export-users', (req, res) => {
  try {
    const { format, filters, include_sensitive } = req.body;
    console.log(`📤 Exporting users in ${format} format`);
    
    res.json({
      success: true,
      message: `User export completed in ${format} format`,
      export_id: `USR-EXP-${Date.now()}`,
      download_url: `/api/downloads/users-export-${Date.now()}.${format}`,
      user_count: 1247,
      file_size: '2.8 MB',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export users' });
  }
});

app.post('/api/identity/add-user', (req, res) => {
  try {
    const { name, email, role, permissions, send_invite } = req.body;
    console.log(`👤 Adding new user: ${email}`);
    
    const userId = `USR-${String(Date.now()).slice(-3)}`;
    
    res.json({
      success: true,
      message: `User ${name} added successfully`,
      user_id: userId,
      email: email,
      role: role,
      permissions: permissions,
      invite_sent: send_invite,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

app.post('/api/identity/users/:userId/manage', (req, res) => {
  try {
    const { userId } = req.params;
    const { action, permissions, role, status } = req.body;
    console.log(`🔧 Managing user ${userId}: ${action}`);
    
    res.json({
      success: true,
      message: `User ${userId} ${action} completed successfully`,
      user_id: userId,
      updated_fields: { permissions, role, status },
      updated_at: new Date().toISOString(),
      action_performed: action
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to manage user' });
  }
});

app.post('/api/identity/credentials/:credentialId/verify', (req, res) => {
  try {
    const { credentialId } = req.params;
    const { verification_method } = req.body;
    console.log(`🔍 Verifying credential: ${credentialId}`);
    
    res.json({
      success: true,
      message: `Credential ${credentialId} verification completed`,
      credential_id: credentialId,
      verification_status: 'Verified',
      verification_method: verification_method,
      verified_at: new Date().toISOString(),
      valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify credential' });
  }
});

app.post('/api/identity/credentials/:credentialId/renew', (req, res) => {
  try {
    const { credentialId } = req.params;
    const { renewal_period, auto_renew } = req.body;
    console.log(`🔄 Renewing credential: ${credentialId}`);
    
    res.json({
      success: true,
      message: `Credential ${credentialId} renewed successfully`,
      credential_id: credentialId,
      renewal_period: renewal_period || '12 months',
      auto_renew: auto_renew || false,
      renewed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to renew credential' });
  }
});

// Extended Audit Trails API Routes
app.post('/api/audit/filter', (req, res) => {
  try {
    const { filters, date_range, risk_levels, users, services } = req.body;
    console.log(`🔍 Applying audit log filters`);
    
    // Simulate filtered results
    const mockFilteredResults = {
      total_events: Math.floor(Math.random() * 10000 + 5000),
      filtered_events: Math.floor(Math.random() * 1000 + 500),
      high_risk: Math.floor(Math.random() * 50 + 10),
      medium_risk: Math.floor(Math.random() * 200 + 100),
      low_risk: Math.floor(Math.random() * 750 + 400)
    };
    
    res.json({
      success: true,
      message: 'Audit log filters applied successfully',
      filter_id: `FILT-${Date.now()}`,
      results: mockFilteredResults,
      applied_filters: { date_range, risk_levels, users, services }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply filters' });
  }
});

app.post('/api/audit/export', (req, res) => {
  try {
    const { format, date_range, include_blockchain, filters } = req.body;
    console.log(`📤 Exporting audit logs in ${format} format`);
    
    res.json({
      success: true,
      message: `Audit logs exported successfully in ${format} format`,
      export_id: `AUD-EXP-${Date.now()}`,
      download_url: `/api/downloads/audit-export-${Date.now()}.${format}`,
      event_count: Math.floor(Math.random() * 50000 + 10000),
      file_size: `${Math.floor(Math.random() * 50 + 10)} MB`,
      includes_blockchain: include_blockchain,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

app.post('/api/audit/search', (req, res) => {
  try {
    const { query, filters, search_type } = req.body;
    console.log(`🔍 Searching audit logs: "${query}"`);
    
    // Mock search results
    const mockResults = [
      {
        id: 'AUD-SEARCH-001',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Alice Johnson',
        action: 'Configuration Change',
        resource: 'EC2 Instance i-1234567890abcdef0',
        relevance: 95,
        risk: 'Medium'
      },
      {
        id: 'AUD-SEARCH-002',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Bob Smith',
        action: 'Data Access',
        resource: 'S3 Bucket sensitive-data',
        relevance: 87,
        risk: 'High'
      }
    ];
    
    res.json({
      success: true,
      query: query,
      results: mockResults,
      total_found: mockResults.length,
      search_time_ms: Math.floor(Math.random() * 500 + 100),
      search_id: `SEARCH-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search audit logs' });
  }
});

app.get('/api/audit/:logId/details', (req, res) => {
  try {
    const { logId } = req.params;
    console.log(`📊 Fetching audit log details: ${logId}`);
    
    const logDetails = {
      id: logId,
      timestamp: '2024-07-22T10:30:15Z',
      user: 'Alice Johnson',
      user_id: 'USR-001',
      action: 'Resource Created',
      resource: 'EC2 Instance i-1234567890abcdef0',
      service: 'AWS EC2',
      region: 'us-east-1',
      ip_address: '192.168.1.100',
      user_agent: 'AWS CLI/2.15.30',
      status: 'Success',
      risk_level: 'Low',
      session_id: 'sess-abcd1234',
      request_id: 'req-efgh5678',
      response_code: 200,
      duration_ms: 1250,
      resource_tags: { Environment: 'Production', Team: 'DevOps' },
      additional_context: {
        instance_type: 't3.medium',
        security_groups: ['sg-abcdef1234567890'],
        subnet_id: 'subnet-1234567890abcdef0',
        key_pair: 'prod-keypair'
      },
      blockchain_hash: '0x7d4a8b9c2e1f3a5d9e8c7b6a4f2e1d9c8b7a6f5e4d3c2b1a',
      verified: true
    };
    
    res.json({
      success: true,
      data: logDetails
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit log details' });
  }
});

// Extended Resource Optimization API Routes
app.post('/api/resources/schedule-optimization', (req, res) => {
  try {
    const { optimization_type, schedule_time, resources, parameters } = req.body;
    console.log(`⏰ Scheduling optimization: ${optimization_type}`);
    
    res.json({
      success: true,
      message: `Optimization scheduled successfully for ${schedule_time}`,
      schedule_id: `SCHED-${Date.now()}`,
      optimization_type: optimization_type,
      scheduled_time: schedule_time,
      affected_resources: resources?.length || 0,
      estimated_savings: Math.floor(Math.random() * 20000 + 5000),
      status: 'Scheduled'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule optimization' });
  }
});

app.post('/api/resources/apply-all-recommendations', (req, res) => {
  try {
    const { confirm_apply, exclude_high_risk } = req.body;
    console.log(`🚀 Applying all resource optimization recommendations`);
    
    res.json({
      success: true,
      message: 'All optimization recommendations applied successfully',
      batch_id: `BATCH-${Date.now()}`,
      applied_count: 236,
      excluded_count: exclude_high_risk ? 12 : 0,
      total_savings: 89000,
      estimated_completion: '2-4 hours',
      started_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply recommendations' });
  }
});

app.get('/api/resources/recommendations/:recommendationId/details', (req, res) => {
  try {
    const { recommendationId } = req.params;
    console.log(`📊 Fetching recommendation details: ${recommendationId}`);
    
    const recommendationDetails = {
      id: recommendationId,
      title: 'Right-size EC2 Instances',
      category: 'Compute',
      description: 'Detailed analysis shows 23 EC2 instances are significantly oversized based on actual usage patterns over the last 30 days.',
      impact: 'High',
      effort: 'Low',
      potential_saving: 24000,
      current_cost: 45000,
      affected_resources: [
        { id: 'i-1234567890abcdef0', type: 't3.large', current_util: 15, recommended: 't3.medium' },
        { id: 'i-0987654321fedcba0', type: 'm5.xlarge', current_util: 22, recommended: 'm5.large' }
      ],
      implementation_steps: [
        'Analyze current instance utilization patterns',
        'Create AMI snapshots of existing instances',
        'Launch new right-sized instances',
        'Migrate traffic using load balancer',
        'Terminate oversized instances'
      ],
      risk_assessment: 'Low - Can be rolled back if issues occur',
      estimated_downtime: '< 5 minutes per instance',
      roi_timeline: '30 days',
      dependencies: ['Load balancer configuration', 'Auto-scaling group updates']
    };
    
    res.json({
      success: true,
      data: recommendationDetails
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendation details' });
  }
});

app.post('/api/resources/recommendations/:recommendationId/implement', (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { confirm_implementation, rollback_plan } = req.body;
    console.log(`⚡ Implementing recommendation: ${recommendationId}`);
    
    res.json({
      success: true,
      message: `Recommendation ${recommendationId} implementation started`,
      implementation_id: `IMPL-${Date.now()}`,
      estimated_completion: '2 hours',
      rollback_available: true,
      monitoring_enabled: true,
      started_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to implement recommendation' });
  }
});

app.post('/api/resources/workload-configure', (req, res) => {
  try {
    const { workload_name, schedule_config, carbon_aware, cost_optimization } = req.body;
    console.log(`⚙️ Configuring workload scheduling: ${workload_name}`);
    
    res.json({
      success: true,
      message: `Workload scheduling configured for ${workload_name}`,
      config_id: `CFG-${Date.now()}`,
      workload: workload_name,
      schedule: schedule_config,
      carbon_optimization: carbon_aware,
      cost_optimization: cost_optimization,
      estimated_savings: Math.floor(Math.random() * 15000 + 5000),
      carbon_reduction: Math.floor(Math.random() * 40 + 20),
      effective_date: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to configure workload scheduling' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Initialize storage and start server
initializeStorage();

app.listen(PORT, () => {
  console.log('\n🚀 OrganizeIT API Server Started Successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log('');
  console.log('📊 Available Endpoints:');
  console.log(`   • Admin Dashboard: http://localhost:${PORT}/api/admin-dashboard`);
  console.log(`   • IT Operations:   http://localhost:${PORT}/api/operations`);
  console.log(`   • FinOps:         http://localhost:${PORT}/api/finops`);
  console.log(`   • ESG Monitoring: http://localhost:${PORT}/api/esg`);
  console.log(`   • Projects:       http://localhost:${PORT}/api/projects`);
  console.log(`   • Notifications:  http://localhost:${PORT}/api/notifications`);
  console.log(`   • Health Check:   http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('✅ Backend is ready! Now start the frontend with:');
  console.log('   npm run dev');
  console.log('');
  console.log('🌐 Full Application: http://localhost:3000');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

export default app;