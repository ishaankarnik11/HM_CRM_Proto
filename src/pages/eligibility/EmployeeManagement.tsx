import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Mail, 
  Phone,
  Building,
  MapPin,
  Calendar,
  Wallet,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Upload,
  Send,
  History,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  X
} from "lucide-react";
import { Employee, ActivityLog, OpdTransaction } from "@/services/eligibilityMockData";
import { eligibilityAPI } from "@/services/eligibilityAPI";

interface SortConfig {
  key: keyof Employee | null;
  direction: 'asc' | 'desc' | null;
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [pageSize, setPageSize] = useState('20');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCorporate, setSelectedCorporate] = useState("all");
  
  // Status Filters (multi-select)
  const [ahcBenefitStatus, setAhcBenefitStatus] = useState<string[]>([]);
  const [benefitSource, setBenefitSource] = useState<string[]>([]);
  const [passcodeStatus, setPasscodeStatus] = useState<string[]>([]);
  const [opdBenefits, setOpdBenefits] = useState("all");
  
  // Employee Status (radio)
  const [employeeStatus, setEmployeeStatus] = useState("all");
  
  // Eligibility Filter
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  
  // Advanced Filters (multi-select)
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
  const [showFilters, setShowFilters] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Activity Log Modal State
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [activityLogEmployee, setActivityLogEmployee] = useState<Employee | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingActivityLogs, setLoadingActivityLogs] = useState(false);
  
  // OPD Benefits Modal State
  const [showOpdBenefitsModal, setShowOpdBenefitsModal] = useState(false);
  const [opdBenefitsEmployee, setOpdBenefitsEmployee] = useState<Employee | null>(null);
  const [opdTransactions, setOpdTransactions] = useState<OpdTransaction[]>([]);
  const [opdWalletSummary, setOpdWalletSummary] = useState<any>(null);
  const [loadingOpdData, setLoadingOpdData] = useState(false);
  
  // Sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'employeeId', direction: 'asc' });
  
  // Filter options
  const corporates = ["Energy Solutions Inc", "Tech Innovations Corp", "Healthcare Plus Ltd", "Manufacturing Solutions", "Financial Services Inc"];
  const ahcStatusOptions = ["Not Booked", "Booked", "Medical Done"];
  const benefitSourceOptions = ["Corporate Rule", "Executive", "Premium", "Standard", "Basic"];
  const passcodeStatusOptions = ["Sent", "Delivered", "Bounced", "Not Sent"];
  const departments = ["HR", "IT", "Finance", "Operations", "Sales", "Marketing", "Legal", "Admin", "R&D", "Quality"];
  const designations = ["Manager", "Senior Manager", "Analyst", "Senior Analyst", "Executive", "Associate", "Director", "VP", "AVP", "Team Lead"];
  const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata", "Ahmedabad"];

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const result = await eligibilityAPI.employee.getEmployees({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        corporate: selectedCorporate === "all" ? "" : selectedCorporate,
        status: employeeStatus === "all" ? "" : employeeStatus,
        location: selectedLocations.length > 0 ? selectedLocations.join(",") : ""
      });
      
      let filteredData = result.data;
      
      // Apply client-side filters that aren't supported by API yet
      if (ahcBenefitStatus.length > 0) {
        filteredData = filteredData.filter(emp => ahcBenefitStatus.includes(emp.ahcBenefitStatus));
      }
      
      if (benefitSource.length > 0) {
        filteredData = filteredData.filter(emp => benefitSource.includes(emp.benefitSource));
      }
      
      if (passcodeStatus.length > 0) {
        filteredData = filteredData.filter(emp => passcodeStatus.includes(emp.passcodeStatus));
      }
      
      if (opdBenefits !== "all") {
        if (opdBenefits === "has_opd") {
          filteredData = filteredData.filter(emp => emp.opdWalletAllocated > 0);
        } else if (opdBenefits === "no_opd") {
          filteredData = filteredData.filter(emp => emp.opdWalletAllocated === 0);
        }
      }
      
      if (selectedDepartments.length > 0) {
        filteredData = filteredData.filter(emp => selectedDepartments.includes(emp.department));
      }
      
      if (selectedDesignations.length > 0) {
        filteredData = filteredData.filter(emp => selectedDesignations.includes(emp.designation));
      }
      
      if (showEligibleOnly) {
        const today = new Date().toISOString().split('T')[0];
        filteredData = filteredData.filter(emp => emp.nextAHCDue && emp.nextAHCDue <= today);
      }
      
      // Apply sorting
      if (sortConfig.key && sortConfig.direction) {
        filteredData.sort((a, b) => {
          const aValue = a[sortConfig.key!];
          const bValue = b[sortConfig.key!];
          
          if (aValue === bValue) return 0;
          
          const comparison = aValue < bValue ? -1 : 1;
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
      }
      
      setEmployees(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length, totalPages: Math.ceil(filteredData.length / prev.limit) }));
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination.page, searchTerm, selectedCorporate, employeeStatus, selectedLocations, ahcBenefitStatus, benefitSource, passcodeStatus, opdBenefits, selectedDepartments, selectedDesignations, showEligibleOnly, sortConfig]);

  const handleSort = (key: keyof Employee) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        // Cycle through: asc -> desc -> null -> asc
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: null, direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: keyof Employee) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'asc') return <ChevronUp className="h-3 w-3" />;
    if (sortConfig.direction === 'desc') return <ChevronDown className="h-3 w-3" />;
    return null;
  };

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp.id));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCorporate("all");
    setAhcBenefitStatus([]);
    setBenefitSource([]);
    setPasscodeStatus([]);
    setOpdBenefits("all");
    setEmployeeStatus("all");
    setShowEligibleOnly(false);
    setSelectedDepartments([]);
    setSelectedDesignations([]);
    setSelectedLocations([]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCorporate !== "all") count++;
    if (ahcBenefitStatus.length > 0) count++;
    if (benefitSource.length > 0) count++;
    if (passcodeStatus.length > 0) count++;
    if (opdBenefits !== "all") count++;
    if (employeeStatus !== "all") count++;
    if (showEligibleOnly) count++;
    if (selectedDepartments.length > 0) count++;
    if (selectedDesignations.length > 0) count++;
    if (selectedLocations.length > 0) count++;
    return count;
  };

  const getAhcStatusColor = (status: string) => {
    switch (status) {
      case 'Not Booked': return 'bg-gray-100 text-gray-800';
      case 'Booked': return 'bg-blue-100 text-blue-800';
      case 'Medical Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPasscodeStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Bounced': return 'bg-red-100 text-red-800';
      case 'Not Sent': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendPasscode = async (employeeId: string) => {
    try {
      const result = await eligibilityAPI.employee.sendPasscode(employeeId);
      if (result.success) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to send passcode:', error);
      alert('❌ Failed to send passcode. Please try again.');
    }
  };

  const handleViewActivityLog = async (employee: Employee) => {
    setActivityLogEmployee(employee);
    setShowActivityLogModal(true);
    setLoadingActivityLogs(true);
    
    try {
      const logs = await eligibilityAPI.employee.getActivityLogs(employee.id);
      setActivityLogs(logs);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
      alert('Failed to load activity logs. Please try again.');
    } finally {
      setLoadingActivityLogs(false);
    }
  };

  const handleViewOpdBenefits = async (employee: Employee) => {
    setOpdBenefitsEmployee(employee);
    setShowOpdBenefitsModal(true);
    setLoadingOpdData(true);
    
    try {
      const [transactions, summary] = await Promise.all([
        eligibilityAPI.opdWallet.getEmployeeTransactions(employee.id),
        eligibilityAPI.opdWallet.getEmployeeWalletSummary(employee.id)
      ]);
      setOpdTransactions(transactions);
      setOpdWalletSummary(summary);
    } catch (error) {
      console.error('Failed to load OPD data:', error);
      alert('Failed to load OPD benefits. Please try again.');
    } finally {
      setLoadingOpdData(false);
    }
  };

  const handleBulkSendPasscode = async () => {
    try {
      console.log(`Sending passcode to ${selectedEmployees.length} employees`);
      // Simulate bulk operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Show success/failure summary would go here
    } catch (error) {
      console.error('Failed to send bulk passcodes:', error);
    }
  };

  const exportEmployees = () => {
    const csvHeaders = [
      'Employee ID', 'Employee Name', 'Email', 'Mobile', 'Department', 'Designation', 
      'Location', 'AHC Benefit Status', 'Benefit Source', 'Next AHC Date', 'Last AHC Date',
      'Passcode Status', 'OPD Wallet Balance', 'Employee Status'
    ];
    
    const csvData = employees.map(emp => [
      emp.employeeId,
      emp.name,
      emp.email,
      emp.mobile,
      emp.department,
      emp.designation,
      emp.location,
      emp.ahcBenefitStatus,
      emp.benefitSource,
      emp.nextAHCDue || '',
      emp.lastAHCDate || '',
      emp.passcodeStatus,
      emp.opdWalletBalance,
      emp.eligibilityStatus
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Employees_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <nav className="text-sm text-muted-foreground">
          Home &gt; Eligibility Management &gt; Employee List
        </nav>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Employee List</h1>
            <p className="text-muted-foreground">Total Employees: {pagination.total}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchEmployees()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportEmployees}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by Emp ID, Name, Email, or Mobile"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {showFilters && (
            <div className="space-y-6 border-t pt-4">
              {/* Status Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* AHC Benefit Status */}
                <div>
                  <Label className="text-sm font-medium">AHC Benefit Status</Label>
                  <div className="space-y-2 mt-2">
                    {ahcStatusOptions.map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ahc-${status}`}
                          checked={ahcBenefitStatus.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAhcBenefitStatus(prev => [...prev, status]);
                            } else {
                              setAhcBenefitStatus(prev => prev.filter(s => s !== status));
                            }
                          }}
                        />
                        <Label htmlFor={`ahc-${status}`} className="text-sm">{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefit Source */}
                <div>
                  <Label className="text-sm font-medium">Benefit Source</Label>
                  <div className="space-y-2 mt-2">
                    {benefitSourceOptions.map(source => (
                      <div key={source} className="flex items-center space-x-2">
                        <Checkbox
                          id={`source-${source}`}
                          checked={benefitSource.includes(source)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBenefitSource(prev => [...prev, source]);
                            } else {
                              setBenefitSource(prev => prev.filter(s => s !== source));
                            }
                          }}
                        />
                        <Label htmlFor={`source-${source}`} className="text-sm">{source}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passcode Status */}
                <div>
                  <Label className="text-sm font-medium">Passcode Status</Label>
                  <div className="space-y-2 mt-2">
                    {passcodeStatusOptions.map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`passcode-${status}`}
                          checked={passcodeStatus.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPasscodeStatus(prev => [...prev, status]);
                            } else {
                              setPasscodeStatus(prev => prev.filter(s => s !== status));
                            }
                          }}
                        />
                        <Label htmlFor={`passcode-${status}`} className="text-sm">{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Radio Button Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Status */}
                <div>
                  <Label className="text-sm font-medium">Employee Status</Label>
                  <RadioGroup value={employeeStatus} onValueChange={setEmployeeStatus} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="emp-all" />
                      <Label htmlFor="emp-all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Active" id="emp-active" />
                      <Label htmlFor="emp-active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Inactive" id="emp-inactive" />
                      <Label htmlFor="emp-inactive">Inactive</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* OPD Benefits */}
                <div>
                  <Label className="text-sm font-medium">OPD Benefits</Label>
                  <RadioGroup value={opdBenefits} onValueChange={setOpdBenefits} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="opd-all" />
                      <Label htmlFor="opd-all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="has_opd" id="opd-has" />
                      <Label htmlFor="opd-has">Has OPD Benefits</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no_opd" id="opd-no" />
                      <Label htmlFor="opd-no">No OPD Benefits</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Eligibility Filter */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="eligible-only"
                  checked={showEligibleOnly}
                  onCheckedChange={setShowEligibleOnly}
                />
                <Label htmlFor="eligible-only" className="text-sm font-medium">
                  Show Eligible Only
                </Label>
                <span className="text-xs text-muted-foreground">
                  Display only employees eligible for AHC today
                </span>
              </div>

              {/* Advanced Filters */}
              <div>
                <Label className="text-sm font-medium">Advanced Filters</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {/* Department */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Department</Label>
                    <Select value={selectedDepartments.join(",") || "all"} onValueChange={(value) => setSelectedDepartments(value === "all" ? [] : value.split(","))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Designation */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Designation</Label>
                    <Select value={selectedDesignations.join(",") || "all"} onValueChange={(value) => setSelectedDesignations(value === "all" ? [] : value.split(","))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Designations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Designations</SelectItem>
                        {designations.map(desig => (
                          <SelectItem key={desig} value={desig}>{desig}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Location</Label>
                    <Select value={selectedLocations.join(",") || "all"} onValueChange={(value) => setSelectedLocations(value === "all" ? [] : value.split(","))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedEmployees.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkSendPasscode}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Passcode
                </Button>
                <Button size="sm" variant="outline" onClick={exportEmployees}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{width: '40px'}}>
                    <Checkbox
                      checked={selectedEmployees.length === employees.length && employees.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead style={{width: '100px'}} className="cursor-pointer" onClick={() => handleSort('employeeId')}>
                    <div className="flex items-center gap-1">
                      Emp ID
                      {getSortIcon('employeeId')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '200px'}} className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '250px'}} className="cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center gap-1">
                      Email
                      {getSortIcon('email')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '120px'}}>Mobile</TableHead>
                  <TableHead style={{width: '140px'}} className="cursor-pointer" onClick={() => handleSort('ahcBenefitStatus')}>
                    <div className="flex items-center gap-1">
                      AHC Benefit Status
                      {getSortIcon('ahcBenefitStatus')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '150px'}} className="cursor-pointer" onClick={() => handleSort('benefitSource')}>
                    <div className="flex items-center gap-1">
                      Benefit Source
                      {getSortIcon('benefitSource')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '120px'}} className="cursor-pointer" onClick={() => handleSort('nextAHCDue')}>
                    <div className="flex items-center gap-1">
                      Next AHC Date
                      {getSortIcon('nextAHCDue')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '120px'}} className="cursor-pointer" onClick={() => handleSort('lastAHCDate')}>
                    <div className="flex items-center gap-1">
                      Last AHC Date
                      {getSortIcon('lastAHCDate')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '150px'}} className="cursor-pointer" onClick={() => handleSort('designation')}>
                    <div className="flex items-center gap-1">
                      Designation
                      {getSortIcon('designation')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '120px'}} className="cursor-pointer" onClick={() => handleSort('location')}>
                    <div className="flex items-center gap-1">
                      Location
                      {getSortIcon('location')}
                    </div>
                  </TableHead>
                  <TableHead style={{width: '120px'}}>Passcode Status</TableHead>
                  <TableHead style={{width: '120px'}}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8">
                      Loading employees...
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8">
                      No employees found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => handleSelectEmployee(employee.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{employee.employeeId}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.mobile}</TableCell>
                      <TableCell>
                        <Badge className={getAhcStatusColor(employee.ahcBenefitStatus)}>
                          {employee.ahcBenefitStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.benefitSource}</TableCell>
                      <TableCell>{employee.nextAHCDue || '-'}</TableCell>
                      <TableCell>{employee.lastAHCDate || '-'}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>{employee.location}</TableCell>
                      <TableCell>
                        <Badge className={getPasscodeStatusColor(employee.passcodeStatus)}>
                          {employee.passcodeStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingEmployee(employee);
                              setShowEditModal(true);
                            }}
                            title="Edit Employee"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSendPasscode(employee.id)}
                            title="Send Passcode"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Activity Log"
                            onClick={() => handleViewActivityLog(employee)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          {employee.opdWalletAllocated > 0 ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              title={`View Wallet (₹${employee.opdWalletAllocated.toLocaleString()} allocated)`}
                              onClick={() => handleViewOpdBenefits(employee)}
                            >
                              <Wallet className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              title={`No Wallet (${employee.benefitGroup} - ₹0 allocated)`}
                              className="opacity-50 cursor-not-allowed"
                              disabled
                            >
                              <Wallet className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select 
                value={pageSize} 
                onValueChange={(value) => {
                  setPageSize(value);
                  setPagination(prev => ({ 
                    ...prev, 
                    limit: parseInt(value),
                    page: 1 
                  }));
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </span>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      className={pagination.page === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNumber = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNumber = pagination.totalPages - 4 + i;
                    } else {
                      pageNumber = pagination.page - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNumber }))}
                          isActive={pagination.page === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      className={pagination.page === pagination.totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Employee - {editingEmployee.name}</DialogTitle>
              <DialogDescription>
                Update employee details below
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Mobile Number</Label>
                <Input 
                  defaultValue={editingEmployee.mobile}
                  placeholder="10-digit mobile number"
                />
              </div>
              
              <div>
                <Label>Employee Status</Label>
                <Select defaultValue={editingEmployee.eligibilityStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>HR Name</Label>
                <Input defaultValue={editingEmployee.hrName} />
              </div>
              
              <div>
                <Label>HR Email</Label>
                <Input defaultValue={editingEmployee.hrEmail} type="email" />
              </div>
              
              <div>
                <Label>Entity</Label>
                <Select defaultValue={editingEmployee.entity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Office">Main Office</SelectItem>
                    <SelectItem value="Branch Office">Branch Office</SelectItem>
                    <SelectItem value="Regional Office">Regional Office</SelectItem>
                    <SelectItem value="Subsidiary">Subsidiary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Location</Label>
                <Select defaultValue={editingEmployee.location}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Designation</Label>
                <Input defaultValue={editingEmployee.designation} />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowEditModal(false)}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Activity Log Modal */}
      <Dialog open={showActivityLogModal} onOpenChange={setShowActivityLogModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Activity Log - {activityLogEmployee?.name}
            </DialogTitle>
            <DialogDescription>
              Complete activity history for Employee ID: {activityLogEmployee?.employeeId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {loadingActivityLogs ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="ml-3">Loading activity logs...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {log.actionType}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {log.user}
                      </span>
                    </div>
                    
                    <p className="text-sm">{log.description}</p>
                    
                    {(log.previousValue || log.newValue) && (
                      <div className="grid grid-cols-2 gap-4 text-xs bg-muted p-2 rounded">
                        {log.previousValue && (
                          <div>
                            <span className="font-medium">Previous:</span>
                            <span className="ml-1 text-red-600">{log.previousValue}</span>
                          </div>
                        )}
                        {log.newValue && (
                          <div>
                            <span className="font-medium">New:</span>
                            <span className="ml-1 text-green-600">{log.newValue}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>IP: {log.ipAddress}</span>
                      <span>Session: {log.sessionId}</span>
                    </div>
                  </div>
                ))}
                
                {activityLogs.length === 0 && (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No activity logs found for this employee</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {activityLogs.length} activities shown
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                const csvContent = [
                  ['Timestamp', 'User', 'Action Type', 'Previous Value', 'New Value', 'Description', 'IP Address'],
                  ...activityLogs.map(log => [
                    log.timestamp,
                    log.user,
                    log.actionType,
                    log.previousValue || '',
                    log.newValue || '',
                    log.description,
                    log.ipAddress || ''
                  ])
                ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Activity_Log_${activityLogEmployee?.employeeId}_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => setShowActivityLogModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* OPD Benefits Modal */}
      <Dialog open={showOpdBenefitsModal} onOpenChange={setShowOpdBenefitsModal}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              OPD Benefits - {opdBenefitsEmployee?.name}
            </DialogTitle>
            <DialogDescription>
              Wallet details and transaction history for Employee ID: {opdBenefitsEmployee?.employeeId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto space-y-6">
            {loadingOpdData ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="ml-3">Loading OPD benefits...</span>
              </div>
            ) : (
              <>
                {/* Wallet Summary */}
                {opdWalletSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{opdWalletSummary.allocated.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Allocated</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          ₹{opdWalletSummary.used.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Used</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ₹{opdWalletSummary.balance.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Balance</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">
                          {opdWalletSummary.totalTransactions}
                        </div>
                        <div className="text-sm text-muted-foreground">Transactions</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Transaction History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Family Member</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {opdTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    transaction.transactionType === 'Allocation' ? 'default' :
                                    transaction.transactionType === 'Usage' ? 'destructive' : 'secondary'
                                  }
                                >
                                  {transaction.transactionType}
                                </Badge>
                              </TableCell>
                              <TableCell>{transaction.serviceType}</TableCell>
                              <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                              <TableCell>{transaction.providerName || '-'}</TableCell>
                              <TableCell>{transaction.familyMember || 'Self'}</TableCell>
                              <TableCell className="text-right">
                                <span className={
                                  transaction.transactionType === 'Usage' ? 'text-red-600' :
                                  transaction.transactionType === 'Allocation' ? 'text-green-600' : 'text-blue-600'
                                }>
                                  {transaction.transactionType === 'Usage' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ₹{transaction.balance.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {opdTransactions.length === 0 && (
                      <div className="text-center py-8">
                        <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No transactions found for this employee</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {opdTransactions.length} transactions shown
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                const csvContent = [
                  ['Date', 'Type', 'Service', 'Description', 'Provider', 'Family Member', 'Amount', 'Balance'],
                  ...opdTransactions.map(txn => [
                    txn.date,
                    txn.transactionType,
                    txn.serviceType,
                    txn.description,
                    txn.providerName || '',
                    txn.familyMember || 'Self',
                    txn.amount.toString(),
                    txn.balance.toString()
                  ])
                ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `OPD_Transactions_${opdBenefitsEmployee?.employeeId}_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => setShowOpdBenefitsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default EmployeeManagement;