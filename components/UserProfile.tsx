import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Download,
  Key,
  Activity,
  Mail,
  Phone,
  Building,
  MapPin,
  Save,
  Camera
} from 'lucide-react'

interface UserProfileProps {
  user: any
  onClose: () => void
  onUpdateUser: (userData: any) => void
}

export function UserProfile({ user, onClose, onUpdateUser }: UserProfileProps) {
  const [profile, setProfile] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@organizeit.com',
    phone: '+1 (555) 123-4567',
    department: user?.department || 'IT Operations',
    role: user?.role || 'System Administrator',
    location: 'San Francisco, CA',
    company: 'TechCorp Inc.',
    bio: 'Experienced IT professional specializing in cloud infrastructure and DevOps practices.',
    avatar: null
  })

  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      alerts: true,
      reports: false
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 30,
      defaultView: 'overview'
    },
    privacy: {
      profileVisible: true,
      activityTracking: true,
      dataCollection: false
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedUser = {
        ...user,
        ...profile,
        preferences
      }
      
      onUpdateUser(updatedUser)
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceChange = (category: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const recentActivity = [
    { action: 'Logged in', time: '2 hours ago', type: 'login' },
    { action: 'Viewed Cost Optimization Report', time: '3 hours ago', type: 'view' },
    { action: 'Updated ESG Goals', time: '1 day ago', type: 'update' },
    { action: 'Exported Financial Data', time: '2 days ago', type: 'export' },
    { action: 'Created New Project', time: '3 days ago', type: 'create' }
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl">User Profile & Settings</CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar || undefined} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.role}</p>
                  <Badge variant="secondary" className="mt-1">
                    {profile.department}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        className="pl-10"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={profile.role} onValueChange={(value) => setProfile(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="System Administrator">System Administrator</SelectItem>
                        <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                        <SelectItem value="IT Manager">IT Manager</SelectItem>
                        <SelectItem value="Cloud Architect">Cloud Architect</SelectItem>
                        <SelectItem value="Security Analyst">Security Analyst</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="department"
                        className="pl-10"
                        value={profile.department}
                        onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        className="pl-10"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full p-3 border rounded-md resize-none h-24"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-6">
              <div className="space-y-6">
                {/* Theme Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Theme</Label>
                        <Select 
                          value={preferences.theme} 
                          onValueChange={(value) => handlePreferenceChange('theme', '', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Email Notifications</Label>
                        <Switch
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) => handlePreferenceChange('notifications', 'email', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Push Notifications</Label>
                        <Switch
                          checked={preferences.notifications.push}
                          onCheckedChange={(checked) => handlePreferenceChange('notifications', 'push', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>System Alerts</Label>
                        <Switch
                          checked={preferences.notifications.alerts}
                          onCheckedChange={(checked) => handlePreferenceChange('notifications', 'alerts', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Weekly Reports</Label>
                        <Switch
                          checked={preferences.notifications.reports}
                          onCheckedChange={(checked) => handlePreferenceChange('notifications', 'reports', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Auto Refresh</Label>
                        <Switch
                          checked={preferences.dashboard.autoRefresh}
                          onCheckedChange={(checked) => handlePreferenceChange('dashboard', 'autoRefresh', checked)}
                        />
                      </div>
                      <div>
                        <Label>Refresh Interval (seconds)</Label>
                        <Select 
                          value={preferences.dashboard.refreshInterval.toString()} 
                          onValueChange={(value) => handlePreferenceChange('dashboard', 'refreshInterval', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 seconds</SelectItem>
                            <SelectItem value="30">30 seconds</SelectItem>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Password & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download Recovery Codes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Profile Visibility</Label>
                      <Switch
                        checked={preferences.privacy.profileVisible}
                        onCheckedChange={(checked) => handlePreferenceChange('privacy', 'profileVisible', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Activity Tracking</Label>
                      <Switch
                        checked={preferences.privacy.activityTracking}
                        onCheckedChange={(checked) => handlePreferenceChange('privacy', 'activityTracking', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Data Collection</Label>
                      <Switch
                        checked={preferences.privacy.dataCollection}
                        onCheckedChange={(checked) => handlePreferenceChange('privacy', 'dataCollection', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent actions and system interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'login' ? 'bg-green-500' :
                            activity.type === 'view' ? 'bg-blue-500' :
                            activity.type === 'update' ? 'bg-orange-500' :
                            activity.type === 'export' ? 'bg-purple-500' :
                            'bg-gray-500'
                          }`} />
                          <span>{activity.action}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}