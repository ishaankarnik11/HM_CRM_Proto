import { useState } from 'react';
import { Building2, Search, Download, Eye, Filter, ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useTableSort, SortableHeader } from '../../hooks/useTableSort';
import { ContractViewModal } from '../../components/CorporateViewModal';

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

export const Corporates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCorporate, setSelectedCorporate] = useState<Contract | null>(null);

  // Mock data - in real implementation, this would come from API
  const generateCorporates = (): Contract[] => {
    const corporateNames = [
      'Tech Solutions India Pvt Ltd', 'Global Services Ltd', 'Manufacturing Co', 'Financial Services Inc',
      'Healthcare Systems Ltd', 'Digital Innovation Corp', 'Engineering Solutions', 'Pharma Industries',
      'Logistics Network Ltd', 'Energy Solutions Inc', 'Construction Corp', 'Retail Chain Ltd',
      'Media House Pvt Ltd', 'Food Processing Inc', 'Textile Industries', 'Chemical Solutions',
      'Auto Components Ltd', 'Software Services', 'Banking Solutions', 'Insurance Group',
      'Real Estate Developers', 'Mining Corporation', 'Steel Industries', 'Cement Manufacturing',
      'Telecom Services Ltd', 'Aviation Corp', 'Shipping Lines', 'Railway Systems',
      'Power Generation Ltd', 'Water Treatment Inc', 'Waste Management Corp', 'Security Services',
      'Consulting Group', 'Trading House Ltd', 'Import Export Corp', 'Agro Industries',
      'Dairy Products Ltd', 'Beverages Inc', 'Cosmetics Corp', 'Furniture Industries',
      'Plastic Manufacturing', 'Glass Industries', 'Paper Mills Ltd', 'Printing Press',
      'Advertising Agency', 'Event Management', 'Travel Services', 'Hotel Chain',
      'Educational Services', 'Training Institute', 'Research Labs', 'Testing Services'
    ];

    const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Haryana', 'Punjab', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Odisha', 'Madhya Pradesh'];
    const contactPersons = ['Rajesh Kumar', 'Priya Sharma', 'Suresh Babu', 'Anita Gupta', 'Vikram Singh', 'Deepika Patel', 'Amit Verma', 'Sunita Joshi', 'Rohit Agarwal', 'Kavita Reddy', 'Manish Gupta', 'Sneha Rao', 'Arjun Nair', 'Pooja Mehta', 'Sanjay Yadav', 'Ritu Sinha', 'Nitin Sharma', 'Meera Iyer', 'Karan Malhotra', 'Divya Chopra'];
    
    const corporates: Contract[] = [];
    
    for (let i = 1; i <= 150; i++) {
      const nameIndex = (i - 1) % corporateNames.length;
      const suffix = Math.floor((i - 1) / corporateNames.length) + 1;
      const name = suffix > 1 ? `${corporateNames[nameIndex]} ${suffix}` : corporateNames[nameIndex];
      
      const stateCode = states[i % states.length];
      
      corporates.push({
        id: i.toString(),
        code: `CORP${i.toString().padStart(3, '0')}`,
        name: name,
        state: stateCode,
        status: i % 8 === 0 ? 'Inactive' : 'Active',
        contactPerson: contactPersons[i % contactPersons.length],
        contractPeriod: i % 3 === 0 ? '2023-06-01 to 2024-05-31' : i % 3 === 1 ? '2024-01-01 to 2024-12-31' : '2024-03-01 to 2025-02-28',
        service: i % 2 === 0 ? 'AHC' : 'PEC'
      });
    }
    
    return corporates;
  };

  const corporates = generateCorporates();

  const filteredCorporates = corporates.filter(corporate => {
    const matchesSearch = searchTerm === '' || 
      corporate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corporate.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || corporate.status === statusFilter;
    const matchesState = stateFilter === 'all' || corporate.state === stateFilter;
    const matchesService = serviceFilter === 'all' || corporate.service === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesState && matchesService;
  });

  const corporatesSort = useTableSort(filteredCorporates);

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">Inactive</Badge>
    );
  };

  const handleViewCorporate = (corporate: Contract) => {
    setSelectedCorporate(corporate);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Contract Clients</h1>
          <p className="text-text-secondary">Total Contracts: {corporates.length}</p>
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
                  placeholder="Search by name or code"
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
                  <SelectItem value="Delhi">Delhi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Service
              </label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="AHC">AHC</SelectItem>
                  <SelectItem value="PEC">PEC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Clients ({corporatesSort.sortedData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <SortableHeader
                    column="code"
                    onSort={corporatesSort.handleSort}
                    getSortIcon={corporatesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Contract Code
                  </SortableHeader>
                  <SortableHeader
                    column="name"
                    onSort={corporatesSort.handleSort}
                    getSortIcon={corporatesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Contract Name
                  </SortableHeader>
                  <SortableHeader
                    column="service"
                    onSort={corporatesSort.handleSort}
                    getSortIcon={corporatesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Service
                  </SortableHeader>
                  <SortableHeader
                    column="state"
                    onSort={corporatesSort.handleSort}
                    getSortIcon={corporatesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    State
                  </SortableHeader>
                  <SortableHeader
                    column="status"
                    onSort={corporatesSort.handleSort}
                    getSortIcon={corporatesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Status
                  </SortableHeader>
                  <SortableHeader
                    column="contactPerson"
                    onSort={corporatesSort.handleSort}
                    getSortIcon={corporatesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Contact Person
                  </SortableHeader>
                  <SortableHeader
                    column="contractPeriod"
                    onSort={corporatesSort.handleSort}
                    getSortIcon={corporatesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Contract Period
                  </SortableHeader>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {corporatesSort.sortedData.map((corporate) => (
                  <tr key={corporate.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="py-3 px-4 text-sm text-text-primary font-medium">
                      {corporate.code}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary font-medium text-primary cursor-pointer hover:underline">
                      {corporate.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      <Badge className={corporate.service === 'AHC' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'}>
                        {corporate.service}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {corporate.state}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(corporate.status)}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {corporate.contactPerson}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {corporate.contractPeriod}
                    </td>
                    <td className="py-3 px-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => handleViewCorporate(corporate)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {corporatesSort.sortedData.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-text-secondary">No contracts found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          Showing {corporatesSort.sortedData.length} of {corporates.length} results
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

      {/* Contract View Modal */}
      <ContractViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCorporate(null);
        }}
        corporate={selectedCorporate}
      />
    </div>
  );
};