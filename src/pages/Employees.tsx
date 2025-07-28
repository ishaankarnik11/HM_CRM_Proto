import { useState, useEffect } from 'react';
import { Search, Download, Eye, Filter, Loader2, FileDown, ArrowLeft, Users } from 'lucide-react';
import { useTableSort, SortableHeader } from '../hooks/useTableSort';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { 
  EmployeeStatusBadge, 
  AHCBenefitStatusBadge, 
  InvoiceStatusBadge, 
  DCBillStatusBadge 
} from '../components/ui/StatusBadge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import { 
  useCorporates,
  useApiError 
} from '../hooks/useAccountingAPI';
import { exportToCSV, formatDateForCSV } from '../services/csvExport';
import { auditLogService } from '../services/auditLog';
import { mockDataService } from '../services/mockData';

interface Employee {
  emp_id: string;
  name: string;
  email: string;
  mobile: string;
  ahc_benefit_status: "Active" | "Inactive";
  benefit_source: string;
  next_ahc_date: string | null;
  last_ahc_date: string | null;
  designation: string;
  location: string;
  passcode_status: string;
  employee_status: "Active" | "Inactive" | "Terminated";
}

interface Appointment {
  appointment_id: string;
  is_dependent: boolean;
  dependent_name: string | null;
  designation_at_appointment: string;
  requested_date: string;
  appointment_date: string;
  medical_done_date: string;
  corporate_plan_details: string;
  additional_tests: { name: string; amount: number }[];
  center: { name: string; location: string };
  dc_rate: number;
  invoice: {
    number: string | null;
    status: "Draft" | "Submitted" | "Approved" | null;
    zoho_id: string | null;
  };
  dc_bill: {
    docket_id: string | null;
    status: "Draft" | "Submitted" | "Approved" | null;
    zoho_id: string | null;
  };
}

export const Employees = () => {
  const [selectedCorporate, setSelectedCorporate] = useState('');
  const [zohoSearchId, setZohoSearchId] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showEmployees, setShowEmployees] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    employee_status: [] as string[],
    ahc_benefit_status: [] as string[],
    benefit_source: [] as string[],
    location: [] as string[],
    designation: [] as string[],
    passcode_status: [] as string[],
    next_ahc_date_from: '',
    next_ahc_date_to: '',
    last_ahc_date_from: '',
    last_ahc_date_to: '',
    search_text: ''
  });
  const [appointmentFilters, setAppointmentFilters] = useState({
    date_from: '',
    date_to: '',
    invoice_status: '',
    dc_bill_status: '',
    center_ids: [] as number[],
    appointment_type: 'all' as 'all' | 'self' | 'dependent',
    zoho_id_search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  });
  const [pageSize, setPageSize] = useState('25');
  const [showZohoModal, setShowZohoModal] = useState(false);
  const [zohoModalData, setZohoModalData] = useState<any[]>([]);
  const [zohoModalId, setZohoModalId] = useState('');

  const { toast } = useToast();
  const { handleError } = useApiError();

  // API hooks
  const { data: corporates, isLoading: corporatesLoading } = useCorporates();

  // Sorting hooks
  const employeesSort = useTableSort(employees);
  const appointmentsSort = useTableSort(appointments);
  const zohoModalSort = useTableSort(zohoModalData);

  // Load employees when corporate is selected
  useEffect(() => {
    if (selectedCorporate && !zohoSearchId) {
      loadEmployees();
    }
  }, [selectedCorporate, filters, pagination.page, pagination.limit]);

  // Search by Zoho ID with debouncing
  useEffect(() => {
    if (!zohoSearchId.trim()) {
      setEmployees([]);
      return;
    }

    // Only search if the input has at least 2 characters
    if (zohoSearchId.trim().length < 2) {
      setEmployees([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      searchByZohoId();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [zohoSearchId]);

  const loadEmployees = async () => {
    if (!selectedCorporate) return;
    
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      const mockEmployees = mockDataService.getEmployees(selectedCorporate, filters, pagination);
      setEmployees(mockEmployees.employees || []);
      setPagination(prev => ({
        ...prev,
        total: mockEmployees.total_count || 0,
        totalPages: Math.ceil((mockEmployees.total_count || 0) / prev.limit)
      }));

      // Log employee list view
      const corporateName = corporates?.find(c => c.id === selectedCorporate)?.name || selectedCorporate;
      auditLogService.logActivity(
        'EMPLOYEE_LIST_VIEWED',
        'EMPLOYEE',
        `emp-list-${Date.now()}`,
        'Employee List View',
        `Viewed employee list for ${corporateName}`,
        {
          corporate_id: selectedCorporate,
          filters_applied: filters,
          page: pagination.page,
          page_size: pagination.limit
        }
      );
    } catch (error) {
      toast({
        title: "Load Failed",
        description: handleError(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchByZohoId = async () => {
    if (!zohoSearchId.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call for Zoho ID search
      const results = mockDataService.searchByZohoId(zohoSearchId, 25); // Limit to 25 results
      setEmployees(results);

      // Log Zoho ID search
      auditLogService.logActivity(
        'ZOHO_ID_SEARCHED',
        'EMPLOYEE',
        `zoho-search-${Date.now()}`,
        'Zoho ID Search',
        `Searched for Zoho ID: ${zohoSearchId}`,
        {
          zoho_id: zohoSearchId,
          results_count: results.length
        }
      );
    } catch (error) {
      toast({
        title: "Search Failed",
        description: handleError(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeView = async (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployees(false);
    setIsLoading(true);

    try {
      // Load appointment history for the employee
      const appointmentHistory = mockDataService.getEmployeeAppointments(employee.emp_id, appointmentFilters);
      setAppointments(appointmentHistory.appointments || []);

      // Log employee appointment history view
      auditLogService.logActivity(
        'EMPLOYEE_APPOINTMENT_HISTORY_VIEWED',
        'EMPLOYEE',
        employee.emp_id,
        `${employee.name} - ${employee.emp_id}`,
        `Viewed appointment history for ${employee.name}`,
        {
          employee_id: employee.emp_id,
          corporate_id: selectedCorporate
        }
      );
    } catch (error) {
      toast({
        title: "Load Failed",
        description: handleError(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleZohoModalOpen = (zohoId: string, source: 'invoice' | 'dc_bill') => {
    // Simulate loading appointments for this Zoho ID across all corporates
    const modalData = mockDataService.getZohoReferenceData(zohoId);
    setZohoModalData(modalData);
    setZohoModalId(zohoId);
    setShowZohoModal(true);

    // Log Zoho modal opened
    auditLogService.logActivity(
      'ZOHO_MODAL_OPENED',
      'EMPLOYEE',
      `zoho-modal-${Date.now()}`,
      `Zoho Modal: ${zohoId}`,
      `Opened Zoho reference modal for ${zohoId}`,
      {
        zoho_id: zohoId,
        source: source
      }
    );
  };

  const handleExportEmployees = () => {
    try {
      if (employees.length === 0) {
        toast({
          title: "No Data to Export",
          description: "No employees found to export",
          variant: "destructive"
        });
        return;
      }

      const columnMapping = {
        'emp_id': 'Employee ID',
        'name': 'Name',
        'email': 'Email',
        'mobile': 'Mobile',
        'ahc_benefit_status': 'AHC Benefit Status',
        'benefit_source': 'Benefit Source',
        'next_ahc_date': 'Next AHC Date',
        'last_ahc_date': 'Last AHC Date',
        'designation': 'Designation',
        'location': 'Location',
        'passcode_status': 'Passcode Status',
        'employee_status': 'Employee Status'
      };

      // Transform data for CSV export
      const exportData = employees.map(emp => ({
        ...emp,
        next_ahc_date: emp.next_ahc_date ? formatDateForCSV(emp.next_ahc_date) : 'N/A',
        last_ahc_date: emp.last_ahc_date ? formatDateForCSV(emp.last_ahc_date) : 'N/A'
      }));

      const corporateName = corporates?.find(c => c.id === selectedCorporate)?.name || 'employees';
      exportToCSV(exportData, `${corporateName}_employees`, columnMapping);

      // Log export activity
      auditLogService.logActivity(
        'EMPLOYEE_DATA_EXPORTED',
        'EMPLOYEE',
        `export-${Date.now()}`,
        'Employee Export',
        `Exported ${employees.length} employees to CSV`,
        {
          export_type: 'employee_list',
          record_count: employees.length,
          filters: filters
        }
      );

      toast({
        title: "Export Successful",
        description: `${employees.length} employees exported to CSV`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export employees to CSV",
        variant: "destructive"
      });
    }
  };

  const handleExportAppointments = () => {
    try {
      if (appointments.length === 0) {
        toast({
          title: "No Data to Export",
          description: "No appointments found to export",
          variant: "destructive"
        });
        return;
      }

      const columnMapping = {
        'appointment_id': 'Appointment ID',
        'self_dependent': 'Self/Dependent',
        'designation_at_appointment': 'Designation',
        'requested_date': 'Requested Date',
        'appointment_date': 'Appointment Date',
        'medical_done_date': 'Medical Done Date',
        'corporate_plan_details': 'Corporate Plan Details',
        'additional_tests_text': 'Additional Paid Tests',
        'center_details': 'Center Details',
        'dc_rate': 'DC Rate (₹)',
        'invoice_number': 'Invoice Number',
        'invoice_status': 'Invoice Status',
        'invoice_zoho_id': 'Zoho ID (Invoice)',
        'dc_bill_docket_id': 'DC Bill Docket ID',
        'dc_bill_status': 'DC Bill Status',
        'dc_bill_zoho_id': 'Zoho ID (DC Bill)'
      };

      // Transform data for CSV export
      const exportData = appointments.map(apt => ({
        ...apt,
        self_dependent: apt.is_dependent ? apt.dependent_name || 'Dependent' : 'Self',
        requested_date: formatDateForCSV(apt.requested_date),
        appointment_date: formatDateForCSV(apt.appointment_date),
        medical_done_date: formatDateForCSV(apt.medical_done_date),
        additional_tests_text: apt.additional_tests.map(t => `${t.name} (₹${t.amount})`).join(', ') || 'None',
        center_details: `${apt.center.name} - ${apt.center.location}`,
        invoice_number: apt.invoice.number || '-',
        invoice_status: apt.invoice.status || '-',
        invoice_zoho_id: apt.invoice.zoho_id || '-',
        dc_bill_docket_id: apt.dc_bill.docket_id || '-',
        dc_bill_status: apt.dc_bill.status || '-',
        dc_bill_zoho_id: apt.dc_bill.zoho_id || '-'
      }));

      exportToCSV(exportData, `${selectedEmployee?.name}_appointments`, columnMapping);

      // Log export activity
      auditLogService.logActivity(
        'EMPLOYEE_DATA_EXPORTED',
        'EMPLOYEE',
        `export-${Date.now()}`,
        'Appointment Export',
        `Exported ${appointments.length} appointments to CSV for ${selectedEmployee?.name}`,
        {
          export_type: 'appointment_history',
          record_count: appointments.length,
          filters: appointmentFilters
        }
      );

      toast({
        title: "Export Successful",
        description: `${appointments.length} appointments exported to CSV`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export appointments to CSV",
        variant: "destructive"
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newLimit = parseInt(value);
    setPageSize(value);
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      page: 1
    }));
  };

  // Calculate pagination for current view
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;

  return (
    <div>
      {/* Zoho ID Search Bar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by Zoho ID"
              value={zohoSearchId}
              onChange={(e) => {
                setZohoSearchId(e.target.value);
                if (e.target.value) {
                  setSelectedCorporate('');
                  setShowEmployees(true);
                }
              }}
              className="w-full"
            />
          </div>
          {zohoSearchId && (
            <Button
              variant="outline"
              onClick={() => {
                setZohoSearchId('');
                setEmployees([]);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Corporate Selection - Only show if not searching by Zoho ID */}
      {!zohoSearchId && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="section-header mb-4">Select Corporate</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select 
                value={selectedCorporate} 
                onValueChange={(value) => {
                  setSelectedCorporate(value);
                  setShowEmployees(true);
                  setSelectedEmployee(null);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                disabled={corporatesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a corporate to view employees" />
                </SelectTrigger>
                <SelectContent>
                  {corporatesLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    corporates?.map(corp => (
                      <SelectItem key={corp.id} value={corp.id}>
                        {corp.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Employee Filters - Only show when employees are being displayed */}
      {showEmployees && selectedCorporate && !zohoSearchId && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({
                  employee_status: [],
                  ahc_benefit_status: [],
                  benefit_source: [],
                  location: [],
                  designation: [],
                  passcode_status: [],
                  next_ahc_date_from: '',
                  next_ahc_date_to: '',
                  last_ahc_date_from: '',
                  last_ahc_date_to: '',
                  search_text: ''
                });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Search</label>
              <Input
                placeholder="Search name, email, or ID"
                value={filters.search_text}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, search_text: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Employee Status</label>
              <Select 
                value={filters.employee_status.length > 0 ? filters.employee_status.join(',') : 'all'} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, employee_status: value === 'all' ? [] : value.split(',') }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">AHC Benefit Status</label>
              <Select 
                value={filters.ahc_benefit_status.length > 0 ? filters.ahc_benefit_status.join(',') : 'all'} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, ahc_benefit_status: value === 'all' ? [] : value.split(',') }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
              <Select 
                value={filters.location.length > 0 ? filters.location.join(',') : 'all'} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, location: value === 'all' ? [] : value.split(',') }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                  <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Next AHC Date From</label>
              <Input
                type="date"
                value={filters.next_ahc_date_from}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, next_ahc_date_from: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Next AHC Date To</label>
              <Input
                type="date"
                value={filters.next_ahc_date_to}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, next_ahc_date_to: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                min={filters.next_ahc_date_from}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Last AHC Date From</label>
              <Input
                type="date"
                value={filters.last_ahc_date_from}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, last_ahc_date_from: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Last AHC Date To</label>
              <Input
                type="date"
                value={filters.last_ahc_date_to}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, last_ahc_date_to: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                min={filters.last_ahc_date_from}
              />
            </div>
          </div>
        </div>
      )}

      {/* Appointment Filters - Only show when viewing appointment history */}
      {!showEmployees && selectedEmployee && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Appointment Filters
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAppointmentFilters({
                  date_from: '',
                  date_to: '',
                  invoice_status: '',
                  dc_bill_status: '',
                  center_ids: [],
                  appointment_type: 'all',
                  zoho_id_search: ''
                });
                // Reload appointments with cleared filters
                if (selectedEmployee) {
                  const appointmentHistory = mockDataService.getEmployeeAppointments(selectedEmployee.emp_id, {});
                  setAppointments(appointmentHistory.appointments || []);
                }
              }}
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Appointment Date From</label>
              <Input
                type="date"
                value={appointmentFilters.date_from}
                onChange={(e) => {
                  const newFilters = { ...appointmentFilters, date_from: e.target.value };
                  setAppointmentFilters(newFilters);
                  if (selectedEmployee) {
                    const appointmentHistory = mockDataService.getEmployeeAppointments(selectedEmployee.emp_id, newFilters);
                    setAppointments(appointmentHistory.appointments || []);
                  }
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Appointment Date To</label>
              <Input
                type="date"
                value={appointmentFilters.date_to}
                onChange={(e) => {
                  const newFilters = { ...appointmentFilters, date_to: e.target.value };
                  setAppointmentFilters(newFilters);
                  if (selectedEmployee) {
                    const appointmentHistory = mockDataService.getEmployeeAppointments(selectedEmployee.emp_id, newFilters);
                    setAppointments(appointmentHistory.appointments || []);
                  }
                }}
                min={appointmentFilters.date_from}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Zoho ID Search</label>
              <Input
                placeholder="Search by Zoho ID"
                value={appointmentFilters.zoho_id_search}
                onChange={(e) => {
                  const newFilters = { ...appointmentFilters, zoho_id_search: e.target.value };
                  setAppointmentFilters(newFilters);
                  if (selectedEmployee) {
                    const appointmentHistory = mockDataService.getEmployeeAppointments(selectedEmployee.emp_id, newFilters);
                    setAppointments(appointmentHistory.appointments || []);
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Invoice Status</label>
              <Select 
                value={appointmentFilters.invoice_status || 'all'} 
                onValueChange={(value) => {
                  const newFilters = { ...appointmentFilters, invoice_status: value === 'all' ? '' : value };
                  setAppointmentFilters(newFilters);
                  if (selectedEmployee) {
                    const appointmentHistory = mockDataService.getEmployeeAppointments(selectedEmployee.emp_id, newFilters);
                    setAppointments(appointmentHistory.appointments || []);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Not Created">Not Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">DC Bill Status</label>
              <Select 
                value={appointmentFilters.dc_bill_status || 'all'} 
                onValueChange={(value) => {
                  const newFilters = { ...appointmentFilters, dc_bill_status: value === 'all' ? '' : value };
                  setAppointmentFilters(newFilters);
                  if (selectedEmployee) {
                    const appointmentHistory = mockDataService.getEmployeeAppointments(selectedEmployee.emp_id, newFilters);
                    setAppointments(appointmentHistory.appointments || []);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Not Created">Not Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Appointment Type</label>
              <Select 
                value={appointmentFilters.appointment_type} 
                onValueChange={(value) => {
                  const newFilters = { ...appointmentFilters, appointment_type: value as 'all' | 'self' | 'dependent' };
                  setAppointmentFilters(newFilters);
                  if (selectedEmployee) {
                    const appointmentHistory = mockDataService.getEmployeeAppointments(selectedEmployee.emp_id, newFilters);
                    setAppointments(appointmentHistory.appointments || []);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="self">Self</SelectItem>
                  <SelectItem value="dependent">Dependent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Employee Listing */}
      {showEmployees && (selectedCorporate || zohoSearchId) && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="section-header flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {zohoSearchId ? 'Zoho ID Search Results' : 'Employees'}
                </h3>
                {selectedCorporate && !zohoSearchId && (
                  <p className="text-sm text-text-secondary mt-1">
                    Corporate: {corporates?.find(c => c.id === selectedCorporate)?.name}
                  </p>
                )}
                {zohoSearchId && (
                  <p className="text-sm text-text-secondary mt-1">
                    Search results for Zoho ID: {zohoSearchId}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : (
                    `${employees.length} employees`
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportEmployees}
                  disabled={isLoading || employees.length === 0}
                  title="Export employees to CSV"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading employees...</p>
            </div>
          ) : employees.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <SortableHeader column="emp_id" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        Emp ID
                      </SortableHeader>
                      <SortableHeader column="name" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        Name
                      </SortableHeader>
                      <SortableHeader column="email" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        Email
                      </SortableHeader>
                      <th>Mobile</th>
                      <SortableHeader column="ahc_benefit_status" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        AHC Benefit Status
                      </SortableHeader>
                      <th>Benefit Source</th>
                      <SortableHeader column="next_ahc_date" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        Next AHC Date
                      </SortableHeader>
                      <SortableHeader column="last_ahc_date" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        Last AHC Date
                      </SortableHeader>
                      <SortableHeader column="designation" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        Designation
                      </SortableHeader>
                      <SortableHeader column="location" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        Location
                      </SortableHeader>
                      <th>Passcode Status</th>
                      <SortableHeader column="employee_status" onSort={employeesSort.handleSort} getSortIcon={employeesSort.getSortIcon}>
                        Employee Status
                      </SortableHeader>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeesSort.sortedData.map((employee) => (
                      <tr key={employee.emp_id}>
                        <td className="font-medium text-text-primary">{employee.emp_id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.mobile}</td>
                        <td>
                          <AHCBenefitStatusBadge status={employee.ahc_benefit_status} />
                        </td>
                        <td>{employee.benefit_source}</td>
                        <td>{employee.next_ahc_date ? new Date(employee.next_ahc_date).toLocaleDateString() : '-'}</td>
                        <td>{employee.last_ahc_date ? new Date(employee.last_ahc_date).toLocaleDateString() : '-'}</td>
                        <td>{employee.designation}</td>
                        <td>{employee.location}</td>
                        <td>{employee.passcode_status}</td>
                        <td>
                          <EmployeeStatusBadge status={employee.employee_status} />
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleEmployeeView(employee)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">Rows per page:</span>
                  <Select value={pageSize} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-secondary">
                    {startIndex + 1}-{Math.min(endIndex, employees.length)} of {pagination.total}
                  </span>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(pagination.page - 1)}
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
                              onClick={() => handlePageChange(pageNumber)}
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
                          onClick={() => handlePageChange(pagination.page + 1)}
                          className={pagination.page === pagination.totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <Users className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <p>No employees found</p>
              {selectedCorporate && !zohoSearchId && (
                <p className="text-sm">This corporate has no employees or they don't match the current filters</p>
              )}
              {zohoSearchId && (
                <p className="text-sm">No appointments found for Zoho ID: {zohoSearchId}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Employee Appointment History */}
      {!showEmployees && selectedEmployee && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowEmployees(true);
                      setSelectedEmployee(null);
                      setAppointments([]);
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <h3 className="section-header">
                    {selectedEmployee.name} - {selectedEmployee.emp_id}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary">
                  Corporate: {corporates?.find(c => c.id === selectedCorporate)?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : (
                    `${appointments.length} appointments`
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAppointments}
                  disabled={isLoading || appointments.length === 0}
                  title="Export appointments to CSV"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Appointment History Table */}
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading appointment history...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="crm-table">
                <thead>
                  <tr>
                    <SortableHeader column="appointment_id" onSort={appointmentsSort.handleSort} getSortIcon={appointmentsSort.getSortIcon}>
                      Appointment ID
                    </SortableHeader>
                    <th>Self/Dependent</th>
                    <th>Designation</th>
                    <SortableHeader column="requested_date" onSort={appointmentsSort.handleSort} getSortIcon={appointmentsSort.getSortIcon}>
                      Requested Date
                    </SortableHeader>
                    <SortableHeader column="appointment_date" onSort={appointmentsSort.handleSort} getSortIcon={appointmentsSort.getSortIcon}>
                      Appointment Date
                    </SortableHeader>
                    <SortableHeader column="medical_done_date" onSort={appointmentsSort.handleSort} getSortIcon={appointmentsSort.getSortIcon}>
                      Medical Done Date
                    </SortableHeader>
                    <th>Corporate Plan Details</th>
                    <th>Additional Paid Tests</th>
                    <th>Center Details</th>
                    <SortableHeader column="dc_rate" onSort={appointmentsSort.handleSort} getSortIcon={appointmentsSort.getSortIcon}>
                      DC Rate (₹)
                    </SortableHeader>
                    <th>Invoice Number</th>
                    <th>Invoice Status</th>
                    <th>Zoho ID (Invoice)</th>
                    <th>DC Bill Docket ID</th>
                    <th>DC Bill Status</th>
                    <th>Zoho ID (DC Bill)</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsSort.sortedData.map((appointment) => (
                    <tr key={appointment.appointment_id}>
                      <td className="font-medium text-text-primary">{appointment.appointment_id}</td>
                      <td>{appointment.is_dependent ? (appointment.dependent_name || 'Dependent') : 'Self'}</td>
                      <td>{appointment.designation_at_appointment}</td>
                      <td>{new Date(appointment.requested_date).toLocaleDateString()}</td>
                      <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                      <td>{new Date(appointment.medical_done_date).toLocaleDateString()}</td>
                      <td>{appointment.corporate_plan_details}</td>
                      <td>
                        {appointment.additional_tests.length > 0 
                          ? appointment.additional_tests.map(t => `${t.name} (₹${t.amount})`).join(', ')
                          : 'None'
                        }
                      </td>
                      <td>{appointment.center.name} - {appointment.center.location}</td>
                      <td>₹{appointment.dc_rate.toLocaleString()}</td>
                      <td>
                        {appointment.invoice.number ? (
                          <button 
                            className="text-primary hover:underline"
                            onClick={() => {
                              // Navigate to invoices tab with highlight
                              window.location.href = `/accounting/receivables?highlight=${appointment.invoice.number}`;
                            }}
                          >
                            {appointment.invoice.number}
                          </button>
                        ) : '-'}
                      </td>
                      <td>
                        <InvoiceStatusBadge status={appointment.invoice.status} />
                      </td>
                      <td>
                        {appointment.invoice.zoho_id ? (
                          <button 
                            className="text-primary hover:underline"
                            onClick={() => handleZohoModalOpen(appointment.invoice.zoho_id!, 'invoice')}
                          >
                            {appointment.invoice.zoho_id}
                          </button>
                        ) : '-'}
                      </td>
                      <td>
                        {appointment.dc_bill.docket_id ? (
                          <button 
                            className="text-primary hover:underline"
                            onClick={() => {
                              // Navigate to DC bills tab with highlight
                              window.location.href = `/accounting/dc-bills?highlight=${appointment.dc_bill.docket_id}`;
                            }}
                          >
                            {appointment.dc_bill.docket_id}
                          </button>
                        ) : '-'}
                      </td>
                      <td>
                        <DCBillStatusBadge status={appointment.dc_bill.status} />
                      </td>
                      <td>
                        {appointment.dc_bill.zoho_id ? (
                          <button 
                            className="text-primary hover:underline"
                            onClick={() => handleZohoModalOpen(appointment.dc_bill.zoho_id!, 'dc_bill')}
                          >
                            {appointment.dc_bill.zoho_id}
                          </button>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Summary Row */}
              <div className="p-4 border-t border-border bg-table-header">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">
                    Total Medical Done Appointments: {appointments.length}
                  </span>
                  <span className="font-semibold text-text-primary">
                    Total DC Amount: ₹{appointments.reduce((sum, apt) => sum + apt.dc_rate, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <Search className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <p>No appointments found</p>
              <p className="text-sm">This employee has no medical done appointments</p>
            </div>
          )}
        </div>
      )}

      {/* Zoho Reference Modal */}
      {showZohoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-4/5 max-w-6xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Zoho Reference: {zohoModalId} - Appointments</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowZohoModal(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="overflow-auto max-h-[60vh]">
              <table className="crm-table">
                <thead>
                  <tr>
                    <SortableHeader column="employeeName" onSort={zohoModalSort.handleSort} getSortIcon={zohoModalSort.getSortIcon}>
                      Employee Name
                    </SortableHeader>
                    <SortableHeader column="employeeId" onSort={zohoModalSort.handleSort} getSortIcon={zohoModalSort.getSortIcon}>
                      Employee ID
                    </SortableHeader>
                    <SortableHeader column="corporate" onSort={zohoModalSort.handleSort} getSortIcon={zohoModalSort.getSortIcon}>
                      Corporate
                    </SortableHeader>
                    <SortableHeader column="date" onSort={zohoModalSort.handleSort} getSortIcon={zohoModalSort.getSortIcon}>
                      Date
                    </SortableHeader>
                    <SortableHeader column="rate" onSort={zohoModalSort.handleSort} getSortIcon={zohoModalSort.getSortIcon}>
                      Rate (₹)
                    </SortableHeader>
                    <th>Service Type</th>
                  </tr>
                </thead>
                <tbody>
                  {zohoModalSort.sortedData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <button 
                          className="text-primary hover:underline"
                          onClick={() => {
                            // Navigate to employee's appointment history
                            setShowZohoModal(false);
                            // This would need proper routing implementation
                            setSelectedCorporate(item.corporateId);
                            // Then load and select the employee
                          }}
                        >
                          {item.employeeName}
                        </button>
                      </td>
                      <td>{item.employeeId}</td>
                      <td>{item.corporate}</td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>₹{item.rate.toLocaleString()}</td>
                      <td>{item.serviceType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">
                  Total Appointments: {zohoModalData.length}
                </span>
                <span className="font-semibold text-text-primary">
                  Total Amount: ₹{zohoModalData.reduce((sum, item) => sum + item.rate, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};