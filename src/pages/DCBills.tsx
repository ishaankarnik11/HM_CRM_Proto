import { useState, useEffect, useRef } from 'react';
import { Search, Upload, FileText, Download, Edit, Trash2, Eye, Loader2, X, FileDown, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { DCBillViewModal } from '../components/DCBillViewModal';
import { DCBillEditModal } from '../components/DCBillEditModal';
import { 
  useSearchDCAppointments, 
  useDiagnosticCenters, 
  useDCBills, 
  useCreateDCBill,
  useDeleteDCBill,
  useDCBillById,
  useUpdateDCBillStatus,
  useApiError 
} from '../hooks/useAccountingAPI';
import { fileUploadService } from '../services/fileUpload';
import { exportToCSV, formatDateForCSV, formatCurrencyForCSV } from '../services/csvExport';
import { auditLogService } from '../services/auditLog';
import { ActivityLogModal } from '../components/ActivityLogModal';

interface DCAppointmentWithSelection {
  id: string;
  appointmentId: string;
  employeeName: string;
  corporate: string;
  date: string;
  rate: number;
  draftStatus: string | null;
  selected: boolean;
}

export const DCBills = () => {
  const [selectedDC, setSelectedDC] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appointments, setAppointments] = useState<DCAppointmentWithSelection[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showDockets, setShowDockets] = useState(true);
  const [dcBillsFilter, setDcBillsFilter] = useState({
    diagnosticCenter: '',
    location: '',
    status: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [amountConfirmed, setAmountConfirmed] = useState(false);
  const [comments, setComments] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [selectedDCBill, setSelectedDCBill] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { handleError } = useApiError();

  // API hooks
  const { data: diagnosticCenters, isLoading: centersLoading } = useDiagnosticCenters();
  const { 
    data: searchResults, 
    isLoading: searchLoading, 
    error: searchError,
    refetch: searchDCAppointments
  } = useSearchDCAppointments({
    diagnosticCenterId: selectedDC,
    location: selectedLocation,
    startDate,
    endDate
  });

  const { 
    data: dcBillsData, 
    isLoading: dcBillsLoading, 
    refetch: refetchDCBills
  } = useDCBills(dcBillsFilter);

  const createDCBillMutation = useCreateDCBill();
  const deleteDCBillMutation = useDeleteDCBill();
  const updateDCBillMutation = useUpdateDCBillStatus();

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
  const totalAmount = selectedAppointments.reduce((sum, apt) => sum + apt.rate, 0);

  const handleSearch = async () => {
    if (selectedDC && selectedLocation && startDate && endDate) {
      try {
        await searchDCAppointments();
        
        // Log search activity
        const dcName = diagnosticCenters?.find(dc => dc.id === selectedDC)?.name || selectedDC;
        auditLogService.logActivity(
          'SEARCH_EXECUTED',
          'DC_BILL',
          `search-${Date.now()}`,
          'DC Appointment Search',
          `Searched appointments for ${dcName} at ${selectedLocation} from ${startDate} to ${endDate}`,
          {
            diagnosticCenter: dcName,
            location: selectedLocation,
            startDate,
            endDate
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
    setAppointments(prev => 
      prev.map(apt => {
        if (apt.id === id) {
          const newSelected = !apt.selected;
          
          // Log appointment selection/deselection
          auditLogService.logActivity(
            newSelected ? 'APPOINTMENT_SELECTED' : 'APPOINTMENT_DESELECTED',
            'DC_BILL',
            apt.id,
            `${apt.employeeName} - ${apt.appointmentId}`,
            `${newSelected ? 'Selected' : 'Deselected'} appointment for ${apt.employeeName} (${apt.corporate})`,
            {
              employeeName: apt.employeeName,
              corporate: apt.corporate,
              rate: apt.rate,
              appointmentId: apt.appointmentId
            }
          );
          
          return { ...apt, selected: newSelected };
        }
        return apt;
      })
    );
  };

  const toggleSelectAll = () => {
    const allSelected = appointments.every(apt => apt.selected);
    setAppointments(prev => 
      prev.map(apt => ({ ...apt, selected: !allSelected }))
    );
  };

  const availableLocations = selectedDC ? 
    diagnosticCenters?.find(dc => dc.id === selectedDC)?.locations || [] : [];

  const filteredDCBills = dcBillsData?.dcBills || [];

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFilesAdded(Array.from(files));
    }
  };

  const handleFilesAdded = (files: File[]) => {
    const validFiles: File[] = [];
    
    files.forEach(file => {
      const validation = fileUploadService.validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive"
        });
      }
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFilesAdded(files);
  };

  // DC Bill action handlers
  const handleViewDocket = (docketId: string) => {
    const docket = filteredDCBills.find(d => d.id === docketId);
    if (docket) {
      auditLogService.logActivity(
        'DOCKET_VIEWED',
        'DC_BILL',
        docket.id,
        docket.docketNumber,
        `Viewed docket ${docket.docketNumber} for ${docket.diagnosticCenter}`,
        {
          diagnosticCenter: docket.diagnosticCenter,
          location: docket.location,
          status: docket.status,
          amount: docket.totalAmount
        }
      );
      
      setSelectedDCBill(docket);
      setShowViewModal(true);
    }
  };

  const handleEditDocket = (docketId: string) => {
    const docket = filteredDCBills.find(d => d.id === docketId);
    if (docket) {
      auditLogService.logActivity(
        'DOCKET_EDITED',
        'DC_BILL',
        docket.id,
        docket.docketNumber,
        `Opened docket ${docket.docketNumber} for editing`,
        {
          diagnosticCenter: docket.diagnosticCenter,
          location: docket.location,
          status: docket.status,
          amount: docket.totalAmount
        }
      );
      
      setSelectedDCBill(docket);
      setShowEditModal(true);
    }
  };

  const handleDeleteDocket = async (docketId: string) => {
    try {
      const docket = filteredDCBills.find(d => d.id === docketId);
      const confirmed = window.confirm('Are you sure you want to delete this docket?');
      if (!confirmed) return;
      
      await deleteDCBillMutation.mutateAsync(docketId);
      
      // Log deletion activity
      auditLogService.logActivity(
        'DOCKET_DELETED',
        'DC_BILL',
        docketId,
        docket?.docketNumber || `Docket ${docketId}`,
        `Deleted docket ${docket?.docketNumber || docketId} for ${docket?.diagnosticCenter || 'Unknown DC'}`,
        {
          diagnosticCenter: docket?.diagnosticCenter,
          location: docket?.location,
          status: docket?.status,
          amount: docket?.totalAmount
        }
      );
      
      toast({
        title: "Delete Docket",
        description: `Docket ${docketId} deleted successfully`,
        variant: "default"
      });
      refetchDCBills();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: handleError(error),
        variant: "destructive"
      });
    }
  };

  const handleDownloadDocket = (docketId: string) => {
    const docket = filteredDCBills.find(d => d.id === docketId);
    
    // Log download activity
    auditLogService.logActivity(
      'PDF_DOWNLOADED',
      'DC_BILL',
      docketId,
      docket?.docketNumber || `Docket ${docketId}`,
      `Downloaded docket ${docket?.docketNumber || docketId} PDF`,
      {
        diagnosticCenter: docket?.diagnosticCenter,
        location: docket?.location,
        status: docket?.status,
        amount: docket?.totalAmount
      }
    );
    
    // TODO: Implement actual download from backend
    toast({
      title: "Download Docket",
      description: `Downloading docket ${docketId}`,
      variant: "default"
    });
  };

  const handlePrintDocket = (docketId: string) => {
    const docket = filteredDCBills.find(d => d.id === docketId);
    
    // Log print activity
    auditLogService.logActivity(
      'PDF_PRINTED',
      'DC_BILL',
      docketId,
      docket?.docketNumber || `Docket ${docketId}`,
      `Printed docket ${docket?.docketNumber || docketId}`,
      {
        diagnosticCenter: docket?.diagnosticCenter,
        location: docket?.location,
        status: docket?.status,
        amount: docket?.totalAmount
      }
    );
    
    // TODO: Implement actual print functionality
    toast({
      title: "Print Docket",
      description: `Printing docket ${docketId}`,
      variant: "default"
    });
  };

  const handleViewActivityLog = (docketId: string) => {
    const docket = filteredDCBills.find(d => d.id === docketId);
    if (docket) {
      setSelectedDCBill(docket);
      setShowActivityLogModal(true);
    }
  };

  const handleSaveDCBill = async (updatedBill: any) => {
    try {
      // Update the status if it has changed
      if (updatedBill.status !== selectedDCBill?.status) {
        await updateDCBillMutation.mutateAsync({
          billId: updatedBill.id,
          status: updatedBill.status
        });
        
        // Log status change
        auditLogService.logActivity(
          'DOCKET_STATUS_CHANGED',
          'DC_BILL',
          updatedBill.id,
          updatedBill.docketNumber,
          `Changed status from ${selectedDCBill?.status} to ${updatedBill.status}`,
          {
            fromStatus: selectedDCBill?.status,
            toStatus: updatedBill.status,
            diagnosticCenter: updatedBill.diagnosticCenter,
            location: updatedBill.location,
            amount: updatedBill.totalAmount
          }
        );
      }
      
      toast({
        title: "DC Bill Updated",
        description: `Docket ${updatedBill.docketNumber} has been updated successfully`,
        variant: "default"
      });
      
      // Refresh the DC bills list
      refetchDCBills();
      
      // Close the modal
      setShowEditModal(false);
      setSelectedDCBill(null);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: handleError(error),
        variant: "destructive"
      });
    }
  };

  const handleExportDCBills = () => {
    try {
      if (filteredDCBills.length === 0) {
        toast({
          title: "No Data to Export",
          description: "No DC bills found with the current filters",
          variant: "destructive"
        });
        return;
      }

      const columnMapping = {
        'docketNumber': 'Docket Number',
        'status': 'Status',
        'diagnosticCenter': 'DC',
        'location': 'Location',
        'period': 'Period',
        'appointmentCount': 'Count',
        'totalAmount': 'Amount (₹)',
        'createdDate': 'Created Date'
      };

      // Transform data for CSV export
      const exportData = filteredDCBills.map(dcBill => ({
        ...dcBill,
        createdDate: formatDateForCSV(dcBill.createdDate),
        totalAmount: formatCurrencyForCSV(dcBill.totalAmount)
      }));

      exportToCSV(exportData, 'dc_bills', columnMapping);
      
      // Log export activity
      auditLogService.logActivity(
        'DOCKET_EXPORTED',
        'DC_BILL',
        `export-${Date.now()}`,
        'DC Bill Export',
        `Exported ${filteredDCBills.length} DC bills to CSV`,
        {
          exportCount: filteredDCBills.length,
          filters: dcBillsFilter
        }
      );
      
      toast({
        title: "Export Successful",
        description: `${filteredDCBills.length} DC bills exported to CSV`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export DC bills to CSV",
        variant: "destructive"
      });
    }
  };

  const handleSubmitBill = async (isDraft: boolean = false) => {
    if (selectedAppointments.length === 0) {
      toast({
        title: "No Appointments Selected",
        description: "Please select at least one appointment",
        variant: "destructive"
      });
      return;
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload at least one bill file",
        variant: "destructive"
      });
      return;
    }

    if (!isDraft && !amountConfirmed) {
      toast({
        title: "Amount Confirmation Required",
        description: "Please confirm that the system total matches your bill amount",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('diagnosticCenterId', selectedDC);
      formData.append('location', selectedLocation);
      formData.append('appointmentIds', JSON.stringify(selectedAppointments.map(apt => apt.id)));
      formData.append('totalAmount', totalAmount.toString());
      formData.append('status', isDraft ? 'DRAFT' : 'SUBMITTED');
      formData.append('createdBy', 'current-user'); // TODO: Get from auth context
      formData.append('comments', comments);

      uploadedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const result = await createDCBillMutation.mutateAsync(formData);
      
      // Log DC bill creation
      const dcName = diagnosticCenters?.find(dc => dc.id === selectedDC)?.name || selectedDC;
      auditLogService.logActivity(
        isDraft ? 'DOCKET_DRAFT_CREATED' : 'DOCKET_SUBMITTED',
        'DC_BILL',
        result?.id || `dcb-${Date.now()}`,
        result?.docketNumber || 'New DC Bill',
        `${isDraft ? 'Created draft' : 'Submitted'} DC bill for ${dcName} at ${selectedLocation} (₹${totalAmount.toLocaleString()})`,
        {
          diagnosticCenter: dcName,
          location: selectedLocation,
          appointmentCount: selectedAppointments.length,
          totalAmount,
          status: isDraft ? 'DRAFT' : 'SUBMITTED',
          fileCount: uploadedFiles.length,
          comments: comments || undefined
        }
      );
      
      // Log comments if added
      if (comments.trim()) {
        auditLogService.logActivity(
          'COMMENTS_ADDED',
          'DC_BILL',
          result?.id || `dcb-${Date.now()}`,
          result?.docketNumber || 'New DC Bill',
          `Added comments: ${comments.substring(0, 100)}${comments.length > 100 ? '...' : ''}`,
          {
            commentLength: comments.length,
            diagnosticCenter: dcName,
            location: selectedLocation
          }
        );
      }
      
      // Log file uploads
      uploadedFiles.forEach((file, index) => {
        auditLogService.logActivity(
          'BILL_FILE_UPLOADED',
          'DC_BILL',
          result?.id || `dcb-${Date.now()}`,
          result?.docketNumber || 'New DC Bill',
          `Uploaded file: ${file.name}`,
          {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            diagnosticCenter: dcName,
            location: selectedLocation
          }
        );
      });
      
      toast({
        title: isDraft ? "Draft Saved" : "Bill Submitted",
        description: `DC Bill has been ${isDraft ? 'saved as draft' : 'submitted'} successfully`,
        variant: "default"
      });

      // Reset form
      setUploadedFiles([]);
      setAmountConfirmed(false);
      setComments('');
      setAppointments(prev => prev.map(apt => ({ ...apt, selected: false })));
      refetchDCBills();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: handleError(error),
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>

      {/* Filter Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6 overflow-visible">
        <h2 className="section-header mb-4">Search Appointments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 relative">
          <div className="relative z-10">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Diagnostic Center <span className="text-destructive">*</span>
            </label>
            <Select value={selectedDC} onValueChange={setSelectedDC}>
              <SelectTrigger>
                <SelectValue placeholder="Select DC" />
              </SelectTrigger>
              <SelectContent>
                {centersLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  diagnosticCenters?.map(dc => (
                    <SelectItem key={dc.id} value={dc.id}>
                      {dc.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative z-10">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Location <span className="text-destructive">*</span>
            </label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled={!selectedDC}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {availableLocations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
          
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={!selectedDC || !selectedLocation || !startDate || !endDate || searchLoading}
              className="w-full"
            >
              {searchLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Search Appointments
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center">
              <h3 className="section-header">Available Appointments</h3>
              {selectedAppointments.length > 0 && (
                <div className="text-sm">
                  <span className="text-text-secondary">Selected: </span>
                  <span className="font-semibold text-text-primary">{selectedAppointments.length} appointments</span>
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
                  <th>Appointment ID</th>
                  <th>Employee</th>
                  <th>Corporate</th>
                  <th>Date</th>
                  <th>Rate (₹)</th>
                  <th>Draft Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className={appointment.selected ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={appointment.selected || false}
                        onChange={() => toggleAppointmentSelection(appointment.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td>{appointment.appointmentId}</td>
                    <td>
                      <div className="font-medium text-text-primary">{appointment.employeeName}</div>
                    </td>
                    <td>{appointment.corporate}</td>
                    <td>{appointment.date}</td>
                    <td>₹{appointment.rate.toLocaleString()}</td>
                    <td>
                      {appointment.draftStatus ? (
                        <span className="badge-draft">{appointment.draftStatus}</span>
                      ) : (
                        <span className="badge-medical-done">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {selectedAppointments.length > 0 && (
            <div className="p-4 border-t border-border bg-table-header">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-text-secondary">
                    {selectedAppointments.length} appointments selected
                  </div>
                  <div className="text-sm font-medium">
                    System Total: ₹{totalAmount.toLocaleString()}
                  </div>
                </div>
                
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-secondary mb-1">
                    Drag and drop your bill file here, or <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-text-muted">PDF, PNG, JPEG up to 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-text-primary">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-text-muted" />
                          <span className="text-sm text-text-primary">{file.name}</span>
                          <span className="text-xs text-text-secondary">
                            ({fileUploadService.formatFileSize(file.size)})
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleFileRemove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="comments" className="block text-sm font-medium text-text-primary">
                    Comments
                  </label>
                  <Textarea
                    id="comments"
                    placeholder="Add any comments or notes about this DC bill..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="confirm-amount"
                    checked={amountConfirmed}
                    onChange={(e) => {
                      setAmountConfirmed(e.target.checked);
                      
                      // Log amount confirmation
                      if (e.target.checked) {
                        const dcName = diagnosticCenters?.find(dc => dc.id === selectedDC)?.name || selectedDC;
                        auditLogService.logActivity(
                          'AMOUNT_CONFIRMED',
                          'DC_BILL',
                          `amount-${Date.now()}`,
                          'Amount Confirmation',
                          `Confirmed system total matches bill amount (₹${totalAmount.toLocaleString()})`,
                          {
                            amount: totalAmount,
                            diagnosticCenter: dcName,
                            location: selectedLocation,
                            appointmentCount: selectedAppointments.length
                          }
                        );
                      }
                    }}
                    className="rounded border-border"
                  />
                  <label htmlFor="confirm-amount" className="text-sm text-text-secondary">
                    I confirm the system total matches my bill amount
                  </label>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => handleSubmitBill(true)}
                    disabled={isUploading || createDCBillMutation.isPending}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save as Draft
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary-hover"
                    onClick={() => handleSubmitBill(false)}
                    disabled={isUploading || createDCBillMutation.isPending}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Submit Bill
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dockets Management */}
      {showDockets && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center">
              <h3 className="section-header">Payment Dockets</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">
                  {dcBillsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : (
                    `${filteredDCBills.length} dockets`
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportDCBills}
                  disabled={dcBillsLoading || filteredDCBills.length === 0}
                  title="Export filtered DC bills to CSV"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* DC Bills Filters */}
          <div className="p-4 border-b border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Diagnostic Center</label>
                <Input
                  placeholder="Search by DC"
                  value={dcBillsFilter.diagnosticCenter}
                  onChange={(e) => setDcBillsFilter(prev => ({ ...prev, diagnosticCenter: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
                <Input
                  placeholder="Search by location"
                  value={dcBillsFilter.location}
                  onChange={(e) => setDcBillsFilter(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                <Select value={dcBillsFilter.status} onValueChange={(value) => setDcBillsFilter(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="DISPUTED">Dispute bill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Dockets Table */}
          {dcBillsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading dockets...</p>
            </div>
          ) : filteredDCBills.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Docket Number</th>
                    <th>Status</th>
                    <th>DC</th>
                    <th>Location</th>
                    <th>Period</th>
                    <th>Count</th>
                    <th>Amount (₹)</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDCBills.map((docket) => (
                    <tr key={docket.id}>
                      <td className="font-medium text-primary">{docket.docketNumber}</td>
                      <td>
                        <span className={`badge-${docket.status.toLowerCase()}`}>
                          {docket.status}
                        </span>
                      </td>
                      <td>{docket.diagnosticCenter}</td>
                      <td>{docket.location}</td>
                      <td>{docket.period}</td>
                      <td>{docket.appointmentCount}</td>
                      <td>₹{docket.totalAmount.toLocaleString()}</td>
                      <td>{new Date(docket.createdDate).toLocaleDateString()}</td>
                      <td>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDocket(docket.id)}
                            title="View Docket"
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {docket.status === 'DRAFT' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleEditDocket(docket.id);
                                }}
                                title="Edit Docket"
                                type="button"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteDocket(docket.id);
                                }}
                                title="Delete Docket"
                                type="button"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDownloadDocket(docket.id);
                            }}
                            title="Download Docket"
                            type="button"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewActivityLog(docket.id);
                            }}
                            title="Activity Log"
                            type="button"
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
              <p>No dockets found</p>
              <p className="text-sm">Create your first docket by selecting appointments and uploading a bill above</p>
            </div>
          )}
        </div>
      )}

      {/* DC Bill View Modal */}
      <DCBillViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedDCBill(null);
        }}
        dcBill={selectedDCBill}
        onDownload={handleDownloadDocket}
        onPrint={handlePrintDocket}
      />

      {/* DC Bill Edit Modal */}
      <DCBillEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDCBill(null);
        }}
        dcBill={selectedDCBill}
        onSave={handleSaveDCBill}
      />

      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={showActivityLogModal}
        onClose={() => {
          setShowActivityLogModal(false);
          setSelectedDCBill(null);
        }}
        entityType="DC_BILL"
        entityId={selectedDCBill?.id || ''}
        entityName={selectedDCBill?.docketNumber || ''}
      />
    </div>
  );
};