import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X, Save, Upload, Trash2 } from 'lucide-react';

interface DCBillEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dcBill: any; // TODO: Add proper type
  onSave: (updatedBill: any) => void;
}

export const DCBillEditModal = ({
  isOpen,
  onClose,
  dcBill,
  onSave
}: DCBillEditModalProps) => {
  const [formData, setFormData] = useState({
    docketNumber: '',
    diagnosticCenter: '',
    location: '',
    status: 'DRAFT',
    totalAmount: 0,
    appointmentCount: 0,
    serviceType: '',
    remarks: '',
    fileName: '',
    period: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (dcBill) {
      setFormData({
        docketNumber: dcBill.docketNumber || '',
        diagnosticCenter: dcBill.diagnosticCenter || '',
        location: dcBill.location || '',
        status: dcBill.status || 'DRAFT',
        totalAmount: dcBill.totalAmount || 0,
        appointmentCount: dcBill.appointmentCount || 0,
        serviceType: dcBill.serviceType || '',
        remarks: dcBill.remarks || '',
        fileName: dcBill.fileName || '',
        period: dcBill.period || ''
      });
    }
  }, [dcBill]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedBill = {
        ...dcBill,
        ...formData,
        // Add uploaded files if any
        ...(uploadedFiles.length > 0 && { uploadedFiles })
      };
      
      await onSave(updatedBill);
      onClose();
    } catch (error) {
      console.error('Error saving DC bill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'DISPUTED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!dcBill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold">Edit DC Bill</DialogTitle>
              <DialogDescription>
                Edit details for docket: {dcBill.docketNumber}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="docketNumber">Docket Number</Label>
              <Input
                id="docketNumber"
                value={formData.docketNumber}
                onChange={(e) => handleInputChange('docketNumber', e.target.value)}
                placeholder="Enter docket number"
                disabled // Usually docket numbers are not editable
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="DISPUTED">Dispute bill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Diagnostic Center Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="diagnosticCenter">Diagnostic Center</Label>
              <Input
                id="diagnosticCenter"
                value={formData.diagnosticCenter}
                onChange={(e) => handleInputChange('diagnosticCenter', e.target.value)}
                placeholder="Enter diagnostic center name"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AHC">Annual Health Checkup</SelectItem>
                  <SelectItem value="PEC">Pre-Employment Checkup</SelectItem>
                  <SelectItem value="OPD">OPD Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="appointmentCount">Appointment Count</Label>
              <Input
                id="appointmentCount"
                type="number"
                value={formData.appointmentCount}
                onChange={(e) => handleInputChange('appointmentCount', parseInt(e.target.value) || 0)}
                placeholder="Enter appointment count"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="totalAmount">Total Amount (₹)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                placeholder="Enter total amount"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Period */}
          <div>
            <Label htmlFor="period">Period</Label>
            <Input
              id="period"
              value={formData.period}
              onChange={(e) => handleInputChange('period', e.target.value)}
              placeholder="Enter period (e.g., 2025-01-01 - 2025-01-31)"
            />
          </div>

          {/* Current File */}
          {formData.fileName && (
            <div>
              <Label>Current File</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <span className="text-sm">{formData.fileName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleInputChange('fileName', '')}
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <Label htmlFor="fileUpload">Upload New File (Optional)</Label>
            <div className="mt-2">
              <Input
                id="fileUpload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploadedFiles.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {uploadedFiles.map(f => f.name).join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          {dcBill.appointments && dcBill.appointments.length > 0 && (
            <div>
              <Label>Appointment Details</Label>
              <div className="border rounded-lg overflow-hidden bg-gray-50 mt-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3 font-medium">Employee</th>
                        <th className="text-left p-3 font-medium">Employee ID</th>
                        <th className="text-left p-3 font-medium">Corporate</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Rate (₹)</th>
                        <th className="text-left p-3 font-medium">Service Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dcBill.appointments.map((appointment: any, index: number) => (
                        <tr key={appointment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-3">{appointment.employeeName}</td>
                          <td className="p-3">{appointment.employeeId}</td>
                          <td className="p-3">{appointment.corporate}</td>
                          <td className="p-3">{appointment.appointmentDate}</td>
                          <td className="p-3">₹{appointment.serviceRate?.toLocaleString()}</td>
                          <td className="p-3">{appointment.serviceType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              placeholder="Enter any additional remarks"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary hover:bg-primary-hover"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};