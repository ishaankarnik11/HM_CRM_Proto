import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Download, Printer, X } from 'lucide-react';
import { Invoice } from '../services/api';
import { InlineZohoReferenceEdit } from './ui/InlineZohoReferenceEdit';
import { mockDataService } from '../services/mockData';
import { InvoiceStatusBadge, PackageTypeBadge } from './ui/StatusBadge';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onDownload: (invoiceId: string) => void;
  onPrint: (invoiceId: string) => void;
  onUpdate?: () => void;
}

export const InvoiceViewModal = ({ 
  isOpen, 
  onClose, 
  invoice, 
  onDownload, 
  onPrint,
  onUpdate 
}: InvoiceViewModalProps) => {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice Details - {invoice.invoiceNumber}</span>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onPrint(invoice.id)}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDownload(invoice.id)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="bg-card border rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Bill From:</h3>
                <div className="text-sm text-text-secondary">
                  <p className="font-medium text-text-primary">MyHealthMeter</p>
                  <p>Health Checkup Services</p>
                  <p>Mumbai, India</p>
                  <p>GST: 27AAAAA0000A1Z5</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
                <div className="text-sm text-text-secondary">
                  <p className="font-medium text-text-primary">{invoice.corporate}</p>
                  <p>Corporate Office</p>
                  <p>Mumbai, India</p>
                  {invoice.selectedPO && (
                    <p>PO: {invoice.selectedPO.number}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-text-secondary">Invoice Number:</p>
                <p className="font-medium">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-text-secondary">Zoho Reference:</p>
                <InlineZohoReferenceEdit
                  value={invoice.zohoReference}
                  onSave={async (value) => {
                    const result = await mockDataService.updateInvoiceZohoReference(invoice.id, value);
                    if (result.success && onUpdate) {
                      onUpdate();
                    }
                    return result;
                  }}
                  placeholder="Enter Zoho reference"
                  className="mt-1"
                />
              </div>
              <div>
                <p className="text-text-secondary">Date:</p>
                <p className="font-medium">{new Date(invoice.createdDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-text-secondary">Status:</p>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Service Details</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-table-header">
                  <tr>
                    <th className="text-left p-3 font-medium">Employee</th>
                    <th className="text-left p-3 font-medium">Employee ID</th>
                    <th className="text-left p-3 font-medium">Service Date</th>
                    <th className="text-left p-3 font-medium">Service Type</th>
                    <th className="text-left p-3 font-medium">Package</th>
                    <th className="text-right p-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.appointments.map((appointment, index) => (
                    <tr key={appointment.id} className={index % 2 === 0 ? 'bg-background' : 'bg-card'}>
                      <td className="p-3">
                        <div className="font-medium">{appointment.employeeName}</div>
                      </td>
                      <td className="p-3 text-text-secondary">{appointment.employeeId}</td>
                      <td className="p-3">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                      <td className="p-3">{appointment.serviceType}</td>
                      <td className="p-3">
                        <PackageTypeBadge packageType={appointment.packageType} />
                      </td>
                      <td className="p-3 text-right font-medium">₹{appointment.serviceRate.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="font-medium">₹{invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">GST (18%):</span>
                  <span className="font-medium">₹{invoice.gstAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">₹{invoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-secondary">Created By:</p>
                <p className="font-medium">{invoice.createdBy}</p>
              </div>
              <div>
                <p className="text-text-secondary">Total Employees:</p>
                <p className="font-medium">{invoice.appointments.length}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};