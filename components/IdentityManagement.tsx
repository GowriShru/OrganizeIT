import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Shield, 
  Users, 
  Key, 
  Fingerprint,
  Lock,
  Unlock,
  UserCheck,
  AlertTriangle,
  Clock,
  Globe,
  Smartphone,
  Computer
} from 'lucide-react'
import { identityAPI } from '../utils/api'
import { useState } from 'react'

const users = [
  {
    id: 'USR-001',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    role: 'Senior DevOps Engineer',
    status: 'Active',
    lastLogin: '2024-07-22T10:30:00Z',
    mfaEnabled: true,
    permissions: ['Admin', 'Deploy', 'Monitor'],
    devices: 3
  },
  {
    id: 'USR-002',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    role: 'Cloud Architect',
    status: 'Active',
    lastLogin: '2024-07-22T09:15:00Z',
    mfaEnabled: true,
    permissions: ['Deploy', 'Monitor', 'Configure'],
    devices: 2
  },
  {
    id: 'USR-003',
    name: 'Carol Davis',
    email: 'carol.davis@company.com',
    role: 'Security Specialist',
    status: 'Inactive',
    lastLogin: '2024-07-20T16:45:00Z',
    mfaEnabled: false,
    permissions: ['Security', 'Audit', 'Monitor'],
    devices: 1
  }
]

const didCredentials = [
  {
    id: 'DID-001',
    holder: 'Alice Johnson',
    credentialType: 'Professional Certification',
    issuer: 'AWS',
    issuedDate: '2024-01-15',
    expiryDate: '2026-01-15',
    status: 'Valid',
    verificationStatus: 'Verified'
  },
  {
    id: 'DID-002',
    holder: 'Bob Smith',
    credentialType: 'Security Clearance',
    issuer: 'Internal Security',
    issuedDate: '2024-03-20',
    expiryDate: '2025-03-20',
    status: 'Valid',
    verificationStatus: 'Verified'
  },
  {
    id: 'DID-003',
    holder: 'Carol Davis',
    credentialType: 'Compliance Training',
    issuer: 'ComplianceOrg',
    issuedDate: '2024-02-10',
    expiryDate: '2024-08-10',
    status: 'Expiring Soon',
    verificationStatus: 'Verified'
  }
]

const accessLogs = [
  {
    id: 'LOG-001',
    user: 'Alice Johnson',
    action: 'Login',
    resource: 'Production Environment',
    timestamp: '2024-07-22T10:30:15Z',
    ip: '192.168.1.100',
    device: 'MacBook Pro',
    status: 'Success'
  },
  {
    id: 'LOG-002',
    user: 'Bob Smith',
    action: 'Deploy',
    resource: 'Staging Environment',
    timestamp: '2024-07-22T09:15:22Z',
    ip: '192.168.1.101',
    device: 'Windows Laptop',
    status: 'Success'
  },
  {
    id: 'LOG-003',
    user: 'Unknown',
    action: 'Failed Login',
    resource: 'Admin Panel',
    timestamp: '2024-07-22T08:45:33Z',
    ip: '203.0.113.45',
    device: 'Unknown',
    status: 'Blocked'
  }
]

const securityMetrics = [
  { metric: 'MFA Adoption', value: 87, target: 100, unit: '%' },
  { metric: 'Password Strength', value: 92, target: 95, unit: '%' },
  { metric: 'Session Security', value: 96, target: 98, unit: '%' },
  { metric: 'Device Trust', value: 89, target: 90, unit: '%' },
]

export function IdentityManagement() {
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600'
      case 'Inactive': return 'text-red-600'
      case 'Suspended': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const handleExportUsers = async () => {
    setLoading(true)
    try {
      await identityAPI.exportUsers('csv', { active_only: false }, false)
    } catch (error) {
      console.error('Failed to export users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    setLoading(true)
    try {
      await identityAPI.addUser({
        name: 'New User',
        email: 'newuser@organizeit.com',
        role: 'User',
        permissions: ['Monitor'],
        send_invite: true
      })
    } catch (error) {
      console.error('Failed to add user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageUser = async (userId: string, userName: string) => {
    try {
      await identityAPI.manageUser(userId, 'update_permissions', {
        permissions: ['Admin', 'Deploy', 'Monitor'],
        status: 'Active'
      })
    } catch (error) {
      console.error('Failed to manage user:', error)
    }
  }

  const handleVerifyCredential = async (credentialId: string) => {
    try {
      await identityAPI.verifyCredential(credentialId, 'blockchain')
    } catch (error) {
      console.error('Failed to verify credential:', error)
    }
  }

  const handleRenewCredential = async (credentialId: string) => {
    try {
      await identityAPI.renewCredential(credentialId, '12 months', true)
    } catch (error) {
      console.error('Failed to renew credential:', error)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': case 'Valid': case 'Success': case 'Verified': return 'secondary'
      case 'Inactive': case 'Blocked': case 'Invalid': return 'destructive'
      case 'Suspended': case 'Expiring Soon': case 'Pending': return 'secondary'
      default: return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Identity Management</h1>
          <p className="text-muted-foreground">Decentralized identity and access control</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportUsers} disabled={loading}>
            Export Users
          </Button>
          <Button onClick={handleAddUser} disabled={loading}>
            Add User
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">1,247</div>
            <p className="text-xs text-muted-foreground">+23 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Sessions</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">342</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">DID Credentials</CardTitle>
            <Fingerprint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">456</div>
            <p className="text-xs text-muted-foreground">12 expiring soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">91%</div>
            <p className="text-xs text-muted-foreground">Above industry average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="credentials">DID Credentials</TabsTrigger>
          <TabsTrigger value="access">Access Logs</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge variant={getStatusVariant(user.status)}>
                            {user.status}
                          </Badge>
                          {user.mfaEnabled && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              MFA
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{user.email}</span>
                          <span>{user.role}</span>
                          <span>Last login: {formatDateTime(user.lastLogin)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Permissions:</span>
                          <div className="flex gap-1">
                            {user.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{user.devices} devices</div>
                        <div>{user.id}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleManageUser(user.id, user.name)}>
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <div className="space-y-4">
            {didCredentials.map((credential) => (
              <Card key={credential.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{credential.credentialType}</h4>
                        <Badge variant={getStatusVariant(credential.status)}>
                          {credential.status}
                        </Badge>
                        <Badge variant={getStatusVariant(credential.verificationStatus)}>
                          {credential.verificationStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <div className="font-medium text-foreground">Holder</div>
                          <div>{credential.holder}</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Issuer</div>
                          <div>{credential.issuer}</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Issued</div>
                          <div>{formatDate(credential.issuedDate)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Expires</div>
                          <div>{formatDate(credential.expiryDate)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Verify</Button>
                      <Button size="sm" variant="outline">Renew</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Access Logs</CardTitle>
              <CardDescription>User activity and access attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{log.user}</span>
                        <Badge variant={getStatusVariant(log.status)}>
                          {log.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{log.action}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{log.resource}</span>
                        <span>IP: {log.ip}</span>
                        <span>Device: {log.device}</span>
                        <span>{formatDateTime(log.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {log.status === 'Success' ? (
                        <UserCheck className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
                <CardDescription>Identity and access security indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {securityMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <span className="text-sm text-muted-foreground">
                        {metric.value}{metric.unit} / {metric.target}{metric.unit}
                      </span>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>AI-driven security improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Enable MFA for All Users</span>
                  </div>
                  <p className="text-sm text-muted-foreground">13% of users don't have MFA enabled. Enforce MFA for enhanced security.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium">Password Policy Update</span>
                  </div>
                  <p className="text-sm text-muted-foreground">8% of passwords don't meet current strength requirements.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="font-medium">Session Timeout Review</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Consider reducing session timeout for privileged accounts.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}