import { useState } from 'react';
import { MapPin, Search, Download, Eye, Filter, Building2, ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useTableSort, SortableHeader } from '../../hooks/useTableSort';

interface Location {
  id: string;
  code: string;
  name: string;
  city: string;
  area: string;
  gstin: string;
  contractCode: string;
  contractName: string;
  entityCode: string;
  entityName: string;
  status: 'Active' | 'Inactive';
}

export const Locations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

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

    const contractCodes = ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006', 'CORP007', 'CORP008'];
    const contractNames = [
      'Tech Solutions India Pvt Ltd', 'Global Services Ltd', 'Manufacturing Co', 'Financial Services Inc',
      'Healthcare Systems Ltd', 'Digital Innovation Corp', 'Engineering Solutions', 'Pharma Industries'
    ];

    const entityCodes = ['ENT001', 'ENT002', 'ENT003', 'ENT004', 'ENT005', 'ENT006', 'ENT007', 'ENT008'];
    const entityNames = [
      'Tech Solutions India Pvt Ltd - Head Office', 'Global Services Ltd - Regional Office', 
      'Manufacturing Co - Manufacturing Unit', 'Financial Services Inc - Sales Division',
      'Healthcare Systems Ltd - Support Center', 'Digital Innovation Corp - Operations Hub',
      'Engineering Solutions - Head Office', 'Pharma Industries - Regional Office'
    ];

    const locations: Location[] = [];
    
    for (let i = 1; i <= 200; i++) {
      const cityIndex = (i - 1) % cities.length;
      const areaIndex = (i - 1) % areas.length;
      const typeIndex = (i - 1) % locationTypes.length;
      const contractIndex = (i - 1) % contractCodes.length;
      const entityIndex = (i - 1) % entityCodes.length;
      
      const city = cities[cityIndex];
      const area = areas[areaIndex];
      const type = locationTypes[typeIndex];
      
      // Generate GSTIN based on location
      const stateCode = ['27', '29', '33', '07', '36'][cityIndex % 5]; // Sample state codes
      const gstin = `${stateCode}AABCT${(2000 + i).toString()}L${i % 10}Z${(i % 9) + 1}`;
      
      locations.push({
        id: i.toString(),
        code: `LOC${i.toString().padStart(3, '0')}`,
        name: `${area} ${type}`,
        city: city,
        area: area,
        gstin: gstin,
        contractCode: contractCodes[contractIndex],
        contractName: contractNames[contractIndex],
        entityCode: entityCodes[entityIndex],
        entityName: entityNames[entityIndex],
        status: i % 12 === 0 ? 'Inactive' : 'Active'
      });
    }
    
    return locations;
  };

  const locations = generateLocations();
  const contracts = [...new Set(locations.map(l => ({ code: l.contractCode, name: l.contractName })))];
  const entities = [...new Set(locations.map(l => ({ code: l.entityCode, name: l.entityName })))];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = searchTerm === '' || 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.gstin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;
    const matchesContract = contractFilter === 'all' || location.contractCode === contractFilter;
    const matchesEntity = entityFilter === 'all' || location.entityCode === entityFilter;
    
    return matchesSearch && matchesStatus && matchesContract && matchesEntity;
  });

  const locationsSort = useTableSort(filteredLocations);

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">Inactive</Badge>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-text-secondary">Showing {filteredLocations.length} of {locations.length} locations</p>
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
                  placeholder="Search by name, city, area, or GSTIN"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Contract
              </label>
              <Select value={contractFilter} onValueChange={setContractFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Contracts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contracts</SelectItem>
                  {contracts.map(contract => (
                    <SelectItem key={contract.code} value={contract.code}>
                      {contract.code} - {contract.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Entity
              </label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map(entity => (
                    <SelectItem key={entity.code} value={entity.code}>
                      {entity.code} - {entity.name}
                    </SelectItem>
                  ))}
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
          <CardTitle>Service Locations ({locationsSort.sortedData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <SortableHeader
                    column="code"
                    onSort={locationsSort.handleSort}
                    getSortIcon={locationsSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Location Code
                  </SortableHeader>
                  <SortableHeader
                    column="name"
                    onSort={locationsSort.handleSort}
                    getSortIcon={locationsSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Location Name
                  </SortableHeader>
                  <SortableHeader
                    column="city"
                    onSort={locationsSort.handleSort}
                    getSortIcon={locationsSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    City
                  </SortableHeader>
                  <SortableHeader
                    column="area"
                    onSort={locationsSort.handleSort}
                    getSortIcon={locationsSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Area/Zone
                  </SortableHeader>
                  <SortableHeader
                    column="gstin"
                    onSort={locationsSort.handleSort}
                    getSortIcon={locationsSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    GSTIN
                  </SortableHeader>
                  <SortableHeader
                    column="contractCode"
                    onSort={locationsSort.handleSort}
                    getSortIcon={locationsSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Contract
                  </SortableHeader>
                  <SortableHeader
                    column="entityCode"
                    onSort={locationsSort.handleSort}
                    getSortIcon={locationsSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Entity
                  </SortableHeader>
                  <SortableHeader
                    column="status"
                    onSort={locationsSort.handleSort}
                    getSortIcon={locationsSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Status
                  </SortableHeader>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locationsSort.sortedData.map((location) => (
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
                    <td className="py-3 px-4 text-sm text-text-secondary font-mono">
                      {location.gstin}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-blue-600">{location.contractCode}</div>
                        <div className="text-xs text-text-secondary">{location.contractName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-purple-600">{location.entityCode}</div>
                        <div className="text-xs text-text-secondary">{location.entityName}</div>
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
          
          {locationsSort.sortedData.length === 0 && (
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
          Showing {locationsSort.sortedData.length} of {locations.length} results
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