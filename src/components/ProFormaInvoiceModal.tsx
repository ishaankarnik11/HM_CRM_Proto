import { useState, useEffect } from 'react';
import { X, Printer, Download, Save, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { usePurchaseOrders } from '../hooks/useAccountingAPI';
import { auditLogService } from '../services/auditLog';
import { PackageTypeBadge } from './ui/StatusBadge';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAppointments: any[];
  corporate: string;
  corporateId: string;
  onSave?: (invoice: any) => void;
}

export const ProFormaInvoiceModal = ({ isOpen, onClose, selectedAppointments, corporate, corporateId, onSave }: InvoiceModalProps) => {
  const [selectedPO, setSelectedPO] = useState('');
  
  const { data: purchaseOrders, isLoading: poLoading } = usePurchaseOrders(corporateId);
  
  const subtotal = selectedAppointments.reduce((sum, apt) => sum + apt.serviceRate, 0);
  const gstAmount = subtotal * 0.18;
  const total = subtotal + gstAmount;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;

  // Log modal view when opened
  useEffect(() => {
    if (isOpen) {
      auditLogService.logActivity(
        'PROFORMA_VIEWED',
        'INVOICE',
        `proforma-${Date.now()}`,
        'Pro-forma Invoice Modal',
        `Opened pro-forma invoice modal for ${corporate} with ${selectedAppointments.length} appointments`,
        {
          corporate,
          appointmentCount: selectedAppointments.length,
          totalAmount: total
        }
      );
    }
  }, [isOpen, corporate, selectedAppointments.length, total]);

  const handlePOSelection = (poId: string) => {
    setSelectedPO(poId);
    const selectedPOData = purchaseOrders?.find(po => po.id.toString() === poId);
    if (selectedPOData) {
      auditLogService.logActivity(
        'PO_SELECTED',
        'INVOICE',
        `po-${Date.now()}`,
        'PO Selection',
        `Selected PO ${selectedPOData.number} (Balance: ₹${selectedPOData.balance.toLocaleString()})`,
        {
          poNumber: selectedPOData.number,
          balance: selectedPOData.balance,
          corporate
        }
      );
    }
  };

  const handleSave = () => {
    if (!selectedPO) return;
    
    const invoice = {
      id: Date.now(),
      invoiceNumber,
      corporate,
      selectedPO: purchaseOrders?.find(po => po.id.toString() === selectedPO),
      appointments: selectedAppointments,
      subtotal,
      gstAmount,
      total,
      createdDate: new Date().toISOString(),
      status: 'Draft'
    };
    
    auditLogService.logActivity(
      'INVOICE_SAVED',
      'INVOICE',
      `proforma-${Date.now()}`,
      'Pro-forma Invoice Saved',
      `Saved pro-forma invoice ${invoiceNumber} for ${corporate} (₹${total.toLocaleString()})`,
      {
        invoiceNumber,
        corporate,
        appointmentCount: selectedAppointments.length,
        totalAmount: total,
        selectedPO: purchaseOrders?.find(po => po.id.toString() === selectedPO)?.number
      }
    );
    
    onSave?.(invoice);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="section-header">Pro-Forma Invoice</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-6 space-y-6">
          {/* Contract Header */}
          <div className="text-center border-b border-border pb-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-primary">myHealthMeter</h1>
            </div>
            <p className="text-sm text-text-secondary">Healthcare Services Provider</p>
            <p className="text-xs text-text-muted">
              123 Health Plaza, Medical District, Mumbai - 400001<br/>
              Phone: +91 22 1234 5678 | Email: billing@myhealthmeter.com<br/>
              GSTIN: 27ABCDE1234F1Z5
            </p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-text-primary mb-2">Bill To:</h3>
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-text-primary">{corporate}</p>
                <p>Corporate Address Line 1</p>
                <p>Corporate Address Line 2</p>
                <p>Mumbai - 400001</p>
                <p>GSTIN: 27CORPORATE123</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Invoice #:</span> {invoiceNumber}</p>
                <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                <p><span className="font-medium">Due Date:</span> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* PO Selection */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Purchase Order <span className="text-destructive">*</span>
            </label>
            <Select value={selectedPO} onValueChange={handlePOSelection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select PO Number" />
              </SelectTrigger>
              <SelectContent>
                {poLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  purchaseOrders?.map(po => (
                    <SelectItem key={po.id} value={po.id.toString()}>
                      {po.number} (Balance: ₹{po.balance.toLocaleString()})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Line Items Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-table-header">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Sl No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Employee Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Employee ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Gender</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Package Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">HSN/SAC</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-text-primary">Rate (₹)</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-text-primary">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selectedAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className="border-b border-border">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">{appointment.employeeName}</td>
                    <td className="px-4 py-3 text-sm">{appointment.employeeId}</td>
                    <td className="px-4 py-3 text-sm">32</td>
                    <td className="px-4 py-3 text-sm">M</td>
                    <td className="px-4 py-3 text-sm">
                      <PackageTypeBadge packageType={appointment.packageType} />
                    </td>
                    <td className="px-4 py-3 text-sm">998314</td>
                    <td className="px-4 py-3 text-sm text-right">₹{appointment.serviceRate.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right">₹{appointment.serviceRate.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">GST @ 18%:</span>
                <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between py-2">
                  <span className="text-lg font-semibold text-text-primary">Total:</span>
                  <span className="text-lg font-bold text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="text-xs text-text-muted bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-text-secondary mb-2">Terms & Conditions:</h4>
            <ul className="space-y-1">
              <li>• Payment due within 30 days of invoice date</li>
              <li>• All services completed as per agreed health checkup packages</li>
              <li>• Reports delivered digitally within 48 hours of completion</li>
              <li>• Any queries regarding this invoice should be addressed within 7 days</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border bg-table-header">
          <div className="flex justify-between items-center">
            <div className="text-sm text-text-secondary">
              Please ensure PO selection before generating invoice
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button disabled={!selectedPO} onClick={handleSave} className="bg-primary hover:bg-primary-hover">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                disabled={!selectedPO}
                onClick={() => {
                  auditLogService.logActivity(
                    'PDF_PRINTED',
                    'INVOICE',
                    `proforma-${Date.now()}`,
                    'Pro-forma Invoice Print',
                    `Printed pro-forma invoice for ${corporate}`,
                    {
                      corporate,
                      appointmentCount: selectedAppointments.length,
                      totalAmount: total
                    }
                  );
                }}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button 
                disabled={!selectedPO} 
                className="bg-primary hover:bg-primary-hover"
                onClick={() => {
                  auditLogService.logActivity(
                    'PDF_DOWNLOADED',
                    'INVOICE',
                    `proforma-${Date.now()}`,
                    'Pro-forma Invoice Download',
                    `Downloaded pro-forma invoice PDF for ${corporate}`,
                    {
                      corporate,
                      appointmentCount: selectedAppointments.length,
                      totalAmount: total
                    }
                  );
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};