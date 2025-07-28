import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { X, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { Badge } from './ui/badge';

interface Contract {
  id: string;
  code: string;
  name: string;
  state: string;
  status: 'Active' | 'Inactive';
  contactPerson: string;
  contractPeriod: string;
  service: 'AHC' | 'PEC';
}

interface ContractViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  corporate: Contract | null;
}

export const ContractViewModal = ({ isOpen, onClose, corporate }: ContractViewModalProps) => {
  if (!corporate) return null;

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">Inactive</Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                {corporate.name}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-text-secondary">Code: {corporate.code}</span>
                {getStatusBadge(corporate.status)}
              </div>
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
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">Contract Name</label>
                <p className="text-base font-medium text-text-primary">{corporate.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Contract Code</label>
                <p className="text-base font-medium text-text-primary">{corporate.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Service</label>
                <div className="mt-1">
                  <Badge className={corporate.service === 'AHC' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'}>
                    {corporate.service}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Legal Name</label>
                <p className="text-base font-medium text-text-primary">{corporate.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Status</label>
                <div className="mt-1">{getStatusBadge(corporate.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">State</label>
                <p className="text-base font-medium text-text-primary">{corporate.state}</p>
              </div>
            </div>
          </div>


          {/* Address Details */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">Registered Address</label>
                <p className="text-base text-text-primary">
                  {corporate.name} Head Office<br />
                  Commercial Complex, Sector 15<br />
                  {corporate.state} - 400001<br />
                  India
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Billing Address</label>
                <p className="text-base text-text-primary">
                  Same as Registered Address
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">City</label>
                <p className="text-base font-medium text-text-primary">Mumbai</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Pincode</label>
                <p className="text-base font-medium text-text-primary">400001</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">Primary Contact Person</label>
                <p className="text-base font-medium text-text-primary">{corporate.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Contact Email</label>
                <p className="text-base text-text-primary">
                  <a href={`mailto:${corporate.contactPerson.toLowerCase().replace(' ', '.')}@${corporate.name.toLowerCase().replace(/[^a-z]/g, '')}.com`} 
                     className="text-blue-600 hover:underline flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {corporate.contactPerson.toLowerCase().replace(' ', '.')}@{corporate.name.toLowerCase().replace(/[^a-z]/g, '')}.com
                  </a>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Contact Phone</label>
                <p className="text-base font-medium text-text-primary">+91 98765 43210</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Accounts Email</label>
                <p className="text-base text-text-primary">
                  <a href={`mailto:accounts@${corporate.name.toLowerCase().replace(/[^a-z]/g, '')}.com`} 
                     className="text-blue-600 hover:underline">
                    accounts@{corporate.name.toLowerCase().replace(/[^a-z]/g, '')}.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Payment Terms</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">Default Payment Terms</label>
                <p className="text-base font-medium text-text-primary">30 Days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Credit Limit</label>
                <p className="text-base font-medium text-text-primary">₹10,00,000</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Currency</label>
                <p className="text-base font-medium text-text-primary">INR (Indian Rupee)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Contract Period</label>
                <p className="text-base font-medium text-text-primary">{corporate.contractPeriod}</p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">System Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">Created Date</label>
                <p className="text-base font-medium text-text-primary">January 15, 2024</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Last Modified Date</label>
                <p className="text-base font-medium text-text-primary">March 10, 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 mt-6">
          <div className="flex justify-end">
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};