import { useState } from 'react';
import { Search, Upload, FileText, Download, Edit, Trash2, Eye } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// Mock data
const mockDiagnosticCenters = [
  { id: 1, name: 'Apollo Diagnostics', locations: ['Mumbai Central', 'Andheri', 'Bandra'] },
  { id: 2, name: 'SRL Diagnostics', locations: ['Worli', 'Lower Parel', 'Powai'] },
  { id: 3, name: 'Dr. Lal PathLabs', locations: ['Dadar', 'Chembur', 'Thane'] }
];

const mockAppointments = [
  {
    id: 1,
    appointmentId: 'APT001',
    employeeName: 'Rajesh Kumar',
    corporate: 'TechCorp India',
    date: '2024-07-15',
    rate: 1500,
    draftStatus: null,
    selected: false
  },
  {
    id: 2,
    appointmentId: 'APT002',
    employeeName: 'Priya Sharma',
    corporate: 'TechCorp India',
    date: '2024-07-15',
    rate: 1200,
    draftStatus: 'DCK-2024-07-001',
    selected: false
  },
  {
    id: 3,
    appointmentId: 'APT003',
    employeeName: 'Amit Patel',
    corporate: 'HealthPlus Solutions',
    date: '2024-07-16',
    rate: 1500,
    draftStatus: null,
    selected: false
  }
];

const mockDockets = [
  {
    id: 1,
    docketNumber: 'DCK-2024-07-001',
    status: 'Draft',
    dc: 'Apollo Diagnostics',
    location: 'Mumbai Central',
    period: '15-16 Jul 2024',
    count: 5,
    amount: 7500,
    createdDate: '2024-07-17'
  },
  {
    id: 2,
    docketNumber: 'DCK-2024-07-002',
    status: 'Submitted',
    dc: 'SRL Diagnostics',
    location: 'Worli',
    period: '14-15 Jul 2024',
    count: 8,
    amount: 12000,
    createdDate: '2024-07-16'
  }
];

export const DCBills = () => {
  const [selectedDC, setSelectedDC] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appointments, setAppointments] = useState(mockAppointments);
  const [showResults, setShowResults] = useState(false);
  const [showDockets, setShowDockets] = useState(true);

  const selectedAppointments = appointments.filter(apt => apt.selected);
  const totalAmount = selectedAppointments.reduce((sum, apt) => sum + apt.rate, 0);

  const handleSearch = () => {
    if (selectedDC && selectedLocation && startDate && endDate) {
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

  const availableLocations = selectedDC ? 
    mockDiagnosticCenters.find(dc => dc.id.toString() === selectedDC)?.locations || [] : [];

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Accounting', href: '/accounting' },
        { label: 'DC Bills & Dockets' }
      ]} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">DC Bills & Dockets</h1>
      </div>

      {/* Filter Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="section-header mb-4">Search Appointments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Diagnostic Center <span className="text-destructive">*</span>
            </label>
            <Select value={selectedDC} onValueChange={setSelectedDC}>
              <SelectTrigger>
                <SelectValue placeholder="Select DC" />
              </SelectTrigger>
              <SelectContent>
                {mockDiagnosticCenters.map(dc => (
                  <SelectItem key={dc.id} value={dc.id.toString()}>
                    {dc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
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
              disabled={!selectedDC || !selectedLocation || !startDate || !endDate}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
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
                
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-secondary mb-1">
                    Drag and drop your bill file here, or <span className="text-primary cursor-pointer">browse</span>
                  </p>
                  <p className="text-xs text-text-muted">PDF, PNG, JPEG up to 10MB</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="confirm-amount"
                    className="rounded border-border"
                  />
                  <label htmlFor="confirm-amount" className="text-sm text-text-secondary">
                    I confirm the system total matches my bill amount
                  </label>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button className="bg-primary hover:bg-primary-hover">
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
            <h3 className="section-header">Payment Dockets</h3>
          </div>
          
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
                {mockDockets.map((docket) => (
                  <tr key={docket.id}>
                    <td className="font-medium text-primary">{docket.docketNumber}</td>
                    <td>
                      <span className={`badge-${docket.status.toLowerCase()}`}>
                        {docket.status}
                      </span>
                    </td>
                    <td>{docket.dc}</td>
                    <td>{docket.location}</td>
                    <td>{docket.period}</td>
                    <td>{docket.count}</td>
                    <td>₹{docket.amount.toLocaleString()}</td>
                    <td>{docket.createdDate}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {docket.status === 'Draft' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};