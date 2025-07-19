import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Download, Printer, X } from 'lucide-react';
import { Badge } from './ui/badge';

interface DCBillViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dcBill: any; // TODO: Add proper type
  onDownload: (billId: string) => void;
  onPrint: (billId: string) => void;
}

export const DCBillViewModal = ({
  isOpen,
  onClose,
  dcBill,
  onDownload,
  onPrint
}: DCBillViewModalProps) => {
  if (!dcBill) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold">DC Bill Details</DialogTitle>
              <DialogDescription>
                Docket Number: {dcBill.docketNumber}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPrint(dcBill.id)}
                title="Print DC Bill"
              >
                <Printer className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(dcBill.id)}
                title="Download DC Bill"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* DC Bill Header */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Diagnostic Center Details</h3>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Name:</span> {dcBill.diagnosticCenter}</p>
                <p className="text-sm"><span className="font-medium">Location:</span> {dcBill.location}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-lg mb-2">Bill Information</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <Badge className={getStatusColor(dcBill.status)}>
                    {dcBill.status}
                  </Badge>
                </p>
                <p className="text-sm"><span className="font-medium">Created Date:</span> {new Date(dcBill.createdDate).toLocaleDateString()}</p>
                <p className="text-sm"><span className="font-medium">Period:</span> {dcBill.period}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Service Details</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Service Type</p>
                  <p className="text-lg font-semibold">{dcBill.serviceType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Number of Appointments</p>
                  <p className="text-lg font-semibold">{dcBill.appointmentCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold">₹{dcBill.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {dcBill.fileName && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Uploaded Files</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{dcBill.fileName}</span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => onDownload(dcBill.id)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Details */}
          {dcBill.appointments && dcBill.appointments.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Appointment Details</h3>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
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

          {/* Additional Information */}
          {dcBill.remarks && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Remarks</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm">{dcBill.remarks}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Uploaded by: {dcBill.uploadedBy || 'N/A'} on {dcBill.uploadDate ? new Date(dcBill.uploadDate).toLocaleDateString() : 'N/A'}
              </p>
              <div className="flex gap-2">
                <Button variant="default" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};