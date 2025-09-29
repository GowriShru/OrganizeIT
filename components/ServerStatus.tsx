import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'

export function ServerStatus() {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [showAlert, setShowAlert] = useState(false)

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setServerStatus('online')
        setShowAlert(false)
      } else {
        setServerStatus('offline')
        setShowAlert(true)
      }
    } catch (error) {
      setServerStatus('offline')
      setShowAlert(true)
    }
  }

  useEffect(() => {
    checkServerStatus()
    
    // Check server status every 30 seconds
    const interval = setInterval(checkServerStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!showAlert) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>API Server Offline</strong>
              <p className="text-sm mt-1">
                Some features may not work. Start with: <code className="text-xs bg-muted px-1 rounded">npm run server</code>
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={checkServerStatus}
                disabled={serverStatus === 'checking'}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${serverStatus === 'checking' ? 'animate-spin' : ''}`} />
                Retry
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowAlert(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}