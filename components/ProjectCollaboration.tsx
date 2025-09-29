import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Users, 
  FolderOpen, 
  Calendar, 
  MessageSquare,
  GitBranch,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Star,
  Activity
} from 'lucide-react'
import { projectsAPI } from '../utils/api'
import { useState } from 'react'

const projects = [
  {
    id: 'PROJ-001',
    name: 'Cloud Migration Initiative',
    status: 'In Progress',
    priority: 'High',
    progress: 78,
    team: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
    deadline: '2024-08-15',
    description: 'Migrate legacy systems to hybrid cloud infrastructure'
  },
  {
    id: 'PROJ-002',
    name: 'AI-Powered Monitoring System',
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    team: ['David Wilson', 'Eva Brown', 'Frank Miller'],
    deadline: '2024-09-30',
    description: 'Implement ML-based predictive monitoring'
  },
  {
    id: 'PROJ-003',
    name: 'Cost Optimization Platform',
    status: 'Planning',
    priority: 'Medium',
    progress: 15,
    team: ['Grace Lee', 'Henry Taylor'],
    deadline: '2024-10-20',
    description: 'Develop automated cost optimization tools'
  },
  {
    id: 'PROJ-004',
    name: 'Security Compliance Audit',
    status: 'Completed',
    priority: 'High',
    progress: 100,
    team: ['Ivan Chen', 'Julia Roberts', 'Kevin Park'],
    deadline: '2024-06-30',
    description: 'Complete SOC 2 Type II compliance audit'
  }
]

const tasks = [
  {
    id: 'TASK-001',
    title: 'Database migration planning',
    project: 'Cloud Migration Initiative',
    assignee: 'Alice Johnson',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-07-25'
  },
  {
    id: 'TASK-002',
    title: 'ML model training pipeline',
    project: 'AI-Powered Monitoring System',
    assignee: 'David Wilson',
    status: 'Blocked',
    priority: 'High',
    dueDate: '2024-07-28'
  },
  {
    id: 'TASK-003',
    title: 'Cost analytics dashboard design',
    project: 'Cost Optimization Platform',
    assignee: 'Grace Lee',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '2024-08-05'
  },
  {
    id: 'TASK-004',
    title: 'Network security assessment',
    project: 'Cloud Migration Initiative',
    assignee: 'Bob Smith',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-07-30'
  }
]

const teamMembers = [
  { name: 'Alice Johnson', role: 'Senior DevOps Engineer', projects: 3, avatar: 'AJ' },
  { name: 'Bob Smith', role: 'Cloud Architect', projects: 2, avatar: 'BS' },
  { name: 'Carol Davis', role: 'Security Specialist', projects: 2, avatar: 'CD' },
  { name: 'David Wilson', role: 'ML Engineer', projects: 1, avatar: 'DW' },
  { name: 'Eva Brown', role: 'Data Scientist', projects: 1, avatar: 'EB' },
  { name: 'Frank Miller', role: 'Backend Developer', projects: 1, avatar: 'FM' },
]

const recentActivity = [
  {
    id: 1,
    user: 'Alice Johnson',
    action: 'completed task',
    target: 'Database schema migration',
    time: '2 hours ago',
    project: 'Cloud Migration Initiative'
  },
  {
    id: 2,
    user: 'David Wilson',
    action: 'created pull request',
    target: 'Feature/monitoring-alerts',
    time: '4 hours ago',
    project: 'AI-Powered Monitoring System'
  },
  {
    id: 3,
    user: 'Bob Smith',
    action: 'updated milestone',
    target: 'Phase 2 Infrastructure',
    time: '6 hours ago',
    project: 'Cloud Migration Initiative'
  },
  {
    id: 4,
    user: 'Grace Lee',
    action: 'added comment',
    target: 'Cost optimization strategy',
    time: '8 hours ago',
    project: 'Cost Optimization Platform'
  }
]

export function ProjectCollaboration() {
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600'
      case 'In Progress': return 'text-blue-600'
      case 'Planning': return 'text-yellow-600'
      case 'Blocked': return 'text-red-600'
      case 'Todo': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const handleNewTask = async () => {
    setLoading(true)
    try {
      await projectsAPI.createTask({
        title: 'New Task',
        project: 'Cloud Migration Initiative',
        assignee: 'Alice Johnson',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'New task created from project collaboration dashboard'
      })
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewProject = async () => {
    setLoading(true)
    try {
      await projectsAPI.createProject({
        name: 'New IT Project',
        description: 'New project created from collaboration dashboard',
        priority: 'Medium',
        budget: 100000,
        team_size: 5,
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewProjectDetails = async (projectId: string) => {
    try {
      await projectsAPI.getProjectDetails(projectId)
    } catch (error) {
      console.error('Failed to fetch project details:', error)
    }
  }

  const handleEditTask = async (taskId: string) => {
    try {
      await projectsAPI.editTask(taskId, {
        status: 'In Progress',
        notes: 'Task updated from collaboration dashboard'
      })
    } catch (error) {
      console.error('Failed to edit task:', error)
    }
  }

  const handleSendMessage = async (memberName: string) => {
    try {
      await projectsAPI.sendTeamMessage(
        `user-${memberName.toLowerCase().replace(' ', '-')}`,
        `Hello ${memberName}, message sent from OrganizeIT project collaboration.`,
        'direct'
      )
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive'
      case 'Medium': return 'secondary'
      case 'Low': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'secondary'
      case 'In Progress': return 'default'
      case 'Planning': return 'outline'
      case 'Blocked': return 'destructive'
      case 'Todo': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Project Collaboration</h1>
          <p className="text-muted-foreground">Coordinate cross-functional IT projects and teams</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNewTask} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <Button onClick={handleNewProject} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">24</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">147</div>
            <p className="text-xs text-muted-foreground">Across 12 departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tasks This Sprint</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">89%</div>
            <p className="text-xs text-muted-foreground">64 of 72 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Cycle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">4.2 days</div>
            <p className="text-xs text-muted-foreground">-0.8 days improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{project.name}</h3>
                        <Badge variant={getStatusVariant(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge variant={getPriorityVariant(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{project.id}</span>
                        <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold">{project.progress}%</div>
                      <Progress value={project.progress} className="w-32 mt-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Team:</span>
                      <div className="flex -space-x-2">
                        {project.team.map((member, index) => (
                          <Avatar key={index} className="w-8 h-8 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              {member.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleViewProjectDetails(project.id)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge variant={getStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge variant={getPriorityVariant(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{task.id}</span>
                        <span>Project: {task.project}</span>
                        <span>Assignee: {task.assignee}</span>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleEditTask(task.id)}>
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.projects} active projects</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleSendMessage(member.name)}>
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                        {' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.project}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    <Activity className="w-4 h-4 text-muted-foreground" />
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