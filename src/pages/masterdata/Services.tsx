import { useState } from 'react';
import { DollarSign, Search, Download, Eye, Filter, Package, ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useTableSort, SortableHeader } from '../../hooks/useTableSort';

interface Service {
  id: string;
  code: string;
  name: string;
  hsnSacCode: string;
  status: 'Active' | 'Inactive';
}

export const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real implementation, this would come from API
  const generateServices = (): Service[] => {
    const services: Service[] = [
      {
        id: '1',
        code: 'AHC001',
        name: 'Annual Health Checkup',
        hsnSacCode: '998722',
        status: 'Active'
      },
      {
        id: '2',
        code: 'PEC001',
        name: 'Pre Employment Checkup',
        hsnSacCode: '998721',
        status: 'Active'
      }
    ];

    return services;
  };

  const services = generateServices();

  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm === '' || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.hsnSacCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const servicesSort = useTableSort(filteredServices);

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
          <p className="text-text-secondary">Showing {filteredServices.length} of {services.length} services</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, code, or HSN/SAC"
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
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({servicesSort.sortedData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <SortableHeader
                    column="code"
                    onSort={servicesSort.handleSort}
                    getSortIcon={servicesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Service Code
                  </SortableHeader>
                  <SortableHeader
                    column="name"
                    onSort={servicesSort.handleSort}
                    getSortIcon={servicesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Service Name
                  </SortableHeader>
                  <SortableHeader
                    column="hsnSacCode"
                    onSort={servicesSort.handleSort}
                    getSortIcon={servicesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    HSN/SAC Code
                  </SortableHeader>
                  <SortableHeader
                    column="status"
                    onSort={servicesSort.handleSort}
                    getSortIcon={servicesSort.getSortIcon}
                    className="text-left py-3 px-4 font-medium text-text-primary"
                  >
                    Status
                  </SortableHeader>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {servicesSort.sortedData.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="py-3 px-4 text-sm text-text-primary font-medium">
                      {service.code}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary font-medium text-primary cursor-pointer hover:underline">
                      {service.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary font-mono">
                      {service.hsnSacCode}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(service.status)}
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
          
          {servicesSort.sortedData.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-text-secondary">No services found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          Showing {servicesSort.sortedData.length} of {services.length} results
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