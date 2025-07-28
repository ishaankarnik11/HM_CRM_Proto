import { useState } from 'react';
import { Users, Search, Download, Eye, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useTableSort, SortableHeader } from '../../hooks/useTableSort';

interface Entity {
  id: string;
  name: string;
  entityCode: string;
  corporateName: string;
  corporateId: string;
  gstin?: string;
  locationCount: number;
  employeeCount: number;
  status: 'Active' | 'Inactive';
  contractCode: string;
  contractName: string;
}

export const Entities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [corporateFilter, setCorporateFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');
  const [hasGSTINFilter, setHasGSTINFilter] = useState('all');

  // Mock data generation
  const generateEntities = (): Entity[] => {
    const corporateNames = [
      'Tech Solutions India Pvt Ltd', 'Global Services Ltd', 'Manufacturing Co', 'Financial Services Inc',
      'Healthcare Systems Ltd', 'Digital Innovation Corp', 'Engineering Solutions', 'Pharma Industries',
      'Logistics Network Ltd', 'Energy Solutions Inc', 'Construction Corp', 'Retail Chain Ltd',
      'Media House Pvt Ltd', 'Food Processing Inc', 'Textile Industries', 'Chemical Solutions'
    ];

    const entitySuffixes = ['Head Office', 'Regional Office', 'Manufacturing Unit', 'Sales Division', 'Support Center', 'Operations Hub'];
    const contractCodes = ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006', 'CORP007', 'CORP008'];
    
    const entities: Entity[] = [];
    let entityId = 1;
    
    corporateNames.forEach((corporateName, corpIndex) => {
      const entitiesPerCorp = Math.floor(Math.random() * 4) + 2; // 2-5 entities per corporate
      
      for (let i = 0; i < entitiesPerCorp; i++) {
        const suffix = entitySuffixes[i % entitySuffixes.length];
        const hasGSTIN = Math.random() > 0.6; // 40% chance of having separate GSTIN
        const contractIndex = (corpIndex * 2 + i) % contractCodes.length;
        const contractCode = contractCodes[contractIndex];
        
        entities.push({
          id: entityId.toString(),
          name: `${corporateName} - ${suffix}`,
          entityCode: `ENT${entityId.toString().padStart(3, '0')}`,
          corporateName: corporateName,
          corporateId: `corp-${corpIndex + 1}`,
          gstin: hasGSTIN ? `27AABCT${(1000 + entityId).toString()}M${entityId % 10}Z${(entityId % 9) + 1}` : undefined,
          locationCount: Math.floor(Math.random() * 8) + 1, // 1-8 locations
          employeeCount: Math.floor(Math.random() * 500) + 50, // 50-549 employees
          status: entityId % 12 === 0 ? 'Inactive' : 'Active',
          contractCode: contractCode,
          contractName: corporateName
        });
        
        entityId++;
      }
    });
    
    return entities;
  };

  const entities = generateEntities();
  const corporates = [...new Set(entities.map(e => e.corporateName))];
  const contracts = [...new Set(entities.map(e => ({ code: e.contractCode, name: e.contractName })))];

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = searchTerm === '' || 
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.entityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entity.gstin && entity.gstin.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || entity.status === statusFilter;
    const matchesCorporate = corporateFilter === 'all' || entity.corporateName === corporateFilter;
    const matchesContract = contractFilter === 'all' || entity.contractCode === contractFilter;
    const matchesGSTIN = hasGSTINFilter === 'all' || 
      (hasGSTINFilter === 'yes' && entity.gstin) ||
      (hasGSTINFilter === 'no' && !entity.gstin);
    
    return matchesSearch && matchesStatus && matchesCorporate && matchesContract && matchesGSTIN;
  });

  const entitiesSort = useTableSort(filteredEntities);

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">Inactive</Badge>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-text-secondary">Showing {filteredEntities.length} of {entities.length} entities</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search entities by name, code, or GSTIN"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Select value={corporateFilter} onValueChange={setCorporateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Corporates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Corporates</SelectItem>
              {corporates.map(corporate => (
                <SelectItem key={corporate} value={corporate}>{corporate}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={contractFilter} onValueChange={setContractFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Contracts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contracts</SelectItem>
              {contracts.map(contract => (
                <SelectItem key={contract.code} value={contract.code}>{contract.code} - {contract.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={hasGSTINFilter} onValueChange={setHasGSTINFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Has Separate GSTIN" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
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

      {/* Entities Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader column="name" onSort={entitiesSort.handleSort} getSortIcon={entitiesSort.getSortIcon}>
                  Entity Name
                </SortableHeader>
                <SortableHeader column="entityCode" onSort={entitiesSort.handleSort} getSortIcon={entitiesSort.getSortIcon}>
                  Entity Code
                </SortableHeader>
                <SortableHeader column="corporateName" onSort={entitiesSort.handleSort} getSortIcon={entitiesSort.getSortIcon}>
                  Corporate Name
                </SortableHeader>
                <SortableHeader column="contractCode" onSort={entitiesSort.handleSort} getSortIcon={entitiesSort.getSortIcon}>
                  Contract
                </SortableHeader>
                <th className="text-left p-3 font-medium">GSTIN</th>
                <SortableHeader column="locationCount" onSort={entitiesSort.handleSort} getSortIcon={entitiesSort.getSortIcon}>
                  Locations
                </SortableHeader>
                <SortableHeader column="employeeCount" onSort={entitiesSort.handleSort} getSortIcon={entitiesSort.getSortIcon}>
                  Employees
                </SortableHeader>
                <SortableHeader column="status" onSort={entitiesSort.handleSort} getSortIcon={entitiesSort.getSortIcon}>
                  Status
                </SortableHeader>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entitiesSort.sortedData.map((entity, index) => (
                <tr key={entity.id} className={index % 2 === 0 ? 'bg-background' : 'bg-card'}>
                  <td className="p-3">
                    <div className="font-medium text-text-primary">{entity.name}</div>
                  </td>
                  <td className="p-3 text-text-secondary">{entity.entityCode}</td>
                  <td className="p-3 text-text-secondary">{entity.corporateName}</td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium text-blue-600">{entity.contractCode}</div>
                      <div className="text-xs text-text-secondary">{entity.contractName}</div>
                    </div>
                  </td>
                  <td className="p-3 text-text-secondary">
                    {entity.gstin || <span className="text-gray-400">-</span>}
                  </td>
                  <td className="p-3 text-text-secondary">{entity.locationCount}</td>
                  <td className="p-3 text-text-secondary">{entity.employeeCount.toLocaleString()}</td>
                  <td className="p-3">{getStatusBadge(entity.status)}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEntities.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-text-secondary">No entities match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};