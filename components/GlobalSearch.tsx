import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp,
  Database,
  DollarSign,
  Leaf,
  Shield,
  Users,
  Settings,
  FileText,
  BarChart,
  Server,
  Command
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'dashboard' | 'metric' | 'alert' | 'report' | 'user' | 'setting' | 'project'
  module: string
  relevance: number
  path?: string
  lastAccessed?: Date
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (section: string) => void
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'cost optimization',
    'system alerts',
    'carbon footprint',
    'database performance'
  ])
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock search data
  const searchData: SearchResult[] = [
    {
      id: '1',
      title: 'Dashboard Overview',
      description: 'Main dashboard with system health metrics and KPIs',
      type: 'dashboard',
      module: 'Dashboard',
      relevance: 0.9,
      path: '/dashboard'
    },
    {
      id: '2',
      title: 'Cost Optimization Report',
      description: 'Monthly cost analysis and optimization recommendations',
      type: 'report',
      module: 'FinOps',
      relevance: 0.85,
      path: '/finops',
      lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'System Health Metrics',
      description: 'Real-time monitoring of infrastructure performance',
      type: 'metric',
      module: 'IT Operations',
      relevance: 0.8,
      path: '/it-operations'
    },
    {
      id: '4',
      title: 'Carbon Footprint Tracking',
      description: 'Environmental impact monitoring and ESG compliance',
      type: 'metric',
      module: 'ESG Monitoring',
      relevance: 0.75,
      path: '/esg'
    },
    {
      id: '5',
      title: 'Database Connection Alert',
      description: 'Critical alert: Payment API connection timeout',
      type: 'alert',
      module: 'IT Operations',
      relevance: 0.9,
      path: '/it-operations'
    },
    {
      id: '6',
      title: 'Security Audit Trail',
      description: 'Blockchain-based audit log for compliance tracking',
      type: 'report',
      module: 'Audit Trails',
      relevance: 0.7,
      path: '/audit'
    },
    {
      id: '7',
      title: 'AI Insights Dashboard',
      description: 'Machine learning predictions and recommendations',
      type: 'dashboard',
      module: 'AI Insights',
      relevance: 0.8,
      path: '/ai-insights'
    },
    {
      id: '8',
      title: 'Resource Optimization',
      description: 'Automated resource scaling and efficiency improvements',
      type: 'setting',
      module: 'Resource Optimization',
      relevance: 0.75,
      path: '/optimization'
    },
    {
      id: '9',
      title: 'Project Collaboration Hub',
      description: 'Team collaboration and project management tools',
      type: 'project',
      module: 'Project Collaboration',
      relevance: 0.65,
      path: '/collaboration'
    },
    {
      id: '10',
      title: 'Identity Management',
      description: 'Decentralized identity and access control',
      type: 'user',
      module: 'Identity Management',
      relevance: 0.6,
      path: '/identity'
    }
  ]

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'dashboard':
        return <BarChart className="w-4 h-4 text-blue-500" />
      case 'metric':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'alert':
        return <Shield className="w-4 h-4 text-red-500" />
      case 'report':
        return <FileText className="w-4 h-4 text-purple-500" />
      case 'user':
        return <Users className="w-4 h-4 text-orange-500" />
      case 'setting':
        return <Settings className="w-4 h-4 text-gray-500" />
      case 'project':
        return <Database className="w-4 h-4 text-indigo-500" />
      default:
        return <Search className="w-4 h-4 text-gray-500" />
    }
  }

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Filter and rank results based on query
    const filteredResults = searchData
      .filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.module.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8)

    setResults(filteredResults)
    setIsLoading(false)
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    performSearch(searchQuery)
  }

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    if (!recentSearches.includes(query) && query.trim()) {
      setRecentSearches(prev => [query, ...prev.slice(0, 3)])
    }

    // Navigate to the module
    const moduleMap: { [key: string]: string } = {
      'Dashboard': 'dashboard',
      'FinOps': 'finops',
      'IT Operations': 'it-operations',
      'ESG Monitoring': 'esg',
      'AI Insights': 'ai-insights',
      'Resource Optimization': 'optimization',
      'Project Collaboration': 'collaboration',
      'Identity Management': 'identity',
      'Audit Trails': 'audit'
    }

    const section = moduleMap[result.module] || 'dashboard'
    onNavigate(section)
    onClose()
  }

  const handleRecentSearchClick = (recentQuery: string) => {
    handleSearch(recentQuery)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-[10vh]">
      <Card className="w-full max-w-2xl mx-4 overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search across all modules, metrics, alerts, and more..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 text-base"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Keyboard shortcut hint */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Command className="w-3 h-3" />
              <span>Tip: Use Cmd+K to search from anywhere</span>
            </div>
            <span>Press ESC to close</span>
          </div>
        </div>

        <CardContent className="p-0">
          <ScrollArea className="max-h-96">
            {!query && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                  {recentSearches.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs h-auto p-1"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {recentSearches.length > 0 ? (
                  <div className="space-y-2">
                    {recentSearches.map((recentQuery, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(recentQuery)}
                        className="flex items-center gap-3 w-full p-2 text-left rounded-md hover:bg-muted transition-colors"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{recentQuery}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent searches</p>
                )}

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Access</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSearch('alerts')}
                      className="flex items-center gap-2 p-2 text-left rounded-md hover:bg-muted transition-colors"
                    >
                      <Shield className="w-4 h-4 text-red-500" />
                      <span className="text-sm">System Alerts</span>
                    </button>
                    <button
                      onClick={() => handleSearch('cost')}
                      className="flex items-center gap-2 p-2 text-left rounded-md hover:bg-muted transition-colors"
                    >
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Cost Reports</span>
                    </button>
                    <button
                      onClick={() => handleSearch('performance')}
                      className="flex items-center gap-2 p-2 text-left rounded-md hover:bg-muted transition-colors"
                    >
                      <Server className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Performance</span>
                    </button>
                    <button
                      onClick={() => handleSearch('carbon')}
                      className="flex items-center gap-2 p-2 text-left rounded-md hover:bg-muted transition-colors"
                    >
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-sm">ESG Metrics</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {query && (
              <div className="p-4">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!isLoading && results.length === 0 && query && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No results found for "{query}"</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try searching for dashboards, metrics, alerts, or reports
                    </p>
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                    </p>
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="flex items-start gap-3 w-full p-3 text-left rounded-md hover:bg-muted transition-colors group"
                      >
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium group-hover:text-primary">
                              {result.title}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {result.module}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {result.description}
                          </p>
                          {result.lastAccessed && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Last accessed: {result.lastAccessed.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}