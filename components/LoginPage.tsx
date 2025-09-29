import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  Brain, 
  Shield, 
  Zap, 
  Cloud, 
  Eye, 
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
  UserPlus,
  ArrowLeft
} from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface LoginPageProps {
  onLogin: (userData?: any) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Machine learning recommendations for optimal performance'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with blockchain audit trails'
    },
    {
      icon: Zap,
      title: 'Resource Optimization',
      description: 'Automated cost reduction and efficiency improvements'
    },
    {
      icon: Cloud,
      title: 'Hybrid Cloud Ready',
      description: 'Seamless management across AWS, Azure, and GCP'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      if (isSignup) {
        console.log('Attempting signup with:', email)
        
        // Validate signup fields
        if (!name || !role || !department) {
          throw new Error('Please fill in all required fields')
        }
        
        // Call backend signup endpoint
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-efc8e70a/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password,
            name,
            role,
            department
          })
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Signup failed')
        }

        console.log('Signup successful:', data.message)
        
        // Auto-login after successful signup
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name,
          role,
          department
        }
        
        // Store user session if remember me is checked
        if (rememberMe) {
          localStorage.setItem('organizeit_session', JSON.stringify({
            user: userData,
            timestamp: Date.now()
          }))
        }

        onLogin(userData)
      } else {
        console.log('Attempting login with:', email)
        
        // For demo purposes, simulate backend authentication
        if (email === 'demo@organizeit.com' && password === 'demo123') {
          // Simulate successful demo login
          setTimeout(() => {
            const demoUser = {
              id: 'demo-user-id',
              email: 'demo@organizeit.com',
              name: 'Demo User',
              role: 'System Administrator',
              department: 'IT Operations'
            }
            
            console.log('Demo login successful')
            
            // Store user session if remember me is checked
            if (rememberMe) {
              localStorage.setItem('organizeit_session', JSON.stringify({
                user: demoUser,
                timestamp: Date.now()
              }))
            }

            onLogin(demoUser)
            setIsLoading(false)
          }, 1500)
          return
        }
        
        // Admin demo login
        if (email === 'admin@organizeit.com' && password === 'admin123') {
          setTimeout(() => {
            const adminUser = {
              id: 'admin-user-id',
              email: 'admin@organizeit.com',
              name: 'Admin User',
              role: 'Admin',
              department: 'Administration'
            }
            
            console.log('Admin login successful')
            
            if (rememberMe) {
              localStorage.setItem('organizeit_session', JSON.stringify({
                user: adminUser,
                timestamp: Date.now()
              }))
            }

            onLogin(adminUser)
            setIsLoading(false)
          }, 1500)
          return
        }
        
        // Call backend signin endpoint
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-efc8e70a/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password
          })
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        console.log('Login successful:', data.message)
        
        // Store user session if remember me is checked
        if (rememberMe && data.user) {
          localStorage.setItem('organizeit_session', JSON.stringify({
            user: data.user,
            timestamp: Date.now()
          }))
        }

        onLogin(data.user)
      }
    } catch (error) {
      console.error(`${isSignup ? 'Signup' : 'Login'} error:`, error)
      setError(error instanceof Error ? error.message : `${isSignup ? 'Signup' : 'Login'} failed. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate backend authentication for demo
  const simulateBackendAuth = async (email: string, password: string) => {
    return new Promise<{success: boolean, user?: any, error?: string, message?: string}>((resolve) => {
      setTimeout(() => {
        // Accept any email/password for demo purposes
        if (email && password) {
          resolve({
            success: true,
            user: {
              id: 'user-' + Date.now(),
              email,
              name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              role: 'User',
              department: 'IT'
            },
            message: 'Login successful'
          })
        } else {
          resolve({
            success: false,
            error: 'Please enter valid credentials'
          })
        }
      }, 1000)
    })
  }

  // Auto-fill demo credentials
  const fillDemoCredentials = () => {
    setEmail('demo@organizeit.com')
    setPassword('demo123')
  }

  // Auto-fill admin credentials
  const fillAdminCredentials = () => {
    setEmail('admin@organizeit.com')
    setPassword('admin123')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground p-12 flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary-foreground rounded-xl flex items-center justify-center">
              <span className="text-primary font-bold text-xl">O</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">OrganizeIT</h1>
              <p className="text-primary-foreground/80 text-sm">AI-Driven IT Platform</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">Unified AI-Driven Platform</h2>
              <p className="text-primary-foreground/90 text-lg leading-relaxed">
                Intelligent IT operations, FinOps, ESG monitoring, and decentralized identity 
                management for hybrid cloud environments.
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-primary-foreground/80 text-sm">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="flex gap-8">
          <div>
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-primary-foreground/80 text-sm">Uptime SLA</div>
          </div>
          <div>
            <div className="text-2xl font-bold">31%</div>
            <div className="text-primary-foreground/80 text-sm">Cost Reduction</div>
          </div>
          <div>
            <div className="text-2xl font-bold">27%</div>
            <div className="text-primary-foreground/80 text-sm">Carbon Savings</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">O</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">OrganizeIT</h1>
              <p className="text-muted-foreground text-xs">AI-Driven IT Platform</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {isSignup && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSignup(false)
                      setError('')
                      setName('')
                      setRole('')
                      setDepartment('')
                    }}
                    className="absolute left-4 top-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {isSignup ? (
                  <UserPlus className="w-6 h-6 text-primary" />
                ) : (
                  <Shield className="w-6 h-6 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription>
                {isSignup 
                  ? 'Join OrganizeIT to start managing your hybrid cloud infrastructure'
                  : 'Sign in to your OrganizeIT dashboard to manage your hybrid cloud infrastructure'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Alice Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="alice.johnson@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
                      minLength={isSignup ? 6 : undefined}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {isSignup && (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>

                {isSignup && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={role} onValueChange={setRole} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="System Administrator">System Administrator</SelectItem>
                          <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                          <SelectItem value="IT Manager">IT Manager</SelectItem>
                          <SelectItem value="Cloud Architect">Cloud Architect</SelectItem>
                          <SelectItem value="Security Engineer">Security Engineer</SelectItem>
                          <SelectItem value="Data Engineer">Data Engineer</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={department} onValueChange={setDepartment} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="IT Operations">IT Operations</SelectItem>
                          <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  disabled={isLoading || !email || !password || (isSignup && (!name || !role || !department))}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {isSignup ? 'Creating account...' : 'Signing in...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isSignup ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Create Account
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  {isSignup ? 'Already have an account?' : 'New to OrganizeIT?'}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-11"
                  onClick={() => {
                    setIsSignup(!isSignup)
                    setError('')
                    setName('')
                    setRole('')
                    setDepartment('')
                  }}
                >
                  {isSignup ? 'Sign In Instead' : 'Create Account'}
                </Button>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-xs text-muted-foreground text-center mb-3">
                  Trusted by enterprise customers
                </div>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    SOC 2 Compliant
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    ISO 27001
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          {!isSignup && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Demo Credentials:</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div><strong>User:</strong> demo@organizeit.com / demo123</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fillDemoCredentials}
                    className="text-xs h-6 px-2"
                  >
                    Use
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div><strong>Admin:</strong> admin@organizeit.com / admin123</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fillAdminCredentials}
                    className="text-xs h-6 px-2"
                  >
                    Use
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}