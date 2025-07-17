import { useState } from 'react';
import { Calendar, Search, Download, Eye, Printer, FileText } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProFormaInvoiceModal } from '../components/ProFormaInvoiceModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// Mock data for demonstration
const mockAppointments = [
  {
    id: 1,
    employeeName: 'Meghna Padwal',
    employeeId: 'EMP001',
    corporate: 'TechCorp India',
    appointmentDate: '2024-07-12',
    serviceRate: 1500,
    packageType: 'AHC',
    serviceType: 'Annual Health Checkup',
    selected: false
  },
  {
    id: 2,
    employeeName: 'Nikita Rawat',
    employeeId: 'EMP002',
    corporate: 'TechCorp India',
    appointmentDate: '2024-07-13',
    serviceRate: 1200,
    packageType: 'PEC',
    serviceType: 'Pre-Employment Checkup',
    selected: false
  },
  {
    id: 3,
    employeeName: 'Nida Shaikh',
    employeeId: 'EMP003',
    corporate: 'TechCorp India',
    appointmentDate: '2024-07-14',
    serviceRate: 1500,
    packageType: 'AHC',
    serviceType: 'Annual Health Checkup',
    selected: false
  }
];

const mockCorporates = [
  { id: 1, name: 'TechCorp India', active: true },
  { id: 2, name: 'HealthPlus Solutions', active: true },
  { id: 3, name: 'MedTech Enterprises', active: true }
];

const serviceTypes = [
  { id: 'AHC', name: 'Annual Health Checkup' },
  { id: 'PEC', name: 'Pre-Employment Checkup' },
  { id: 'OPD', name: 'OPD Services' }
];

export const Receivables = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCorporate, setSelectedCorporate] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [appointments, setAppointments] = useState(mockAppointments);
  const [showResults, setShowResults] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const selectedAppointments = appointments.filter(apt => apt.selected);
  const totalAmount = selectedAppointments.reduce((sum, apt) => sum + apt.serviceRate, 0);

  const handleSearch = () => {
    if (startDate && endDate && selectedCorporate) {
      setShowResults(true);
    }
  };

  const toggleAppointmentSelection = (id: number) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, selected: !apt.selected } : apt
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = appointments.every(apt => apt.selected);
    setAppointments(prev => 
      prev.map(apt => ({ ...apt, selected: !allSelected }))
    );
  };

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Accounting', href: '/accounting' },
        { label: 'Receivables' }
      ]} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Receivables</h1>
      </div>

      {/* Filter Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="section-header mb-4">Search Medical Done Appointments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
            <Select value={selectedCorporate} onValueChange={setSelectedCorporate}>
              <SelectTrigger>
                <SelectValue placeholder="Select Corporate" />
              </SelectTrigger>
              <SelectContent>
                {mockCorporates.map(corp => (
                  <SelectItem key={corp.id} value={corp.id.toString()}>
                    {corp.name}
                  </SelectItem>
                ))}
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
          
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={!startDate || !endDate || !selectedCorporate}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Clients
            </Button>
          </div>
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
                    <td>{appointment.appointmentDate}</td>
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
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Pro-Forma Invoice
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pro-Forma Invoice Modal */}
      <ProFormaInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        selectedAppointments={selectedAppointments}
        corporate={mockCorporates.find(corp => corp.id.toString() === selectedCorporate)?.name || ''}
      />
    </div>
  );
};