import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Separator } from './ui/separator'
import { Progress } from './ui/progress'
import { 
  Download, 
  FileText, 
  Table, 
  Image, 
  File,
  Calendar,
  Filter,
  Settings,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react'

interface ExportManagerProps {
  isOpen: boolean
  onClose: () => void
  activeModule: string
}

interface ExportOption {
  id: string
  name: string
  description: string
  module: string
  type: 'report' | 'data' | 'chart' | 'dashboard'
  formats: string[]
  size: string
  lastGenerated?: Date
}

export function ExportManager({ isOpen, onClose, activeModule }: ExportManagerProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState('pdf')
  const [dateRange, setDateRange] = useState('last30days')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeData, setIncludeData] = useState(true)
  const [compressionLevel, setCompressionLevel] = useState('medium')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<'idle' | 'preparing' | 'exporting' | 'complete' | 'error'>('idle')

  const exportOptions: ExportOption[] = [
    {
      id: '1',
      name: 'System Health Dashboard',
      description: 'Complete overview of system metrics and performance indicators',
      module: 'Dashboard',
      type: 'dashboard',
      formats: ['pdf', 'png', 'html'],
      size: '2.3 MB',
      lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Cost Optimization Report',
      description: 'Detailed analysis of cost savings opportunities and recommendations',
      module: 'FinOps',
      type: 'report',
      formats: ['pdf', 'xlsx', 'csv'],
      size: '1.8 MB',
      lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Infrastructure Metrics',
      description: 'Raw performance data and monitoring metrics',
      module: 'IT Operations',
      type: 'data',
      formats: ['csv', 'json', 'xlsx'],
      size: '4.2 MB'
    },
    {
      id: '4',
      name: 'ESG Sustainability Report',
      description: 'Environmental impact analysis and compliance tracking',
      module: 'ESG Monitoring',
      type: 'report',
      formats: ['pdf', 'docx'],
      size: '3.1 MB',
      lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '5',
      name: 'Security Audit Trail',
      description: 'Blockchain-verified audit logs and security events',
      module: 'Audit Trails',
      type: 'data',
      formats: ['json', 'csv', 'xml'],
      size: '5.7 MB'
    },
    {
      id: '6',
      name: 'AI Insights Charts',
      description: 'Machine learning predictions and trend analysis visualizations',
      module: 'AI Insights',
      type: 'chart',
      formats: ['png', 'svg', 'pdf'],
      size: '1.2 MB'
    },
    {
      id: '7',
      name: 'Resource Utilization Data',
      description: 'Detailed resource usage statistics and optimization metrics',
      module: 'Resource Optimization',
      type: 'data',
      formats: ['csv', 'xlsx', 'json'],
      size: '6.8 MB'
    },
    {
      id: '8',
      name: 'Project Collaboration Summary',
      description: 'Team activities, milestones, and project status reports',
      module: 'Project Collaboration',
      type: 'report',
      formats: ['pdf', 'docx', 'html'],
      size: '2.9 MB'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="w-4 h-4 text-blue-500" />
      case 'data':
        return <Table className="w-4 h-4 text-green-500" />
      case 'chart':
        return <Image className="w-4 h-4 text-purple-500" />
      case 'dashboard':
        return <Settings className="w-4 h-4 text-orange-500" />
      default:
        return <File className="w-4 h-4 text-gray-500" />
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return '📄'
      case 'xlsx':
      case 'csv':
        return '📊'
      case 'png':
      case 'svg':
        return '🖼️'
      case 'json':
      case 'xml':
        return '🔧'
      case 'html':
      case 'docx':
        return '📝'
      default:
        return '📁'
    }
  }

  const filteredOptions = exportOptions.filter(option => 
    activeModule === 'all' || option.module.toLowerCase().includes(activeModule.toLowerCase())
  )

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    setSelectedItems(filteredOptions.map(option => option.id))
  }

  const handleClearAll = () => {
    setSelectedItems([])
  }

  const simulateExport = async () => {
    setIsExporting(true)
    setExportStatus('preparing')
    setExportProgress(0)

    // Simulate preparation phase
    for (let i = 0; i <= 30; i += 5) {
      setExportProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setExportStatus('exporting')

    // Simulate export progress
    for (let i = 30; i <= 95; i += 5) {
      setExportProgress(i)
      await new Promise(resolve => setTimeout(resolve, 150))
    }

    setExportProgress(100)
    setExportStatus('complete')

    // Reset after 3 seconds
    setTimeout(() => {
      setIsExporting(false)
      setExportStatus('idle')
      setExportProgress(0)
      // In a real app, you might trigger a download here
    }, 3000)
  }

  const handleExport = () => {
    if (selectedItems.length === 0) return
    simulateExport()
  }

  const getSelectedSize = () => {
    const selected = filteredOptions.filter(option => selectedItems.includes(option.id))
    const totalSize = selected.reduce((acc, option) => {
      const size = parseFloat(option.size.replace(' MB', ''))
      return acc + size
    }, 0)
    return `${totalSize.toFixed(1)} MB`
  }

  const getStatusMessage = () => {
    switch (exportStatus) {
      case 'preparing':
        return 'Preparing export package...'
      case 'exporting':
        return 'Generating files...'
      case 'complete':
        return 'Export completed successfully!'
      case 'error':
        return 'Export failed. Please try again.'
      default:
        return `${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected (${getSelectedSize()})`
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Manager
            </CardTitle>
            <CardDescription>
              Export reports, data, and visualizations from OrganizeIT modules
            </CardDescription>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </CardHeader>

        <CardContent className="flex h-[600px]">
          {/* Left Panel - Export Options */}
          <div className="flex-1 pr-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Available Exports</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                    selectedItems.includes(option.id) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                  onClick={() => handleItemToggle(option.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedItems.includes(option.id)}
                      onChange={() => handleItemToggle(option.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(option.type)}
                        <h4 className="font-medium text-sm">{option.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {option.module}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {option.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>Formats:</span>
                          {option.formats.map((format, index) => (
                            <span key={index} className="flex items-center gap-1">
                              {getFormatIcon(format)}
                              {format.toUpperCase()}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{option.size}</span>
                          {option.lastGenerated && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {option.lastGenerated.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="mx-6" />

          {/* Right Panel - Export Settings */}
          <div className="w-80">
            <h3 className="font-medium mb-4">Export Settings</h3>
            
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <Label className="text-sm font-medium">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                    <SelectItem value="zip">ZIP Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <Label className="text-sm font-medium">Date Range</Label>
                <RadioGroup value={dateRange} onValueChange={setDateRange} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last7days" id="last7days" />
                    <Label htmlFor="last7days" className="text-sm">Last 7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last30days" id="last30days" />
                    <Label htmlFor="last30days" className="text-sm">Last 30 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last90days" id="last90days" />
                    <Label htmlFor="last90days" className="text-sm">Last 90 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="text-sm">Custom range</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Content Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Include Content</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="charts" 
                      checked={includeCharts}
                      onCheckedChange={setIncludeCharts}
                    />
                    <Label htmlFor="charts" className="text-sm">Charts and visualizations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="data" 
                      checked={includeData}
                      onCheckedChange={setIncludeData}
                    />
                    <Label htmlFor="data" className="text-sm">Raw data tables</Label>
                  </div>
                </div>
              </div>

              {/* Compression */}
              <div>
                <Label className="text-sm font-medium">Compression Level</Label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Fastest)</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High (Smallest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Export Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Export Status</span>
                  {exportStatus === 'complete' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {exportStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {getStatusMessage()}
                </p>

                {isExporting && (
                  <div className="space-y-2">
                    <Progress value={exportProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {exportProgress}% complete
                    </p>
                  </div>
                )}
              </div>

              {/* Export Button */}
              <Button 
                onClick={handleExport}
                disabled={selectedItems.length === 0 || isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected ({selectedItems.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}