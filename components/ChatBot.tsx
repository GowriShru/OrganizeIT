import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Zap,
  Brain,
  AlertTriangle,
  DollarSign,
  Server,
  Leaf,
  Shield,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatBotProps {
  activeSection: string
}

export function ChatBot({ activeSection }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your OrganizeIT AI Assistant. I can help you with IT operations, cost optimization, ESG monitoring, and platform navigation. What would you like to know?',
      timestamp: new Date(),
      suggestions: [
        'Show me cost optimization opportunities',
        'What are the current system alerts?',
        'Help me understand ESG metrics',
        'How to improve resource efficiency?'
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const contextualResponses = {
    dashboard: {
      greeting: "I see you're on the main dashboard. I can help you understand the metrics, alerts, or guide you to specific sections.",
      suggestions: [
        'Explain the system health metrics',
        'What do the current alerts mean?',
        'Show me cost trends',
        'Navigate to specific section'
      ]
    },
    'it-operations': {
      greeting: "Great! You're in IT Operations. I can help with monitoring, incident management, and performance optimization.",
      suggestions: [
        'How to reduce MTTD/MTTR?',
        'Explain current incidents',
        'Optimize system performance',
        'Set up monitoring alerts'
      ]
    },
    finops: {
      greeting: "Welcome to FinOps! I can assist with cost analysis, budget optimization, and savings opportunities.",
      suggestions: [
        'Find cost optimization opportunities',
        'Analyze spending trends',
        'Set up budget alerts',
        'Compare cloud provider costs'
      ]
    },
    esg: {
      greeting: "You're viewing ESG monitoring. I can help with sustainability metrics, carbon tracking, and compliance.",
      suggestions: [
        'Reduce carbon footprint',
        'Track ESG goals progress',
        'Improve energy efficiency',
        'Generate sustainability report'
      ]
    },
    'ai-insights': {
      greeting: "Perfect! I can explain AI recommendations, model performance, and automation opportunities.",
      suggestions: [
        'Explain current AI recommendations',
        'Improve model accuracy',
        'Set up automation rules',
        'Review prediction trends'
      ]
    }
  }

  const quickActions = [
    { icon: Zap, label: 'Quick Optimization', action: 'optimize' },
    { icon: AlertTriangle, label: 'Check Alerts', action: 'alerts' },
    { icon: DollarSign, label: 'Cost Analysis', action: 'costs' },
    { icon: Leaf, label: 'ESG Report', action: 'esg' }
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Try to connect to real backend API first
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-efc8e70a/chat/message`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: content.trim(),
            context: activeSection,
            userId: 'current-user'
          })
        })

        if (response.ok) {
          const data = await response.json()
          const botResponse: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content: data.response,
            timestamp: new Date(),
            suggestions: data.suggestions
          }
          setMessages(prev => [...prev, botResponse])
        } else {
          throw new Error('Backend response not ok')
        }
      } catch (backendError) {
        console.log('Backend not available, using local AI:', backendError)
        // Fallback to local response generation
        const botResponse = generateBotResponse(content.trim(), activeSection)
        setMessages(prev => [...prev, botResponse])
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      // Final fallback
      const botResponse = generateBotResponse(content.trim(), activeSection)
      setMessages(prev => [...prev, botResponse])
    } finally {
      setIsLoading(false)
    }
  }



  const generateBotResponse = (input: string, section: string): Message => {
    const lowerInput = input.toLowerCase()
    
    // Context-aware responses
    if (lowerInput.includes('cost') || lowerInput.includes('save') || lowerInput.includes('optimize')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '💰 **Cost Optimization Insights:**\n\nBased on current analysis, I\'ve identified several opportunities:\n\n• **Right-size EC2 instances**: Save $24,000/month by optimizing 23 oversized instances\n• **Storage optimization**: Move infrequent data to IA storage for $12,000/month savings\n• **Reserved instances**: Purchase RIs for consistent workloads to save $35,000/month\n\nWould you like me to prioritize these recommendations or show implementation steps?',
        timestamp: new Date(),
        suggestions: ['Show implementation steps', 'Prioritize by ROI', 'Schedule optimization', 'View detailed analysis']
      }
    }

    if (lowerInput.includes('alert') || lowerInput.includes('incident') || lowerInput.includes('problem')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '🚨 **Current System Alerts:**\n\n**High Priority:**\n• Database connection timeout in Payment API (2 hours ago)\n• Disk space alert on Redis cache (6 hours ago)\n\n**Medium Priority:**\n• Load balancer health check failed (resolved 4 hours ago)\n\nI recommend addressing the database timeout first as it affects payment processing. Would you like me to guide you through the troubleshooting steps?',
        timestamp: new Date(),
        suggestions: ['Troubleshoot database issue', 'Check Redis storage', 'View incident timeline', 'Escalate to team']
      }
    }

    if (lowerInput.includes('esg') || lowerInput.includes('carbon') || lowerInput.includes('sustainability')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '🌱 **ESG & Sustainability Insights:**\n\n**Current Status:**\n• Carbon footprint: 40.7 tCO₂ (-27% YTD)\n• Renewable energy: 68% (target: 85%)\n• Water efficiency: 83% (+12% improvement)\n\n**Key Recommendations:**\n• Shift batch processing to low-carbon hours (save 2.4 tCO₂/month)\n• Increase renewable energy adoption\n• Optimize cooling systems for better water efficiency\n\nShall I help you create an action plan for these improvements?',
        timestamp: new Date(),
        suggestions: ['Create ESG action plan', 'Schedule carbon optimization', 'View renewable energy options', 'Generate compliance report']
      }
    }

    if (lowerInput.includes('performance') || lowerInput.includes('monitor') || lowerInput.includes('system')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '📊 **System Performance Overview:**\n\n**Current Metrics:**\n• System uptime: 99.87%\n• Average CPU utilization: 72%\n• Memory usage: 68%\n• MTTD: 8.2 minutes (-15% improvement)\n• MTTR: 24.5 minutes (-8% improvement)\n\n**Recommendations:**\n• Enable predictive scaling for peak hours\n• Optimize memory allocation for better efficiency\n• Set up proactive monitoring for critical services\n\nWould you like me to help configure these optimizations?',
        timestamp: new Date(),
        suggestions: ['Configure predictive scaling', 'Optimize memory allocation', 'Set up proactive monitoring', 'View performance trends']
      }
    }

    if (lowerInput.includes('ai') || lowerInput.includes('predict') || lowerInput.includes('recommendation')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '🤖 **AI Insights & Recommendations:**\n\n**Active Predictions:**\n• 23% CPU demand increase predicted for next Tuesday\n• Cost anomaly detected in Azure Blob Storage (+340%)\n• Security risk: increased failed auth attempts\n\n**Model Performance:**\n• Resource prediction accuracy: 94.2%\n• Anomaly detection: 96.1%\n• Cost forecasting: 89.5%\n\nI can help you implement these recommendations or explain the AI models in detail. What interests you most?',
        timestamp: new Date(),
        suggestions: ['Implement scaling recommendation', 'Investigate cost anomaly', 'Review security threats', 'Explain AI models']
      }
    }

    // Default contextual response
    const context = contextualResponses[section as keyof typeof contextualResponses] || contextualResponses.dashboard
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: `I understand you're asking about "${input}". ${context.greeting}\n\nI can help you with various tasks related to your current section. Here are some things I can assist with:`,
      timestamp: new Date(),
      suggestions: context.suggestions
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      optimize: 'Show me current optimization opportunities',
      alerts: 'What are the current system alerts?',
      costs: 'Analyze my cloud spending trends',
      esg: 'Generate ESG sustainability report'
    }
    
    handleSendMessage(actionMessages[action as keyof typeof actionMessages] || 'Help me with this task')
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed ${isMinimized ? 'bottom-6 right-6 w-80 h-16' : 'bottom-6 right-6 w-96 h-[600px]'} shadow-xl z-50 transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <CardTitle className="text-sm">OrganizeIT Assistant</CardTitle>
          <Badge variant="secondary" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Online
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
          {/* Quick Actions */}
          <div className="p-4 border-b border-border">
            <div className="text-xs font-medium mb-2 text-muted-foreground">Quick Actions</div>
            <div className="flex gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Icon className="w-3 h-3" />
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-[85%] ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    {message.suggestions && message.type === 'bot' && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs mr-1 mb-1"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-200"></div>
                        </div>
                        Analyzing...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(input)
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your IT operations..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={!input.trim() || isLoading}
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      )}
    </Card>
  )
}