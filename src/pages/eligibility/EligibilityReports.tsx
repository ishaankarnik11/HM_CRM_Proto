import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Shield,
  Wallet,
  Clock,
  Play,
  Settings,
  RefreshCw,
  Eye,
  Share,
  Bookmark,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  FileImage,
  Mail,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useTableSort, SortableHeader } from "@/hooks/useTableSort";
import { format } from "date-fns";
import { eligibilityAPI } from "@/services/eligibilityAPI";
import { useError, useAsyncOperation } from "@/contexts/ErrorContext";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'eligibility' | 'financial' | 'operational' | 'analytics';
  format: ('pdf' | 'excel' | 'csv')[];
  parameters: string[];
  estimatedTime: string;
  frequency: 'on-demand' | 'daily' | 'weekly' | 'monthly';
  icon: any;
  lastGenerated?: string;
  popularity: number;
}

interface GeneratedReport {
  id: string;
  templateName: string;
  generatedAt: string;
  status: 'completed' | 'generating' | 'failed';
  format: string;
  size: string;
  downloadUrl?: string;
  parameters: Record<string, any>;
}

const EligibilityReports = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedCorporate, setSelectedCorporate] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const [shareEmails, setShareEmails] = useState<string>("");
  const [shareMessage, setShareMessage] = useState<string>("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState<string>("weekly");
  const [scheduleTime, setScheduleTime] = useState<string>("09:00");
  const [scheduleEmails, setScheduleEmails] = useState<string>("");
  const [scheduledReports, setScheduledReports] = useState<any[]>([]);
  
  const { showSuccess, showError } = useError();
  const { execute: executeAsync } = useAsyncOperation();


  const reportTemplates: ReportTemplate[] = [
    {
      id: 'eligibility-status',
      name: 'Eligibility Status Report',
      description: 'Comprehensive employee eligibility status across all corporates',
      category: 'eligibility',
      format: ['pdf', 'excel', 'csv'],
      parameters: ['corporate', 'dateRange', 'status', 'benefitGroup'],
      estimatedTime: '2-3 minutes',
      frequency: 'on-demand',
      icon: Shield,
      lastGenerated: '2024-01-15 14:30',
      popularity: 95
    },
    {
      id: 'opd-wallet-utilization',
      name: 'OPD Wallet Utilization',
      description: 'Detailed analysis of OPD wallet usage and balance distribution',
      category: 'financial',
      format: ['pdf', 'excel'],
      parameters: ['corporate', 'dateRange', 'department'],
      estimatedTime: '3-4 minutes',
      frequency: 'monthly',
      icon: Wallet,
      lastGenerated: '2024-01-14 09:15',
      popularity: 87
    },
    {
      id: 'employee-benefits-summary',
      name: 'Employee Benefits Summary',
      description: 'Summary of benefits assigned to employees by benefit group',
      category: 'operational',
      format: ['pdf', 'excel', 'csv'],
      parameters: ['corporate', 'benefitGroup', 'dateRange'],
      estimatedTime: '1-2 minutes',
      frequency: 'weekly',
      icon: Users,
      lastGenerated: '2024-01-13 16:45',
      popularity: 78
    },
    {
      id: 'corporate-analytics',
      name: 'Corporate Analytics Dashboard',
      description: 'Corporate-wise analytics including trends and insights',
      category: 'analytics',
      format: ['pdf'],
      parameters: ['corporate', 'dateRange', 'metrics'],
      estimatedTime: '4-5 minutes',
      frequency: 'monthly',
      icon: BarChart3,
      lastGenerated: '2024-01-12 11:20',
      popularity: 92
    },
    {
      id: 'audit-trail',
      name: 'Audit Trail Report',
      description: 'Complete audit trail of all eligibility changes and rule executions',
      category: 'operational',
      format: ['excel', 'csv'],
      parameters: ['dateRange', 'corporate', 'actionType'],
      estimatedTime: '2-3 minutes',
      frequency: 'daily',
      icon: Clock,
      lastGenerated: '2024-01-15 08:00',
      popularity: 65
    },
    {
      id: 'rule-performance',
      name: 'Rule Performance Analysis',
      description: 'Analysis of eligibility rule performance and effectiveness',
      category: 'analytics',
      format: ['pdf', 'excel'],
      parameters: ['dateRange', 'ruleId', 'corporate'],
      estimatedTime: '3-4 minutes',
      frequency: 'weekly',
      icon: TrendingUp,
      lastGenerated: '2024-01-11 13:30',
      popularity: 71
    },
    {
      id: 'benefit-group-distribution',
      name: 'Benefit Group Distribution',
      description: 'Distribution of employees across different benefit groups',
      category: 'eligibility',
      format: ['pdf', 'excel', 'csv'],
      parameters: ['corporate', 'dateRange'],
      estimatedTime: '1-2 minutes',
      frequency: 'on-demand',
      icon: PieChart,
      lastGenerated: '2024-01-10 15:20',
      popularity: 83
    },
    {
      id: 'financial-impact',
      name: 'Financial Impact Analysis',
      description: 'Financial impact analysis of eligibility changes and benefit allocations',
      category: 'financial',
      format: ['pdf', 'excel'],
      parameters: ['dateRange', 'corporate', 'benefitGroup'],
      estimatedTime: '4-5 minutes',
      frequency: 'monthly',
      icon: TrendingUp,
      lastGenerated: '2024-01-09 10:45',
      popularity: 88
    }
  ];

  const mockGeneratedReports: GeneratedReport[] = [
    {
      id: 'report-001',
      templateName: 'Eligibility Status Report',
      generatedAt: '2024-01-15 14:30',
      status: 'completed',
      format: 'PDF',
      size: '2.4 MB',
      downloadUrl: '/reports/eligibility-status-20240115.pdf',
      parameters: { corporate: 'Tech Innovations Corp', dateRange: 'Last 30 days' }
    },
    {
      id: 'report-002', 
      templateName: 'OPD Wallet Utilization',
      generatedAt: '2024-01-15 13:15',
      status: 'generating',
      format: 'Excel',
      size: '-',
      parameters: { corporate: 'All Corporates', dateRange: 'Current Month' }
    },
    {
      id: 'report-003',
      templateName: 'Corporate Analytics Dashboard',
      generatedAt: '2024-01-15 12:00',
      status: 'completed',
      format: 'PDF',
      size: '5.7 MB',
      downloadUrl: '/reports/corporate-analytics-20240115.pdf',
      parameters: { corporate: 'Healthcare Solutions Ltd', dateRange: 'Last Quarter' }
    },
    {
      id: 'report-004',
      templateName: 'Employee Benefits Summary',
      generatedAt: '2024-01-15 09:45',
      status: 'failed',
      format: 'CSV',
      size: '-',
      parameters: { corporate: 'Financial Services Inc', dateRange: 'Last Week' }
    }
  ];

  // Mock scheduled reports data
  const mockScheduledReports = [
    {
      id: '1',
      templateName: 'Corporate Analytics Dashboard',
      frequency: 'monthly',
      time: '09:00',
      nextRun: '2024-02-01T09:00:00Z',
      recipients: 'admin@company.com, manager@company.com',
      status: 'active' as const
    },
    {
      id: '2',
      templateName: 'Eligibility Status Report',
      frequency: 'weekly',
      time: '08:30',
      nextRun: '2024-01-22T08:30:00Z',
      recipients: 'hr@company.com',
      status: 'active' as const
    }
  ];

  // Table sorting for generated reports
  const reportsSort = useTableSort([...generatedReports, ...mockGeneratedReports]);
  
  // Table sorting for scheduled reports  
  const scheduledSort = useTableSort([...scheduledReports, ...mockScheduledReports]);

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    // Load scheduled reports on component mount
    const loadScheduledReports = async () => {
      try {
        const reports = await eligibilityAPI.reports.getScheduledReports();
        setScheduledReports(reports);
      } catch (error) {
        console.error('Failed to load scheduled reports:', error);
      }
    };
    loadScheduledReports();
  }, []);

  const handleGenerateReport = async (template: ReportTemplate, format: string) => {
    setIsGenerating(true);
    
    try {
      const result = await eligibilityAPI.reports.generateReport(template.id, {
        corporate: selectedCorporate === 'all' ? undefined : selectedCorporate,
        dateFrom: dateFrom?.toISOString(),
        dateTo: dateTo?.toISOString(),
        format: format as 'pdf' | 'excel' | 'csv'
      });
      
      const newReport: GeneratedReport = {
        id: result.reportId,
        templateName: template.name,
        generatedAt: result.generatedAt,
        status: 'completed',
        format: format.toUpperCase(),
        size: result.fileSize,
        downloadUrl: result.downloadUrl,
        parameters: {
          corporate: selectedCorporate === 'all' ? 'All Corporates' : selectedCorporate,
          dateRange: dateFrom && dateTo ? `${format(dateFrom, 'dd/MM/yyyy')} - ${format(dateTo, 'dd/MM/yyyy')}` : 'Last 30 days'
        }
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      setShowReportBuilder(false);
    } catch (error) {
      console.error('Report generation failed:', error);
      const failedReport: GeneratedReport = {
        id: `report-failed-${Date.now()}`,
        templateName: template.name,
        generatedAt: new Date().toISOString(),
        status: 'failed',
        format: format.toUpperCase(),
        size: '-',
        parameters: {
          corporate: selectedCorporate === 'all' ? 'All Corporates' : selectedCorporate,
          dateRange: dateFrom && dateTo ? `${format(dateFrom, 'dd/MM/yyyy')} - ${format(dateTo, 'dd/MM/yyyy')}` : 'Last 30 days'
        }
      };
      setGeneratedReports(prev => [failedReport, ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (report: GeneratedReport) => {
    try {
      await eligibilityAPI.reports.downloadReport(report.id);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleShareReport = async () => {
    if (!selectedReport) return;
    
    try {
      const emails = shareEmails.split(',').map(email => email.trim()).filter(email => email);
      await eligibilityAPI.reports.shareReport(selectedReport.id, emails, shareMessage);
      setShowShareModal(false);
      setShareEmails("");
      setShareMessage("");
      alert(`Report shared with ${emails.length} recipients successfully!`);
    } catch (error) {
      console.error('Share failed:', error);
      alert('Failed to share report. Please try again.');
    }
  };

  const handleScheduleReport = async (template: ReportTemplate) => {
    try {
      const emails = scheduleEmails.split(',').map(email => email.trim()).filter(email => email);
      const result = await eligibilityAPI.reports.scheduleReport(template.id, {
        frequency: scheduleFrequency as 'daily' | 'weekly' | 'monthly',
        time: scheduleTime,
        emails,
        parameters: {
          corporate: selectedCorporate === 'all' ? undefined : selectedCorporate,
          dateFrom: dateFrom?.toISOString(),
          dateTo: dateTo?.toISOString()
        }
      });
      
      setScheduledReports(prev => [...prev, {
        id: result.scheduleId,
        templateName: template.name,
        frequency: scheduleFrequency,
        time: scheduleTime,
        nextRun: result.nextRun,
        isActive: true,
        emails,
        status: 'scheduled'
      }]);
      
      setShowScheduleModal(false);
      setScheduleEmails("");
      alert('Report scheduled successfully!');
    } catch (error) {
      console.error('Schedule failed:', error);
      alert('Failed to schedule report. Please try again.');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'eligibility': return Shield;
      case 'financial': return Wallet;
      case 'operational': return Users;
      case 'analytics': return BarChart3;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'eligibility': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'operational': return 'bg-orange-100 text-orange-800';
      case 'analytics': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate comprehensive reports and analyze eligibility data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Manage Templates
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="eligibility">Eligibility</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              const CategoryIcon = getCategoryIcon(template.category);
              
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="secondary" className={`mt-1 ${getCategoryColor(template.category)}`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {template.popularity}% ★
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Time:</span>
                        <span className="font-medium">{template.estimatedTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Frequency:</span>
                        <Badge variant="outline" className="text-xs">{template.frequency}</Badge>
                      </div>
                      {template.lastGenerated && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last Generated:</span>
                          <span className="text-xs">{template.lastGenerated}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Available Formats:</Label>
                      <div className="flex gap-2">
                        {template.format.map(format => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1" onClick={() => setSelectedTemplate(template)}>
                            <Play className="h-4 w-4 mr-2" />
                            Generate
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              Generate {template.name}
                            </DialogTitle>
                            <DialogDescription>
                              Configure parameters and generate your report
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Report Parameters */}
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Corporate</Label>
                                <Select value={selectedCorporate} onValueChange={setSelectedCorporate}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select corporate" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All Corporates</SelectItem>
                                    <SelectItem value="tech-innovations">Tech Innovations Corp</SelectItem>
                                    <SelectItem value="healthcare-solutions">Healthcare Solutions Ltd</SelectItem>
                                    <SelectItem value="financial-services">Financial Services Inc</SelectItem>
                                    <SelectItem value="manufacturing-co">Manufacturing Co</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>From Date</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={dateFrom}
                                        onSelect={setDateFrom}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                <div className="space-y-2">
                                  <Label>To Date</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={dateTo}
                                        onSelect={setDateTo}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>

                              {template.parameters.includes('benefitGroup') && (
                                <div className="space-y-2">
                                  <Label>Benefit Group</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select benefit group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Groups</SelectItem>
                                      <SelectItem value="executive">Executive</SelectItem>
                                      <SelectItem value="senior">Senior Management</SelectItem>
                                      <SelectItem value="manager">Manager</SelectItem>
                                      <SelectItem value="employee">Employee</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Output Format</Label>
                              <div className="flex flex-col sm:flex-row gap-2">
                                {template.format.map(format => (
                                  <Button
                                    key={format}
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleGenerateReport(template, format)}
                                    disabled={isGenerating}
                                  >
                                    {format === 'pdf' && <FileImage className="h-4 w-4 mr-2" />}
                                    {format === 'excel' && <FileSpreadsheet className="h-4 w-4 mr-2" />}
                                    {format === 'csv' && <FileText className="h-4 w-4 mr-2" />}
                                    {isGenerating ? 'Generating...' : format.toUpperCase()}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Reports
              </CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader
                        column="templateName"
                        onSort={reportsSort.handleSort}
                        getSortIcon={reportsSort.getSortIcon}
                      >
                        Report Name
                      </SortableHeader>
                      <SortableHeader
                        column="generatedAt"
                        onSort={reportsSort.handleSort}
                        getSortIcon={reportsSort.getSortIcon}
                      >
                        Generated
                      </SortableHeader>
                      <SortableHeader
                        column="status"
                        onSort={reportsSort.handleSort}
                        getSortIcon={reportsSort.getSortIcon}
                      >
                        Status
                      </SortableHeader>
                      <SortableHeader
                        column="format"
                        onSort={reportsSort.handleSort}
                        getSortIcon={reportsSort.getSortIcon}
                      >
                        Format
                      </SortableHeader>
                      <SortableHeader
                        column="size"
                        onSort={reportsSort.handleSort}
                        getSortIcon={reportsSort.getSortIcon}
                      >
                        Size
                      </SortableHeader>
                      <TableHead>Parameters</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportsSort.sortedData.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.templateName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(report.generatedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              report.status === 'completed' ? 'default' :
                              report.status === 'generating' ? 'secondary' : 'destructive'
                            }
                          >
                            {report.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {report.status === 'generating' && <Clock className="h-3 w-3 mr-1" />}
                            {report.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.format}</Badge>
                        </TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {Object.entries(report.parameters).map(([key, value]) => (
                            <div key={key}>{key}: {value}</div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {report.status === 'completed' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDownloadReport(report)}
                                  title="Download Report"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setShowShareModal(true);
                                  }}
                                  title="Share Report"
                                >
                                  <Share className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setShowShareModal(true);
                                  }}
                                  title="Email Report"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {report.status === 'generating' && (
                              <Badge variant="secondary" className="animate-pulse">
                                Generating...
                              </Badge>
                            )}
                            {report.status === 'failed' && (
                              <Button variant="outline" size="sm">
                                Retry
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Scheduled Reports
                  </CardTitle>
                  <CardDescription>
                    Manage automated report generation schedules
                  </CardDescription>
                </div>
                <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule Report</DialogTitle>
                      <DialogDescription>
                        Set up automated report generation
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Report Template</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportTemplates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email Recipients</Label>
                        <Input
                          placeholder="email1@company.com, email2@company.com"
                          value={scheduleEmails}
                          onChange={(e) => setScheduleEmails(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleScheduleReport(reportTemplates[0])}>
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {[...scheduledReports, ...mockScheduledReports].length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Scheduled Reports</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set up automated report generation to receive reports regularly
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHeader
                          column="templateName"
                          onSort={scheduledSort.handleSort}
                          getSortIcon={scheduledSort.getSortIcon}
                        >
                          Report Name
                        </SortableHeader>
                        <SortableHeader
                          column="frequency"
                          onSort={scheduledSort.handleSort}
                          getSortIcon={scheduledSort.getSortIcon}
                        >
                          Frequency
                        </SortableHeader>
                        <SortableHeader
                          column="time"
                          onSort={scheduledSort.handleSort}
                          getSortIcon={scheduledSort.getSortIcon}
                        >
                          Time
                        </SortableHeader>
                        <SortableHeader
                          column="nextRun"
                          onSort={scheduledSort.handleSort}
                          getSortIcon={scheduledSort.getSortIcon}
                        >
                          Next Run
                        </SortableHeader>
                        <SortableHeader
                          column="recipients"
                          onSort={scheduledSort.handleSort}
                          getSortIcon={scheduledSort.getSortIcon}
                        >
                          Recipients
                        </SortableHeader>
                        <SortableHeader
                          column="status"
                          onSort={scheduledSort.handleSort}
                          getSortIcon={scheduledSort.getSortIcon}
                        >
                          Status
                        </SortableHeader>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledSort.sortedData.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{schedule.templateName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {schedule.frequency}
                            </Badge>
                          </TableCell>
                          <TableCell>{schedule.time}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(schedule.nextRun).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {schedule.emails.join(', ')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={schedule.isActive ? "default" : "secondary"}>
                              {schedule.isActive ? "Active" : "Paused"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" title="Edit Schedule">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Pause/Resume">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Delete Schedule">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Report Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              Send "{selectedReport?.templateName}" to recipients via email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Recipients</Label>
              <Textarea
                placeholder="email1@company.com, email2@company.com"
                value={shareEmails}
                onChange={(e) => setShareEmails(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple email addresses with commas
              </p>
            </div>
            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <Textarea
                placeholder="Additional message to include with the report..."
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowShareModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleShareReport} disabled={!shareEmails.trim()}>
                <Mail className="h-4 w-4 mr-2" />
                Send Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EligibilityReports;