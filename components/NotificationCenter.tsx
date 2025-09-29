import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  TrendingUp,
  DollarSign,
  Shield,
  Leaf,
  Settings,
  Clock,
  Filter,
  Check
} from 'lucide-react'

interface Notification {
  id: string
  type: 'alert' | 'info' | 'success' | 'warning' | 'cost' | 'security' | 'esg'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  module: string
  actionRequired?: boolean
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Database Connection Timeout',
      message: 'Payment API experiencing connection timeouts. Immediate attention required.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'critical',
      module: 'IT Operations',
      actionRequired: true
    },
    {
      id: '2',
      type: 'cost',
      title: 'Cost Optimization Opportunity',
      message: 'Identified $24,000/month savings by right-sizing EC2 instances.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
      priority: 'high',
      module: 'FinOps'
    },
    {
      id: '3',
      type: 'security',
      title: 'Failed Authentication Attempts',
      message: 'Detected 15 failed login attempts from unknown IP addresses.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      priority: 'high',
      module: 'Security'
    },
    {
      id: '4',
      type: 'esg',
      title: 'Carbon Footprint Reduction',
      message: 'Monthly carbon emissions reduced by 12% through smart scheduling.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      module: 'ESG Monitoring'
    },
    {
      id: '5',
      type: 'success',
      title: 'Deployment Successful',
      message: 'Production deployment completed successfully with zero downtime.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true,
      priority: 'low',
      module: 'DevOps'
    },
    {
      id: '6',
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Planned maintenance window scheduled for Sunday 2:00 AM - 4:00 AM EST.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      module: 'IT Operations'
    },
    {
      id: '7',
      type: 'warning',
      title: 'Storage Capacity Warning',
      message: 'Redis cache approaching 85% capacity. Consider scaling up.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      priority: 'medium',
      module: 'Infrastructure'
    }
  ])

  const [activeTab, setActiveTab] = useState('all')
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'actionRequired'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />
      case 'cost':
        return <DollarSign className="w-4 h-4 text-purple-500" />
      case 'security':
        return <Shield className="w-4 h-4 text-red-600" />
      case 'esg':
        return <Leaf className="w-4 h-4 text-green-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = diff / (1000 * 60 * 60)
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes} minutes ago`
    } else if (hours < 24) {
      return `${Math.floor(hours)} hours ago`
    } else {
      const days = Math.floor(hours / 24)
      return `${days} days ago`
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab !== 'all' && notification.type !== activeTab) return false
    
    switch (filter) {
      case 'unread':
        return !notification.read
      case 'high':
        return notification.priority === 'high' || notification.priority === 'critical'
      case 'actionRequired':
        return notification.actionRequired
      default:
        return true
    }
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new notification occasionally
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'info',
          title: 'System Update',
          message: 'New metrics data available in dashboard.',
          timestamp: new Date(),
          read: false,
          priority: 'low',
          module: 'System'
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Center
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Stay updated with system alerts, updates, and insights
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col h-[600px]">
            {/* Filters */}
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                  >
                    Unread ({unreadCount})
                  </Button>
                  <Button
                    variant={filter === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('high')}
                  >
                    High Priority
                  </Button>
                  <Button
                    variant={filter === 'actionRequired' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('actionRequired')}
                  >
                    Action Required
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
                <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  All Notifications
                </TabsTrigger>
                <TabsTrigger value="alert" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="cost" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Cost
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Security
                </TabsTrigger>
                <TabsTrigger value="esg" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  ESG
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="flex-1 m-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-3">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications match your current filter.</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                            !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm">{notification.title}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getPriorityColor(notification.priority)}`}
                                  >
                                    {notification.priority}
                                  </Badge>
                                  {notification.actionRequired && (
                                    <Badge variant="destructive" className="text-xs">
                                      Action Required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTimestamp(notification.timestamp)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Settings className="w-3 h-3" />
                                    {notification.module}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs"
                                >
                                  Mark read
                                </Button>
                              )}
                              {notification.actionRequired && (
                                <Button size="sm" className="text-xs">
                                  Take Action
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => clearNotification(notification.id)}
                                className="text-xs text-muted-foreground hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}