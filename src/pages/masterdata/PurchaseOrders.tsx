import { useState } from 'react';
import { FileText, Search, Download, Eye, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useTableSort, SortableHeader } from '../../hooks/useTableSort';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  contractCode: string;
  contractName: string;
  entityCode: string;
  entityName: string;
  locationCode: string;
  locationName: string;
  serviceType: 'AHC' | 'PEC';
  totalUnits: number;
  remainingUnits: number;
  usedUnits: number;
  utilizationPercentage: number;
  poDate: string;
  validUntil: string;
  status: 'Active' | 'Expired' | 'Exhausted' | 'Draft';
}

export const PurchaseOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Mock data generation with realistic purchase order data
  const generatePurchaseOrders = (): PurchaseOrder[] => {
    const contracts = [
      { code: 'CORP001', name: 'Tech Solutions India Pvt Ltd' },
      { code: 'CORP002', name: 'Global Services Ltd' },
      { code: 'CORP003', name: 'Manufacturing Co' },
      { code: 'CORP004', name: 'Financial Services Inc' },
      { code: 'CORP005', name: 'Healthcare Systems Ltd' },
      { code: 'CORP006', name: 'Digital Innovation Corp' },
      { code: 'CORP007', name: 'Engineering Solutions' },
      { code: 'CORP008', name: 'Pharma Industries' }
    ];

    const entities = [
      { code: 'ENT001', name: 'Tech Solutions India Pvt Ltd - Head Office' },
      { code: 'ENT002', name: 'Global Services Ltd - Regional Office' },
      { code: 'ENT003', name: 'Manufacturing Co - Manufacturing Unit' },
      { code: 'ENT004', name: 'Financial Services Inc - Sales Division' },
      { code: 'ENT005', name: 'Healthcare Systems Ltd - Support Center' },
      { code: 'ENT006', name: 'Digital Innovation Corp - Operations Hub' },
      { code: 'ENT007', name: 'Engineering Solutions - Head Office' },
      { code: 'ENT008', name: 'Pharma Industries - Regional Office' }
    ];

    const locations = [
      { code: 'LOC001', name: 'Andheri West Center' },
      { code: 'LOC002', name: 'Bandra East Branch' },
      { code: 'LOC003', name: 'Koregaon Park Clinic' },
      { code: 'LOC004', name: 'Koramangala Lab' },
      { code: 'LOC005', name: 'Anna Nagar Hub' },
      { code: 'LOC006', name: 'Banjara Hills Unit' },
      { code: 'LOC007', name: 'Connaught Place Facility' },
      { code: 'LOC008', name: 'Salt Lake Station' }
    ];

    const serviceTypes: ('AHC' | 'PEC')[] = ['AHC', 'PEC'];
    const statuses: ('Active' | 'Expired' | 'Exhausted' | 'Draft')[] = ['Active', 'Expired', 'Exhausted', 'Draft'];

    const purchaseOrders: PurchaseOrder[] = [];
    let poId = 1;

    contracts.forEach((contract, contractIndex) => {
      // Generate 2-4 POs per contract
      const poCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < poCount; i++) {
        const entity = entities[contractIndex % entities.length];
        const location = locations[(contractIndex * 2 + i) % locations.length];
        const serviceType = serviceTypes[i % serviceTypes.length];
        const totalUnits = (Math.floor(Math.random() * 10) + 5) * 100; // 500-1400 units
        const usedUnits = Math.floor(totalUnits * (Math.random() * 0.8)); // 0-80% used
        const remainingUnits = totalUnits - usedUnits;
        const utilizationPercentage = Math.round((usedUnits / totalUnits) * 100);
        
        // Determine status based on usage and random factors
        let status: 'Active' | 'Expired' | 'Exhausted' | 'Draft';
        if (remainingUnits === 0) {
          status = 'Exhausted';
        } else if (Math.random() < 0.1) {
          status = 'Expired';
        } else if (Math.random() < 0.05) {
          status = 'Draft';
        } else {
          status = 'Active';
        }

        // Generate dates
        const poDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const validUntil = new Date(poDate);
        validUntil.setFullYear(validUntil.getFullYear() + 1);

        purchaseOrders.push({
          id: poId.toString(),
          poNumber: `PO${poId.toString().padStart(4, '0')}/${new Date().getFullYear()}`,
          contractCode: contract.code,
          contractName: contract.name,
          entityCode: entity.code,
          entityName: entity.name,
          locationCode: location.code,
          locationName: location.name,
          serviceType: serviceType,
          totalUnits: totalUnits,
          remainingUnits: remainingUnits,
          usedUnits: usedUnits,
          utilizationPercentage: utilizationPercentage,
          poDate: poDate.toLocaleDateString('en-IN'),
          validUntil: validUntil.toLocaleDateString('en-IN'),
          status: status
        });
        
        poId++;
      }
    });

    return purchaseOrders;
  };

  const purchaseOrders = generatePurchaseOrders();
  const contracts = [...new Set(purchaseOrders.map(po => ({ code: po.contractCode, name: po.contractName })))];
  const entities = [...new Set(purchaseOrders.map(po => ({ code: po.entityCode, name: po.entityName })))];
  const locations = [...new Set(purchaseOrders.map(po => ({ code: po.locationCode, name: po.locationName })))];

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = searchTerm === '' || 
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.contractCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.entityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.locationCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    const matchesContract = contractFilter === 'all' || po.contractCode === contractFilter;
    const matchesEntity = entityFilter === 'all' || po.entityCode === entityFilter;
    const matchesLocation = locationFilter === 'all' || po.locationCode === locationFilter;
    const matchesService = serviceFilter === 'all' || po.serviceType === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesContract && matchesEntity && matchesLocation && matchesService;
  });

  const purchaseOrdersSort = useTableSort(filteredPurchaseOrders);

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Expired': 'bg-red-100 text-red-800 border-red-200',
      'Exhausted': 'bg-gray-100 text-gray-700 border-gray-300',
      'Draft': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const getServiceBadge = (service: string) => {
    return service === 'AHC' ? (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">AHC</Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800 border-purple-200">PEC</Badge>
    );
  };

  const getUtilizationBadge = (percentage: number) => {
    if (percentage >= 90) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">{percentage}%</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{percentage}%</Badge>;
    } else if (percentage >= 50) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{percentage}%</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 border-green-200">{percentage}%</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-text-secondary">Showing {filteredPurchaseOrders.length} of {purchaseOrders.length} purchase orders</p>
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
          placeholder="Search by PO number, contract, entity, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
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
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location.code} value={location.code}>
                  {location.code} - {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Service Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Service Types</SelectItem>
              <SelectItem value="AHC">Annual Health Checkup</SelectItem>
              <SelectItem value="PEC">Pre Employment Checkup</SelectItem>
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
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Exhausted">Exhausted</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader column="poNumber" onSort={purchaseOrdersSort.handleSort} getSortIcon={purchaseOrdersSort.getSortIcon}>
                  PO Number
                </SortableHeader>
                <SortableHeader column="contractCode" onSort={purchaseOrdersSort.handleSort} getSortIcon={purchaseOrdersSort.getSortIcon}>
                  Contract
                </SortableHeader>
                <th className="text-left p-3 font-medium">Entity</th>
                <th className="text-left p-3 font-medium">Location</th>
                <th className="text-left p-3 font-medium">Service Type</th>
                <SortableHeader column="totalUnits" onSort={purchaseOrdersSort.handleSort} getSortIcon={purchaseOrdersSort.getSortIcon}>
                  Total Units
                </SortableHeader>
                <SortableHeader column="remainingUnits" onSort={purchaseOrdersSort.handleSort} getSortIcon={purchaseOrdersSort.getSortIcon}>
                  Remaining Units
                </SortableHeader>
                <th className="text-left p-3 font-medium">Utilization</th>
                <SortableHeader column="status" onSort={purchaseOrdersSort.handleSort} getSortIcon={purchaseOrdersSort.getSortIcon}>
                  Status
                </SortableHeader>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrdersSort.sortedData.map((po, index) => (
                <tr key={po.id} className={index % 2 === 0 ? 'bg-background' : 'bg-card'}>
                  <td className="p-3">
                    <div className="font-medium text-text-primary">{po.poNumber}</div>
                    <div className="text-xs text-text-secondary">Valid until: {po.validUntil}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium text-blue-600">{po.contractCode}</div>
                      <div className="text-xs text-text-secondary">{po.contractName}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium text-purple-600">{po.entityCode}</div>
                      <div className="text-xs text-text-secondary">{po.entityName}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium text-green-600">{po.locationCode}</div>
                      <div className="text-xs text-text-secondary">{po.locationName}</div>
                    </div>
                  </td>
                  <td className="p-3">{getServiceBadge(po.serviceType)}</td>
                  <td className="p-3 text-text-secondary font-semibold">{po.totalUnits.toLocaleString()}</td>
                  <td className="p-3">
                    <div className="font-semibold text-text-primary">{po.remainingUnits.toLocaleString()}</div>
                    <div className="text-xs text-text-secondary">Used: {po.usedUnits.toLocaleString()}</div>
                  </td>
                  <td className="p-3">{getUtilizationBadge(po.utilizationPercentage)}</td>
                  <td className="p-3">{getStatusBadge(po.status)}</td>
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
        
        {filteredPurchaseOrders.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-text-secondary">No purchase orders match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};