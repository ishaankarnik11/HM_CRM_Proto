import { useState } from 'react';
import { MapPin, Search, Download, Eye, Filter, Building2, ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

interface Location {
  id: string;
  code: string;
  name: string;
  city: string;
  area: string;
  diagnosticCenter: string;
  serviceTypes: string[];
  status: 'Active' | 'Inactive';
}

interface LocationsProps {
  onBack?: () => void;
}

export const Locations = ({ onBack }: LocationsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dcFilter, setDcFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  // Mock data - in real implementation, this would come from API
  const generateLocations = (): Location[] => {
    const locationTypes = ['Center', 'Branch', 'Clinic', 'Lab', 'Hub', 'Unit', 'Facility', 'Station'];
    
    const cities = [
      'Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Hyderabad', 'Delhi', 'Kolkata', 'Ahmedabad',
      'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
      'Visakhapatnam', 'Pimpri', 'Patna', 'Vadodara', 'Agra', 'Ludhiana', 'Nashik', 'Faridabad',
      'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
      'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior'
    ];

    const areas = [
      'Andheri West', 'Bandra East', 'Koregaon Park', 'Koramangala', 'Anna Nagar', 'Banjara Hills',
      'Connaught Place', 'Salt Lake', 'Navrangpura', 'Malviya Nagar', 'Adajan', 'Gomti Nagar',
      'Civil Lines', 'Dharampeth', 'Vijay Nagar', 'Wagle Estate', 'New Market', 'Dwaraka Nagar',
      'Chinchwad', 'Boring Road', 'Alkapuri', 'Sadar Bazaar', 'Model Town', 'Panchavati',
      'Sector 15', 'Cantonment', 'University Road', 'Kalyan West', 'Nalasopara', 'Sigra',
      'Rajbagh', 'Powai', 'Vashi', 'Kothrud', 'Whitefield', 'Indiranagar', 'T. Nagar',
      'Adyar', 'Jubilee Hills', 'Madhapur', 'Karol Bagh', 'Lajpat Nagar', 'Park Street',
      'Ballygunge', 'Satellite', 'Vastrapur', 'C-Scheme', 'Bapu Nagar', 'Vesu', 'Hazratganj'
    ];

    const diagnosticCenters = [
      'HealthCare Labs Mumbai', 'Medical Center Pune', 'Diagnostics Plus Bangalore', 'City Health Chennai',
      'Prime Diagnostics Hyderabad', 'Advanced Medical Delhi', 'Wellness Labs Kolkata', 'Life Sciences Ahmedabad',
      'Metro Health Jaipur', 'Central Diagnostics Surat', 'Unity Medical Lucknow', 'Global Health Kanpur',
      'Precision Labs Nagpur', 'Supreme Diagnostics Indore', 'Alpha Medical Thane', 'Beta Healthcare Bhopal',
      'Gamma Diagnostics Visakhapatnam', 'Delta Medical Pimpri', 'Epsilon Labs Patna', 'Zeta Health Vadodara',
      'Omega Diagnostics Agra', 'Sigma Medical Ludhiana', 'Phoenix Labs Nashik', 'Eagle Healthcare Faridabad',
      'Lion Medical Meerut', 'Tiger Diagnostics Rajkot', 'Lotus Health Kalyan', 'Rose Medical Vasai',
      'Jasmine Labs Varanasi', 'Orchid Healthcare Srinagar'
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

    const locations: Location[] = [];
    
    for (let i = 1; i <= 200; i++) {
      const cityIndex = (i - 1) % cities.length;
      const areaIndex = (i - 1) % areas.length;
      const typeIndex = (i - 1) % locationTypes.length;
      const dcIndex = (i - 1) % diagnosticCenters.length;
      
      const city = cities[cityIndex];
      const area = areas[areaIndex];
      const type = locationTypes[typeIndex];
      
      locations.push({
        id: i.toString(),
        code: `LOC${i.toString().padStart(3, '0')}`,
        name: `${area} ${type}`,
        city: city,
        area: area,
        diagnosticCenter: diagnosticCenters[dcIndex],
        serviceTypes: serviceTypeCombinations[i % serviceTypeCombinations.length],
        status: i % 12 === 0 ? 'Inactive' : 'Active'
      });
    }
    
    return locations;
  };

  const locations = generateLocations();

  const filteredLocations = locations.filter(location => {
    const matchesSearch = searchTerm === '' || 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;
    const matchesDC = dcFilter === 'all' || location.diagnosticCenter === dcFilter;
    
    return matchesSearch && matchesStatus && matchesDC;
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
          { label: 'Locations' }
        ]} />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Service Locations</h1>
          <p className="text-text-secondary">Total Locations: {locations.length}</p>
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
                  placeholder="Search by name, city, or area"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Diagnostic Center
              </label>
              <Select value={dcFilter} onValueChange={setDcFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All DCs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All DCs</SelectItem>
                  <SelectItem value="HealthCare Labs Mumbai">HealthCare Labs Mumbai</SelectItem>
                  <SelectItem value="Medical Center Pune">Medical Center Pune</SelectItem>
                  <SelectItem value="Diagnostics Plus Bangalore">Diagnostics Plus Bangalore</SelectItem>
                  <SelectItem value="City Health Chennai">City Health Chennai</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Locations ({filteredLocations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Location Code</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Location Name</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">City</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Area/Zone</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Diagnostic Center</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Service Types</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.map((location) => (
                  <tr key={location.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="py-3 px-4 text-sm text-text-primary font-medium">
                      {location.code}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary font-medium text-primary cursor-pointer hover:underline">
                      {location.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {location.city}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {location.area}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      <span className="text-primary cursor-pointer hover:underline">
                        {location.diagnosticCenter}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {getServiceTypeBadges(location.serviceTypes)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(location.status)}
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
          
          {filteredLocations.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-text-secondary">No locations found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          Showing {filteredLocations.length} of {locations.length} results
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