import { useState } from 'react';
import { Package, Search, Download, Eye, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useTableSort, SortableHeader } from '../../hooks/useTableSort';

interface PackageData {
  id: string;
  packageName: string;
  contractCode: string;
  contractName: string;
  corporateRate: number;
  status: 'Active' | 'Inactive';
}

export const Packages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');

  // Mock data generation with realistic package names
  const generatePackages = (): PackageData[] => {
    const contracts = [
      { code: 'CORP001', name: 'Tech Solutions India Pvt Ltd', initials: 'TSI' },
      { code: 'CORP002', name: 'Global Services Ltd', initials: 'GSL' },
      { code: 'CORP003', name: 'Manufacturing Co', initials: 'MC' },
      { code: 'CORP004', name: 'Financial Services Inc', initials: 'FSI' },
      { code: 'CORP005', name: 'Healthcare Systems Ltd', initials: 'HSL' },
      { code: 'CORP006', name: 'Digital Innovation Corp', initials: 'DIC' },
      { code: 'CORP007', name: 'Engineering Solutions', initials: 'ES' },
      { code: 'CORP008', name: 'Pharma Industries', initials: 'PI' }
    ];

    const packageFormats = [
      'Male Above 45',
      'Male Below 35',
      'Female Above 45', 
      'Female Below 35',
      'Male 35-45',
      'Female 35-45',
      'Executive Package',
      'Senior Management',
      'General Employee',
      'New Joiners',
      'Management Cadre',
      'Field Staff'
    ];

    const packages: PackageData[] = [];
    let packageId = 1;

    contracts.forEach((contract) => {
      // Generate 3-5 packages per contract
      const packageCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < packageCount; i++) {
        const format = packageFormats[i % packageFormats.length];
        const packageName = `${contract.initials} - ${format}`;
        const baseRate = 2500;
        const variation = Math.floor(Math.random() * 2000) + 500; // 500-2500 variation
        const corporateRate = baseRate + variation;

        packages.push({
          id: packageId.toString(),
          packageName: packageName,
          contractCode: contract.code,
          contractName: contract.name,
          corporateRate: corporateRate,
          status: packageId % 15 === 0 ? 'Inactive' : 'Active'
        });
        
        packageId++;
      }
    });

    return packages;
  };

  const packages = generatePackages();
  const contracts = [...new Set(packages.map(p => ({ code: p.contractCode, name: p.contractName })))];

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = searchTerm === '' || 
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.contractCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.contractName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    const matchesContract = contractFilter === 'all' || pkg.contractCode === contractFilter;
    
    return matchesSearch && matchesStatus && matchesContract;
  });

  const packagesSort = useTableSort(filteredPackages);

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">Inactive</Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-text-secondary">Showing {filteredPackages.length} of {packages.length} packages</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by package name or contract"
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
          <CardTitle>Health Packages ({packagesSort.sortedData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <SortableHeader
                    column="packageName"
                    onSort={packagesSort.handleSort}
                    getSortIcon={packagesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Package Name
                  </SortableHeader>
                  <SortableHeader
                    column="contractCode"
                    onSort={packagesSort.handleSort}
                    getSortIcon={packagesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Contract
                  </SortableHeader>
                  <SortableHeader
                    column="corporateRate"
                    onSort={packagesSort.handleSort}
                    getSortIcon={packagesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Corporate Rate
                  </SortableHeader>
                  <SortableHeader
                    column="status"
                    onSort={packagesSort.handleSort}
                    getSortIcon={packagesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Status
                  </SortableHeader>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packagesSort.sortedData.map((pkg) => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="py-3 px-4 text-sm text-text-primary font-medium text-primary cursor-pointer hover:underline">
                      {pkg.packageName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-blue-600">{pkg.contractCode}</div>
                        <div className="text-xs text-text-secondary">{pkg.contractName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary font-semibold text-green-600">
                      {formatCurrency(pkg.corporateRate)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(pkg.status)}
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
          
          {packagesSort.sortedData.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-text-secondary">No packages found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          Showing {packagesSort.sortedData.length} of {packages.length} results
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