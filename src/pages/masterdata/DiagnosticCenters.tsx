import { useState } from 'react';
import { MapPin, Search, Download, Eye, Filter, ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

interface DiagnosticCenter {
  id: string;
  code: string;
  name: string;
  primaryLocation: string;
  serviceTypes: string[];
  contactPerson: string;
  status: 'Active' | 'Inactive';
  childDCs: number;
}

interface DiagnosticCentersProps {
  onBack?: () => void;
}

export const DiagnosticCenters = ({ onBack }: DiagnosticCentersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  // Mock data - in real implementation, this would come from API
  const generateDiagnosticCenters = (): DiagnosticCenter[] => {
    const centerNames = [
      'HealthCare Labs', 'Medical Center', 'Diagnostics Plus', 'City Health', 'Prime Diagnostics',
      'Advanced Medical', 'Wellness Labs', 'Life Sciences', 'Metro Health', 'Central Diagnostics',
      'Unity Medical', 'Global Health', 'Precision Labs', 'Supreme Diagnostics', 'Alpha Medical',
      'Beta Healthcare', 'Gamma Diagnostics', 'Delta Medical', 'Epsilon Labs', 'Zeta Health',
      'Omega Diagnostics', 'Sigma Medical', 'Phoenix Labs', 'Eagle Healthcare', 'Lion Medical',
      'Tiger Diagnostics', 'Lotus Health', 'Rose Medical', 'Jasmine Labs', 'Orchid Healthcare'
    ];

    const cities = [
      'Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Hyderabad', 'Delhi', 'Kolkata', 'Ahmedabad',
      'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
      'Visakhapatnam', 'Pimpri', 'Patna', 'Vadodara', 'Agra', 'Ludhiana', 'Nashik', 'Faridabad',
      'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
      'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior'
    ];

    const areas = [
      'Andheri', 'Koregaon Park', 'Koramangala', 'Anna Nagar', 'Banjara Hills', 'Connaught Place',
      'Salt Lake', 'Navrangpura', 'Malviya Nagar', 'Adajan', 'Gomti Nagar', 'Civil Lines',
      'Dharampeth', 'Vijay Nagar', 'Wagle Estate', 'New Market', 'Dwaraka Nagar', 'Chinchwad',
      'Boring Road', 'Alkapuri', 'Sadar Bazaar', 'Model Town', 'Panchavati', 'Sector 15',
      'Cantonment', 'University Road', 'Kalyan West', 'Nalasopara', 'Sigra', 'Rajbagh'
    ];

    const doctors = [
      'Dr. Ravi Mehta', 'Dr. Sunita Joshi', 'Dr. Arun Kumar', 'Dr. Lakshmi Priya', 'Dr. Vivek Sharma',
      'Dr. Preeti Agarwal', 'Dr. Sunil Reddy', 'Dr. Kavita Gupta', 'Dr. Rajesh Singh', 'Dr. Neha Patel',
      'Dr. Ashok Verma', 'Dr. Priya Nair', 'Dr. Sanjay Rao', 'Dr. Deepika Jain', 'Dr. Vinod Kumar',
      'Dr. Sneha Desai', 'Dr. Manoj Tiwari', 'Dr. Pooja Sharma', 'Dr. Ravi Khurana', 'Dr. Anjali Mehta'
    ];

    const serviceTypeCombinations = [
      ['AHC', 'PEC', 'OPD'],
      ['AHC', 'PEC'],
      ['AHC', 'OPD'],
      ['PEC', 'OPD'],
      ['AHC'],
      ['PEC'],
      ['OPD']
    ];

    const diagnosticCenters: DiagnosticCenter[] = [];
    
    for (let i = 1; i <= 125; i++) {
      const nameIndex = (i - 1) % centerNames.length;
      const cityIndex = (i - 1) % cities.length;
      const areaIndex = (i - 1) % areas.length;
      const doctorIndex = (i - 1) % doctors.length;
      
      const suffix = Math.floor((i - 1) / centerNames.length) + 1;
      const name = suffix > 1 ? `${centerNames[nameIndex]} ${suffix}` : centerNames[nameIndex];
      
      diagnosticCenters.push({
        id: i.toString(),
        code: `DC${i.toString().padStart(3, '0')}`,
        name: `${name} ${cities[cityIndex]}`,
        primaryLocation: `${areas[areaIndex]}, ${cities[cityIndex]}`,
        serviceTypes: serviceTypeCombinations[i % serviceTypeCombinations.length],
        contactPerson: doctors[doctorIndex],
        status: i % 10 === 0 ? 'Inactive' : 'Active',
        childDCs: Math.floor(Math.random() * 8) + 1
      });
    }
    
    return diagnosticCenters;
  };

  const diagnosticCenters = generateDiagnosticCenters();

  const filteredCenters = diagnosticCenters.filter(center => {
    const matchesSearch = searchTerm === '' || 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.primaryLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || center.status === statusFilter;
    const matchesServiceType = serviceTypeFilter === 'all' || center.serviceTypes.includes(serviceTypeFilter);
    
    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">Inactive</Badge>
    );
  };

  const getServiceTypeBadges = (serviceTypes: string[]) => {
    return serviceTypes.map(type => (
      <Badge key={type} variant="outline" className="text-xs">
        {type}
      </Badge>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        <Breadcrumb items={[
          { label: 'Master Data', href: '/accounting' },
          { label: 'Diagnostic Centers' }
        ]} />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Diagnostic Centers</h1>
          <p className="text-text-secondary">Total DCs: {diagnosticCenters.length}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, code, or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              <label className="block text-sm font-medium text-text-primary mb-2">
                Service Type
              </label>
              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="AHC">AHC</SelectItem>
                  <SelectItem value="PEC">PEC</SelectItem>
                  <SelectItem value="OPD">OPD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                State
              </label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Centers ({filteredCenters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-text-primary">DC Code</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">DC Name</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Primary Location</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Service Types</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Contact Person</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Child DCs</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCenters.map((center) => (
                  <tr key={center.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="py-3 px-4 text-sm text-text-primary font-medium">
                      {center.code}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary font-medium text-primary cursor-pointer hover:underline">
                      {center.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {center.primaryLocation}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {getServiceTypeBadges(center.serviceTypes)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {center.contactPerson}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(center.status)}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {center.childDCs}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCenters.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-text-secondary">No diagnostic centers found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          Showing {filteredCenters.length} of {diagnosticCenters.length} results
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};