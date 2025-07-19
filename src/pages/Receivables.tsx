import { useState, useEffect } from 'react';
import { Calendar, Search, Download, Eye, Printer, FileText, Filter, Loader2, FileDown, Activity } from 'lucide-react';
import { ProFormaInvoiceModal } from '../components/ProFormaInvoiceModal';
import { InvoiceViewModal } from '../components/InvoiceViewModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { 
  useSearchAppointments, 
  useCorporates, 
  useEntities,
  useLocations,
  useInvoices, 
  useCreateInvoice,
  useApiError 
} from '../hooks/useAccountingAPI';
import { exportToCSV, formatDateForCSV, formatCurrencyForCSV } from '../services/csvExport';
import { auditLogService } from '../services/auditLog';
import { ActivityLogModal } from '../components/ActivityLogModal';

const serviceTypes = [
  { id: 'AHC', name: 'Annual Health Checkup' },
  { id: 'PEC', name: 'Pre-Employment Checkup' },
  { id: 'OPD', name: 'OPD Services' }
];

interface AppointmentWithSelection {
  id: string;
  employeeName: string;
  employeeId: string;
  corporate: string;
  corporateId: string;
  appointmentDate: string;
  serviceRate: number;
  packageType: 'AHC' | 'PEC' | 'OPD';
  serviceType: string;
  status: string;
  age?: number;
  gender?: 'M' | 'F';
  selected: boolean;
}

export const Receivables = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCorporate, setSelectedCorporate] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [appointments, setAppointments] = useState<AppointmentWithSelection[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceFilter, setInvoiceFilter] = useState({
    corporate: '',
    entity: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  const { toast } = useToast();
  const { handleError } = useApiError();

  // API hooks
  const { data: corporates, isLoading: corporatesLoading } = useCorporates();
  const { data: entities, isLoading: entitiesLoading } = useEntities(selectedCorporate);
  const { data: locations, isLoading: locationsLoading } = useLocations(selectedEntity, selectedCorporate);
  const { 
    data: searchResults, 
    isLoading: searchLoading, 
    error: searchError,
    refetch: searchAppointments
  } = useSearchAppointments({
    startDate,
    endDate,
    corporateId: selectedCorporate,
    serviceType: selectedServiceType
  });

  const { 
    data: invoicesData, 
    isLoading: invoicesLoading, 
    refetch: refetchInvoices
  } = useInvoices(invoiceFilter);

  const createInvoiceMutation = useCreateInvoice();

  // Reset dependent selections when parent changes
  const handleCorporateChange = (corporateId: string) => {
    setSelectedCorporate(corporateId);
    setSelectedEntity('');
    setSelectedLocation('');
  };

  const handleEntityChange = (entityId: string) => {
    setSelectedEntity(entityId);
    setSelectedLocation('');
  };

  // Update appointments when search results change
  useEffect(() => {
    if (searchResults) {
      setAppointments(searchResults.map(apt => ({
        ...apt,
        selected: false
      })));
      setShowResults(true);
    }
  }, [searchResults]);

  // Handle search error
  useEffect(() => {
    if (searchError) {
      toast({
        title: "Search Error",
        description: handleError(searchError),
        variant: "destructive"
      });
    }
  }, [searchError, handleError, toast]);

  const selectedAppointments = appointments.filter(apt => apt.selected);
  const totalAmount = selectedAppointments.reduce((sum, apt) => sum + apt.serviceRate, 0);

  const handleSearch = async () => {
    if (startDate && endDate && selectedCorporate) {
      try {
        await searchAppointments();
        
        // Log search activity
        auditLogService.logActivity(
          'SEARCH_EXECUTED',
          'APPOINTMENT',
          `search-${Date.now()}`,
          'Appointment Search',
          `Searched appointments for ${corporates?.find(c => c.id === selectedCorporate)?.name} from ${startDate} to ${endDate}`,
          { 
            corporate: selectedCorporate,
            startDate,
            endDate,
            serviceType: selectedServiceType
          }
        );
      } catch (error) {
        toast({
          title: "Search Failed",
          description: handleError(error),
          variant: "destructive"
        });
      }
    }
  };

  const toggleAppointmentSelection = (id: string) => {
    setAppointments(prev => {
      const updated = prev.map(apt => {
        if (apt.id === id) {
          const newSelected = !apt.selected;
          
          // Log appointment selection/deselection
          auditLogService.logActivity(
            newSelected ? 'APPOINTMENT_SELECTED' : 'APPOINTMENT_DESELECTED',
            'APPOINTMENT',
            apt.id,
            `${apt.employeeName} - ${apt.appointmentId}`,
            `${newSelected ? 'Selected' : 'Deselected'} appointment for ${apt.employeeName} (${apt.corporate})`,
            { 
              employeeName: apt.employeeName,
              corporate: apt.corporate,
              rate: apt.serviceRate,
              appointmentId: apt.appointmentId
            }
          );
          
          return { ...apt, selected: newSelected };
        }
        return apt;
      });
      
      return updated;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = appointments.every(apt => apt.selected);
    setAppointments(prev => 
      prev.map(apt => ({ ...apt, selected: !allSelected }))
    );
  };

  const handleSaveInvoice = async (invoiceData: any) => {
    try {
      const selectedCorporateData = corporates?.find(corp => corp.id === selectedCorporate);
      
      const invoicePayload = {
        corporate: selectedCorporateData?.name || '',
        corporateId: selectedCorporate,
        selectedPO: invoiceData.selectedPO,
        appointmentIds: selectedAppointments.map(apt => apt.id),
        subtotal: invoiceData.subtotal,
        gstAmount: invoiceData.gstAmount,
        total: invoiceData.total,
        createdBy: 'current-user' // TODO: Get from auth context
      };

      const createdInvoice = await createInvoiceMutation.mutateAsync(invoicePayload);
      
      // Log invoice creation
      auditLogService.logActivity(
        'INVOICE_DRAFT_CREATED',
        'INVOICE',
        createdInvoice.id || `inv-${Date.now()}`,
        invoiceData.invoiceNumber || 'New Invoice',
        `Created invoice for ${selectedCorporateData?.name} with ${selectedAppointments.length} appointments (₹${invoiceData.total.toLocaleString()})`,
        {
          corporate: selectedCorporateData?.name,
          appointmentCount: selectedAppointments.length,
          totalAmount: invoiceData.total,
          poNumber: invoiceData.selectedPO?.number
        }
      );
      
      toast({
        title: "Invoice Created",
        description: "Pro-forma invoice has been created successfully",
        variant: "default"
      });

      // Reset selections and close modal
      setAppointments(prev => prev.map(apt => ({ ...apt, selected: false })));
      setShowInvoiceModal(false);
      
      // Refresh invoices list
      refetchInvoices();
    } catch (error) {
      toast({
        title: "Invoice Creation Failed",
        description: handleError(error),
        variant: "destructive"
      });
    }
  };

  const filteredInvoices = invoicesData?.invoices || [];

  // Invoice action handlers
  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      // TODO: Implement actual PDF download from backend
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download invoice PDF",
        variant: "destructive"
      });
    }
  };

  const handlePrintInvoice = async (invoiceId: string) => {
    try {
      // TODO: Implement actual PDF print from backend
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      toast({
        title: "Print Failed",
        description: "Failed to print invoice",
        variant: "destructive"
      });
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = filteredInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowViewModal(true);
    }
  };

  const handleViewActivityLog = (invoiceId: string) => {
    const invoice = filteredInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowActivityLogModal(true);
    }
  };

  const handleExportInvoices = () => {
    try {
      if (filteredInvoices.length === 0) {
        toast({
          title: "No Data to Export",
          description: "No invoices found with the current filters",
          variant: "destructive"
        });
        return;
      }

      const columnMapping = {
        'invoiceNumber': 'Invoice Number',
        'corporate': 'Corporate',
        'selectedPO.number': 'PO Number',
        'createdDate': 'Created Date',
        'appointmentCount': 'Employees',
        'total': 'Amount (₹)'
      };

      // Transform data for CSV export
      const exportData = filteredInvoices.map(invoice => ({
        ...invoice,
        createdDate: formatDateForCSV(invoice.createdDate),
        total: formatCurrencyForCSV(invoice.total),
        appointmentCount: invoice.appointments.length,
        'selectedPO.number': invoice.selectedPO?.number || 'N/A'
      }));

      exportToCSV(exportData, 'invoices', columnMapping);
      
      // Log export activity
      auditLogService.logActivity(
        'INVOICE_EXPORTED',
        'INVOICE',
        `export-${Date.now()}`,
        'Invoice Export',
        `Exported ${filteredInvoices.length} invoices to CSV`,
        {
          exportCount: filteredInvoices.length,
          filters: invoiceFilter
        }
      );
      
      toast({
        title: "Export Successful",
        description: `${filteredInvoices.length} invoices exported to CSV`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export invoices to CSV",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="section-header mb-4">Search Medical Done Appointments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Start Date <span className="text-destructive">*</span>
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              End Date <span className="text-destructive">*</span>
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Corporate <span className="text-destructive">*</span>
            </label>
            <Select value={selectedCorporate} onValueChange={handleCorporateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Corporate" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Entity
            </label>
            <Select value={selectedEntity} onValueChange={handleEntityChange} disabled={!selectedCorporate}>
              <SelectTrigger>
                <SelectValue placeholder="Select Entity" />
              </SelectTrigger>
              <SelectContent>
                {entitiesLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  entities?.map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Location
            </label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled={!selectedEntity}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locationsLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  locations?.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Service Type
            </label>
            <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="All Service Types" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map(serviceType => (
                  <SelectItem key={serviceType.id} value={serviceType.id}>
                    {serviceType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSearch}
            disabled={!startDate || !endDate || !selectedCorporate || searchLoading}
            className="w-full md:w-auto"
          >
            {searchLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Search Clients
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center">
              <h3 className="section-header">Medical Done Appointments</h3>
              {selectedAppointments.length > 0 && (
                <div className="text-sm">
                  <span className="text-text-secondary">Selected: </span>
                  <span className="font-semibold text-text-primary">{selectedAppointments.length} employees</span>
                  <span className="text-text-secondary"> | Total: </span>
                  <span className="font-semibold text-primary">₹{totalAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead>
                <tr>
                  <th className="w-12">
                    <input
                      type="checkbox"
                      checked={appointments.length > 0 && appointments.every(apt => apt.selected)}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th>Sl No</th>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Corporate</th>
                  <th>Appointment Date</th>
                  <th>Service Type</th>
                  <th>Service Rate (₹)</th>
                  <th>Package Type</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr
                    key={appointment.id}
                    className={appointment.selected ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={appointment.selected}
                        onChange={() => toggleAppointmentSelection(appointment.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      <div>
                        <div className="font-medium text-text-primary">{appointment.employeeName}</div>
                        <div className="text-xs text-text-secondary">{appointment.employeeId}</div>
                      </div>
                    </td>
                    <td>{appointment.employeeId}</td>
                    <td>
                      <div className="text-xs text-text-secondary">{appointment.corporate}</div>
                    </td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>
                      <div className="font-medium text-text-primary">{appointment.serviceType}</div>
                    </td>
                    <td>₹{appointment.serviceRate.toLocaleString()}</td>
                    <td>
                      <span className={`badge-${appointment.packageType.toLowerCase()}`}>
                        {appointment.packageType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {selectedAppointments.length > 0 && (
            <div className="p-4 border-t border-border bg-table-header">
              <div className="flex justify-between items-center">
                <div className="text-sm text-text-secondary">
                  {selectedAppointments.length} appointments selected
                </div>
                <Button 
                  className="bg-primary hover:bg-primary-hover"
                  onClick={() => setShowInvoiceModal(true)}
                  disabled={createInvoiceMutation.isPending}
                >
                  {createInvoiceMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  Generate Pro-Forma Invoice
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved Invoices Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-header">Saved Pro-Forma Invoices</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">
              {invoicesLoading ? (
                <Loader2 className="w-4 h-4 animate-spin inline" />
              ) : (
                `${filteredInvoices.length} invoices saved`
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportInvoices}
              disabled={invoicesLoading || filteredInvoices.length === 0}
              title="Export filtered invoices to CSV"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Invoice Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Corporate</label>
            <Input
              placeholder="Search by corporate"
              value={invoiceFilter.corporate}
              onChange={(e) => setInvoiceFilter(prev => ({ ...prev, corporate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Entity</label>
            <Input
              placeholder="Search by entity"
              value={invoiceFilter.entity}
              onChange={(e) => setInvoiceFilter(prev => ({ ...prev, entity: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
            <Input
              placeholder="Search by location"
              value={invoiceFilter.location}
              onChange={(e) => setInvoiceFilter(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">From Date</label>
            <Input
              type="date"
              value={invoiceFilter.startDate}
              onChange={(e) => setInvoiceFilter(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">To Date</label>
            <Input
              type="date"
              value={invoiceFilter.endDate}
              onChange={(e) => setInvoiceFilter(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>

        {/* Invoices Table */}
        {invoicesLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Corporate</th>
                  <th>PO Number</th>
                  <th>Created Date</th>
                  <th>Employees</th>
                  <th>Amount (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <div className="font-medium text-text-primary">{invoice.invoiceNumber}</div>
                    </td>
                    <td>{invoice.corporate}</td>
                    <td>{invoice.selectedPO?.number || 'N/A'}</td>
                    <td>{new Date(invoice.createdDate).toLocaleDateString()}</td>
                    <td>{invoice.appointments.length}</td>
                    <td>₹{invoice.total.toLocaleString()}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.id)}
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePrintInvoice(invoice.id)}
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewActivityLog(invoice.id)}
                          title="Activity Log"
                        >
                          <Activity className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            <FileText className="w-12 h-12 mx-auto mb-4 text-text-muted" />
            <p>No saved invoices found</p>
            <p className="text-sm">Create your first pro-forma invoice from medical done appointments above</p>
          </div>
        )}
      </div>

      {/* Pro-Forma Invoice Modal */}
      <ProFormaInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        selectedAppointments={selectedAppointments}
        corporate={corporates?.find(corp => corp.id === selectedCorporate)?.name || ''}
        corporateId={selectedCorporate}
        onSave={handleSaveInvoice}
      />

      {/* Invoice View Modal */}
      <InvoiceViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onDownload={handleDownloadInvoice}
        onPrint={handlePrintInvoice}
      />

      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={showActivityLogModal}
        onClose={() => {
          setShowActivityLogModal(false);
          setSelectedInvoice(null);
        }}
        entityType="INVOICE"
        entityId={selectedInvoice?.id || ''}
        entityName={selectedInvoice?.invoiceNumber || ''}
      />
    </div>
  );
};