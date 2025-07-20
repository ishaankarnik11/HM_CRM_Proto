import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Download,
  Building,
  MapPin,
  UserCheck
} from 'lucide-react';
import { EligibilityRule, Employee } from '@/services/eligibilityMockData';
import { useEmployees } from '@/hooks/useEligibilityQueries';

interface EligibleEmployeesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: EligibilityRule | null;
  eligibleEmployees?: Employee[];
}

const EligibleEmployeesModal: React.FC<EligibleEmployeesModalProps> = ({
  open,
  onOpenChange,
  rule,
  eligibleEmployees = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Get all employees for simulation if no eligible employees provided
  const { data: employeesResponse, isLoading: isLoadingEmployees } = useEmployees({ limit: 1000 });
  const allEmployees = employeesResponse?.data || [];
  
  // Simulate eligible employees based on rule criteria if not provided
  const simulatedEligibleEmployees = useMemo(() => {
    if (eligibleEmployees.length > 0) return eligibleEmployees;
    if (!rule) return [];
    if (!Array.isArray(allEmployees)) return [];
    
    // Simulate rule evaluation - in real implementation this would come from API
    return allEmployees.filter((employee, index) => {
      // Simulate rule matching based on rule conditions
      return rule.conditions.some(condition => {
        switch (condition.parameter) {
          case 'Age':
            const age = employee.age;
            switch (condition.operator) {
              case 'greater_than': return age > Number(condition.value);
              case 'less_than': return age < Number(condition.value);
              case 'equals': return age === Number(condition.value);
              default: return false;
            }
          case 'Service Period':
            const servicePeriod = parseInt(employee.servicePeriod.split(' ')[0]);
            switch (condition.operator) {
              case 'greater_than': return servicePeriod > Number(condition.value);
              case 'less_than': return servicePeriod < Number(condition.value);
              case 'equals': return servicePeriod === Number(condition.value);
              default: return false;
            }
          case 'Department':
            if (condition.operator === 'in_list' && Array.isArray(condition.value)) {
              return condition.value.includes(employee.department);
            }
            return employee.department === condition.value;
          case 'Location':
            if (condition.operator === 'in_list' && Array.isArray(condition.value)) {
              return condition.value.includes(employee.location);
            }
            return employee.location === condition.value;
          case 'Designation':
            if (condition.operator === 'in_list' && Array.isArray(condition.value)) {
              return condition.value.includes(employee.designation);
            }
            return employee.designation === condition.value;
          case 'Corporate':
            return employee.corporate === condition.value;
          default:
            return false;
        }
      }) || Math.random() > 0.3; // Add some random eligibility for demonstration
    }).slice(0, Math.floor(Math.random() * 200) + 50); // Random count between 50-250
  }, [rule, allEmployees, eligibleEmployees]);

  // Filter employees based on search
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return simulatedEligibleEmployees;
    
    const searchLower = searchTerm.toLowerCase();
    return simulatedEligibleEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchLower) ||
      employee.employeeId.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower) ||
      employee.designation.toLowerCase().includes(searchLower) ||
      employee.location.toLowerCase().includes(searchLower)
    );
  }, [simulatedEligibleEmployees, searchTerm]);

  // Paginate results
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleExportCSV = () => {
    if (!rule) return;
    
    const csvHeaders = ['Employee Name', 'Employee ID', 'Department', 'Designation', 'Location', 'Current Benefits'];
    const csvData = filteredEmployees.map(employee => [
      employee.name,
      employee.employeeId,
      employee.department,
      employee.designation,
      employee.location,
      employee.benefitGroup
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `eligible-employees-${rule.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!rule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employees Matching Rule: {rule.name}
          </DialogTitle>
          <DialogDescription>
            {filteredEmployees.length.toLocaleString()} employees match this rule's criteria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Export Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10"
              />
            </div>
            <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
          </div>

          {/* Results Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">
                  {filteredEmployees.length.toLocaleString()} Eligible Employees
                </h3>
                <p className="text-sm text-blue-700">
                  {searchTerm ? `Filtered from ${simulatedEligibleEmployees.length.toLocaleString()} total matches` : 'Total employees matching rule criteria'}
                </p>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Employee Name</TableHead>
                  <TableHead className="w-32">Employee ID</TableHead>
                  <TableHead className="w-32">Department</TableHead>
                  <TableHead className="w-48">Designation</TableHead>
                  <TableHead className="w-32">Location</TableHead>
                  <TableHead className="w-48">Current Benefits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingEmployees ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="w-48 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="w-24 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="w-32 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="w-36 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="w-24 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="w-32 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <Search className="h-12 w-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No employees found
                          </h3>
                          <p className="text-gray-500">
                            {searchTerm ? 'Try adjusting your search terms' : 'No employees match this rule criteria'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{employee.employeeId}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{employee.department}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{employee.designation}</div>
                        <div className="text-sm text-gray-500">
                          {employee.servicePeriod} service
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{employee.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {employee.benefitGroup}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">
                          ₹{employee.opdWalletAllocated.toLocaleString()} OPD
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredEmployees.length)} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of{' '}
                {filteredEmployees.length.toLocaleString()} employees
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EligibleEmployeesModal;