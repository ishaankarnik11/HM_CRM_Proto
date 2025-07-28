import { useState } from 'react';
import { UserCheck, Search, Download, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useTableSort, SortableHeader } from '../../hooks/useTableSort';

interface HRContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  mappedTo: string;
  mappingLevel: 'Corporate' | 'Entity' | 'Location';
  corporateName: string;
  contractCode: string;
  contractName: string;
  entityCode?: string;
  entityName?: string;
  locationCode?: string;
  locationName?: string;
  status: 'Active' | 'Inactive';
}

export const HRContacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mappingLevelFilter, setMappingLevelFilter] = useState('all');
  const [corporateFilter, setCorporateFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Mock data generation
  const generateHRContacts = (): HRContact[] => {
    const corporateNames = [
      'Tech Solutions India Pvt Ltd', 'Global Services Ltd', 'Manufacturing Co', 'Financial Services Inc',
      'Healthcare Systems Ltd', 'Digital Innovation Corp', 'Engineering Solutions', 'Pharma Industries',
      'Logistics Network Ltd', 'Energy Solutions Inc'
    ];

    const contractCodes = ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006', 'CORP007', 'CORP008', 'CORP009', 'CORP010'];
    const entityCodes = ['ENT001', 'ENT002', 'ENT003', 'ENT004', 'ENT005', 'ENT006', 'ENT007', 'ENT008'];
    const locationCodes = ['LOC001', 'LOC002', 'LOC003', 'LOC004', 'LOC005', 'LOC006', 'LOC007', 'LOC008'];

    const hrNames = [
      'Rajesh Kumar', 'Priya Sharma', 'Suresh Babu', 'Anita Gupta', 'Vikram Singh', 'Deepika Patel',
      'Amit Verma', 'Sunita Joshi', 'Rohit Agarwal', 'Kavita Reddy', 'Manish Gupta', 'Sneha Rao',
      'Arjun Nair', 'Pooja Mehta', 'Sanjay Yadav', 'Ritu Sinha', 'Nitin Sharma', 'Meera Iyer',
      'Karan Malhotra', 'Divya Chopra', 'Arun Kumar', 'Lakshmi Priya', 'Vivek Gupta', 'Preeti Desai'
    ];

    const designations = ['HR Manager', 'HR Executive', 'HR Director', 'HRBP', 'Talent Acquisition Manager', 'HR Generalist'];
    const mappingLevels: ('Corporate' | 'Entity' | 'Location')[] = ['Corporate', 'Entity', 'Location'];

    const hrContacts: HRContact[] = [];
    let contactId = 1;

    corporateNames.forEach((corporateName, corpIndex) => {
      // Corporate level HR (1-2 per corporate)
      const corpHRCount = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < corpHRCount; i++) {
        const name = hrNames[contactId % hrNames.length];
        const contractCode = contractCodes[corpIndex % contractCodes.length];
        hrContacts.push({
          id: contactId.toString(),
          name: name,
          email: `${name.toLowerCase().replace(' ', '.')}.${corpIndex + 1}@${corporateName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          designation: designations[Math.floor(Math.random() * designations.length)],
          mappedTo: corporateName,
          mappingLevel: 'Corporate',
          corporateName: corporateName,
          contractCode: contractCode,
          contractName: corporateName,
          status: contactId % 15 === 0 ? 'Inactive' : 'Active'
        });
        contactId++;
      }

      // Entity level HR (2-3 entities per corporate, 1 HR per entity)
      const entityCount = Math.floor(Math.random() * 2) + 2; // 2-3 entities
      for (let e = 0; e < entityCount; e++) {
        const entityName = `${corporateName} - Entity ${e + 1}`;
        const name = hrNames[contactId % hrNames.length];
        const contractCode = contractCodes[corpIndex % contractCodes.length];
        const entityCode = entityCodes[(corpIndex * 3 + e) % entityCodes.length];
        hrContacts.push({
          id: contactId.toString(),
          name: name,
          email: `${name.toLowerCase().replace(' ', '.')}.e${e + 1}@${corporateName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          designation: designations[Math.floor(Math.random() * designations.length)],
          mappedTo: entityName,
          mappingLevel: 'Entity',
          corporateName: corporateName,
          contractCode: contractCode,
          contractName: corporateName,
          entityCode: entityCode,
          entityName: entityName,
          status: contactId % 20 === 0 ? 'Inactive' : 'Active'
        });
        contactId++;

        // Location level HR (1-2 locations per entity, 1 HR per location)
        const locationCount = Math.random() > 0.6 ? 2 : 1;
        for (let l = 0; l < locationCount; l++) {
          const locationName = `${entityName} - Branch ${l + 1}`;
          const name = hrNames[contactId % hrNames.length];
          const contractCode = contractCodes[corpIndex % contractCodes.length];
          const entityCode = entityCodes[(corpIndex * 3 + e) % entityCodes.length];
          const locationCode = locationCodes[(contactId) % locationCodes.length];
          hrContacts.push({
            id: contactId.toString(),
            name: name,
            email: `${name.toLowerCase().replace(' ', '.')}.b${l + 1}@${corporateName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
            phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            designation: designations[Math.floor(Math.random() * designations.length)],
            mappedTo: locationName,
            mappingLevel: 'Location',
            corporateName: corporateName,
            contractCode: contractCode,
            contractName: corporateName,
            entityCode: entityCode,
            entityName: entityName,
            locationCode: locationCode,
            locationName: locationName,
            status: contactId % 25 === 0 ? 'Inactive' : 'Active'
          });
          contactId++;
        }
      }
    });

    return hrContacts;
  };

  const hrContacts = generateHRContacts();
  const corporates = [...new Set(hrContacts.map(h => h.corporateName))];
  const contracts = [...new Set(hrContacts.map(h => ({ code: h.contractCode, name: h.contractName })))];
  const entities = [...new Set(hrContacts.map(h => h.entityCode ? { code: h.entityCode, name: h.entityName } : null).filter(Boolean))];
  const locations = [...new Set(hrContacts.map(h => h.locationCode ? { code: h.locationCode, name: h.locationName } : null).filter(Boolean))];

  const filteredHRContacts = hrContacts.filter(contact => {
    const matchesSearch = searchTerm === '' || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesMappingLevel = mappingLevelFilter === 'all' || contact.mappingLevel === mappingLevelFilter;
    const matchesCorporate = corporateFilter === 'all' || contact.corporateName === corporateFilter;
    const matchesContract = contractFilter === 'all' || contact.contractCode === contractFilter;
    const matchesEntity = entityFilter === 'all' || (contact.entityCode && contact.entityCode === entityFilter);
    const matchesLocation = locationFilter === 'all' || (contact.locationCode && contact.locationCode === locationFilter);
    
    return matchesSearch && matchesStatus && matchesMappingLevel && matchesCorporate && matchesContract && matchesEntity && matchesLocation;
  });

  const hrContactsSort = useTableSort(filteredHRContacts);

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300">Inactive</Badge>
    );
  };

  const getMappingLevelBadge = (level: string) => {
    const colors = {
      'Corporate': 'bg-blue-100 text-blue-800 border-blue-200',
      'Entity': 'bg-green-100 text-green-800 border-green-200',
      'Location': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return <Badge className={colors[level as keyof typeof colors]}>{level.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-text-secondary">Showing {filteredHRContacts.length} of {hrContacts.length} HR contacts</p>
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
          placeholder="Search by HR name, email, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Select value={mappingLevelFilter} onValueChange={setMappingLevelFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Mapping Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
              <SelectItem value="Entity">Entity</SelectItem>
              <SelectItem value="Location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              {entities.map(entity => entity && (
                <SelectItem key={entity.code} value={entity.code}>
                  {entity.code} - {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => location && (
                <SelectItem key={location.code} value={location.code}>
                  {location.code} - {location.name}
                </SelectItem>
              ))}
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

      {/* HR Contacts Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader column="name" onSort={hrContactsSort.handleSort} getSortIcon={hrContactsSort.getSortIcon}>
                  HR Name
                </SortableHeader>
                <SortableHeader column="email" onSort={hrContactsSort.handleSort} getSortIcon={hrContactsSort.getSortIcon}>
                  Email
                </SortableHeader>
                <th className="text-left p-3 font-medium">Phone</th>
                <SortableHeader column="designation" onSort={hrContactsSort.handleSort} getSortIcon={hrContactsSort.getSortIcon}>
                  Designation
                </SortableHeader>
                <SortableHeader column="contractCode" onSort={hrContactsSort.handleSort} getSortIcon={hrContactsSort.getSortIcon}>
                  Contract
                </SortableHeader>
                <th className="text-left p-3 font-medium">Entity</th>
                <th className="text-left p-3 font-medium">Location</th>
                <th className="text-left p-3 font-medium">Mapping Level</th>
                <SortableHeader column="status" onSort={hrContactsSort.handleSort} getSortIcon={hrContactsSort.getSortIcon}>
                  Status
                </SortableHeader>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hrContactsSort.sortedData.map((contact, index) => (
                <tr key={contact.id} className={index % 2 === 0 ? 'bg-background' : 'bg-card'}>
                  <td className="p-3">
                    <div className="font-medium text-text-primary">{contact.name}</div>
                  </td>
                  <td className="p-3">
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </td>
                  <td className="p-3 text-text-secondary">{contact.phone}</td>
                  <td className="p-3 text-text-secondary">{contact.designation}</td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium text-blue-600">{contact.contractCode}</div>
                      <div className="text-xs text-text-secondary">{contact.contractName}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    {contact.entityCode ? (
                      <div className="text-sm">
                        <div className="font-medium text-purple-600">{contact.entityCode}</div>
                        <div className="text-xs text-text-secondary">{contact.entityName}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    {contact.locationCode ? (
                      <div className="text-sm">
                        <div className="font-medium text-green-600">{contact.locationCode}</div>
                        <div className="text-xs text-text-secondary">{contact.locationName}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">{getMappingLevelBadge(contact.mappingLevel)}</td>
                  <td className="p-3">{getStatusBadge(contact.status)}</td>
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
        
        {filteredHRContacts.length === 0 && (
          <div className="text-center py-8">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-text-secondary">No HR contacts match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};