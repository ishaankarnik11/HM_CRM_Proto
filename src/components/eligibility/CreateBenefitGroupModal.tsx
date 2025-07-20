import { useState } from "react";
import { X, Users, Search, Filter, ChevronDown, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OPDService {
  enabled: boolean;
  sublimit: number;
  transactionLimit: number;
  reimbursementEnabled: boolean;
  familyAccess: {
    employee: boolean;
    spouse: boolean;
    children: boolean;
    parents: boolean;
    parentsInLaw: boolean;
  };
}

interface BenefitGroup {
  name: string;
  description: string;
  selectedEmployees: string[];
  ahcPackages: string[];
  additionalTests: string[];
  includeSpouse: boolean;
  opdWalletBalance: number;
  opdServices: {
    consultation: OPDService;
    diagnostics: OPDService;
    medicines: OPDService;
    dental: OPDService;
    visionCare: OPDService;
  };
}

interface CreateBenefitGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: BenefitGroup) => void;
  editingGroup?: any;
}

const CreateBenefitGroupModal = ({ isOpen, onClose, onSave, editingGroup }: CreateBenefitGroupModalProps) => {
  const [step, setStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [employeeStatus, setEmployeeStatus] = useState("all");
  const [showMemberModal, setShowMemberModal] = useState(false);

  const [group, setGroup] = useState<BenefitGroup>({
    name: editingGroup?.name || "",
    description: editingGroup?.description || "",
    selectedEmployees: editingGroup?.selectedEmployees || [],
    ahcPackages: editingGroup?.ahcPackages || [],
    additionalTests: editingGroup?.additionalTests || [],
    includeSpouse: editingGroup?.includeSpouse || false,
    opdWalletBalance: editingGroup?.opdWalletBalance || 0,
    opdServices: {
      consultation: { enabled: false, sublimit: 0, transactionLimit: 0, reimbursementEnabled: false, familyAccess: { employee: true, spouse: false, children: false, parents: false, parentsInLaw: false } },
      diagnostics: { enabled: false, sublimit: 0, transactionLimit: 0, reimbursementEnabled: false, familyAccess: { employee: true, spouse: false, children: false, parents: false, parentsInLaw: false } },
      medicines: { enabled: false, sublimit: 0, transactionLimit: 0, reimbursementEnabled: false, familyAccess: { employee: true, spouse: false, children: false, parents: false, parentsInLaw: false } },
      dental: { enabled: false, sublimit: 0, transactionLimit: 0, reimbursementEnabled: false, familyAccess: { employee: true, spouse: false, children: false, parents: false, parentsInLaw: false } },
      visionCare: { enabled: false, sublimit: 0, transactionLimit: 0, reimbursementEnabled: false, familyAccess: { employee: true, spouse: false, children: false, parents: false, parentsInLaw: false } },
    },
  });

  // Mock data
  const mockEmployees = [
    { id: "EMP001", name: "Rajesh Kumar", email: "rajesh.kumar@company.com", department: "Engineering", designation: "Senior Developer", location: "Mumbai - Andheri" },
    { id: "EMP002", name: "Priya Sharma", email: "priya.sharma@company.com", department: "Finance", designation: "Financial Analyst", location: "Delhi - Connaught Place" },
    { id: "EMP003", name: "Amit Patel", email: "amit.patel@company.com", department: "HR", designation: "HR Manager", location: "Bangalore - Whitefield" },
    { id: "EMP004", name: "Sneha Reddy", email: "sneha.reddy@company.com", department: "Engineering", designation: "Tech Lead", location: "Hyderabad - HITEC City" },
    { id: "EMP005", name: "Vikram Singh", email: "vikram.singh@company.com", department: "Sales", designation: "Sales Manager", location: "Mumbai - Andheri" },
    { id: "EMP006", name: "Anjali Gupta", email: "anjali.gupta@company.com", department: "Marketing", designation: "Marketing Executive", location: "Delhi - Connaught Place" },
    { id: "EMP007", name: "Ravi Kumar", email: "ravi.kumar@company.com", department: "Engineering", designation: "Developer", location: "Bangalore - Whitefield" },
    { id: "EMP008", name: "Meera Nair", email: "meera.nair@company.com", department: "Finance", designation: "Accountant", location: "Mumbai - Andheri" },
  ];

  const designationOptions = ["Senior Developer", "Financial Analyst", "HR Manager", "Tech Lead", "Sales Manager", "Marketing Executive", "Developer", "Accountant"];
  const locationOptions = ["Mumbai - Andheri", "Delhi - Connaught Place", "Bangalore - Whitefield", "Hyderabad - HITEC City"];
  const departmentOptions = ["Engineering", "Finance", "HR", "Sales", "Marketing"];
  const ahcPackageOptions = ["Standard", "Premium", "Executive", "Comprehensive", "Wellness"];
  const additionalTestOptions = ["Vitamin D", "B12", "Thyroid", "HbA1c", "Lipid Profile", "Iron Studies", "Kidney Panel"];

  // Filter employees
  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                         emp.id.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                         emp.email.toLowerCase().includes(employeeSearch.toLowerCase());
    const matchesDesignation = selectedDesignations.length === 0 || selectedDesignations.includes(emp.designation);
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(emp.location);
    const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(emp.department);
    const matchesStatus = employeeStatus === "all" || emp.status === employeeStatus;

    return matchesSearch && matchesDesignation && matchesLocation && matchesDepartment && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 50;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEmployeeToggle = (employeeId: string) => {
    setGroup(prev => {
      const newSelectedEmployees = prev.selectedEmployees.includes(employeeId)
        ? prev.selectedEmployees.filter(id => id !== employeeId)
        : [...prev.selectedEmployees, employeeId];
      
      console.log('Employee toggle:', employeeId, 'New selected:', newSelectedEmployees);
      
      return {
        ...prev,
        selectedEmployees: newSelectedEmployees
      };
    });
  };

  const handleBulkSelect = () => {
    const allCurrentPageIds = paginatedEmployees.map(emp => emp.id);
    const allSelected = allCurrentPageIds.every(id => group.selectedEmployees.includes(id));
    
    if (allSelected) {
      setGroup(prev => ({
        ...prev,
        selectedEmployees: prev.selectedEmployees.filter(id => !allCurrentPageIds.includes(id))
      }));
    } else {
      setGroup(prev => ({
        ...prev,
        selectedEmployees: [...new Set([...prev.selectedEmployees, ...allCurrentPageIds])]
      }));
    }
  };

  const clearSelection = () => {
    setGroup(prev => ({ ...prev, selectedEmployees: [] }));
  };

  const handleSave = () => {
    if (!group.name.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (group.selectedEmployees.length === 0) {
      alert("Please select at least one employee");
      return;
    }
    if (group.ahcPackages.length === 0) {
      alert("Please select at least one AHC package");
      return;
    }

    // OPD Validation (same as Corporate Rules)
    const enabledServices = Object.values(group.opdServices).filter(service => service.enabled);
    if (enabledServices.length > 0) {
      if (group.opdWalletBalance <= 0) {
        alert("Main wallet balance must be greater than 0 if any OPD service is enabled");
        return;
      }

      const totalSublimits = enabledServices.reduce((sum, service) => sum + service.sublimit, 0);
      if (totalSublimits !== group.opdWalletBalance) {
        alert("Service sublimits must sum exactly to the main wallet balance");
        return;
      }

      for (const [serviceName, service] of Object.entries(group.opdServices)) {
        if (service.enabled) {
          if (service.sublimit <= 0) {
            alert(`${serviceName} sublimit must be greater than 0`);
            return;
          }
          if (service.transactionLimit > service.sublimit) {
            alert(`${serviceName} per-transaction limit cannot exceed its sublimit`);
            return;
          }
        }
      }
    }

    onSave(group);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[80vw] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {editingGroup ? 'Edit Benefit Group' : 'Create New Benefit Group'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {step} of 2: {step === 1 ? 'Group Details & Member Selection' : 'Benefit Assignment'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {step === 1 && (
            <div className="flex h-full">
              {/* Left Panel - 40% */}
              <div className="w-[40%] border-r bg-gray-50 p-6 overflow-y-auto">
                {/* Group Details */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium text-lg">Group Details</h3>
                  
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      placeholder="Enter group name"
                      value={group.name}
                      onChange={(e) => setGroup({ ...group, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the purpose of this group"
                      value={group.description}
                      onChange={(e) => setGroup({ ...group, description: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Employee Filters</h3>
                  
                  <div>
                    <Label>Search</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by Employee ID, Name, Email"
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Designation</Label>
                    <Select value={selectedDesignations.length > 0 ? selectedDesignations[0] : "all"} onValueChange={(value) => setSelectedDesignations(value === "all" ? [] : [value])}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All Designations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Designations</SelectItem>
                        {designationOptions.map(designation => (
                          <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Select value={selectedLocations.length > 0 ? selectedLocations[0] : "all"} onValueChange={(value) => setSelectedLocations(value === "all" ? [] : [value])}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locationOptions.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Department</Label>
                    <Select value={selectedDepartments.length > 0 ? selectedDepartments[0] : "all"} onValueChange={(value) => setSelectedDepartments(value === "all" ? [] : [value])}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departmentOptions.map(department => (
                          <SelectItem key={department} value={department}>{department}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Employee Status</Label>
                    <Select value={employeeStatus} onValueChange={setEmployeeStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Right Panel - 60% */}
              <div className="w-[60%] p-6 overflow-y-auto">
                {/* Employee Selection Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={paginatedEmployees.length > 0 && paginatedEmployees.every(emp => group.selectedEmployees.includes(emp.id))}
                      onCheckedChange={handleBulkSelect}
                    />
                    <span className="text-sm font-medium">
                      {group.selectedEmployees.length} of {filteredEmployees.length} employees selected
                    </span>
                  </div>
                  {group.selectedEmployees.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      Clear Selection
                    </Button>
                  )}
                </div>

                {/* Employee Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">☐</TableHead>
                        <TableHead>Emp ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEmployees.map((employee) => (
                        <TableRow 
                          key={employee.id}
                          className={group.selectedEmployees.includes(employee.id) ? "bg-blue-50" : ""}
                        >
                          <TableCell>
                            <Checkbox
                              checked={group.selectedEmployees.includes(employee.id)}
                              onCheckedChange={() => handleEmployeeToggle(employee.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{employee.id}</TableCell>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.designation}</TableCell>
                          <TableCell>{employee.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Selected Members Preview */}
                {group.selectedEmployees.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-700">
                        Selected Members ({group.selectedEmployees.length} employees)
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setShowMemberModal(true)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.selectedEmployees.slice(0, 10).map((empId) => {
                        const emp = mockEmployees.find(e => e.id === empId);
                        return emp ? (
                          <Badge key={empId} variant="secondary" className="text-xs">
                            {emp.name}
                          </Badge>
                        ) : null;
                      })}
                      {group.selectedEmployees.length > 10 && (
                        <Badge variant="secondary" className="text-xs">
                          +{group.selectedEmployees.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Selected Members Summary */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-lg mb-2">Selected Members ({group.selectedEmployees.length} employees)</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {group.selectedEmployees.slice(0, 15).map((empId) => {
                    const emp = mockEmployees.find(e => e.id === empId);
                    return emp ? (
                      <Badge key={empId} variant="outline" className="text-xs">
                        {emp.name}
                        <button 
                          onClick={() => handleEmployeeToggle(empId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                  {group.selectedEmployees.length > 15 && (
                    <Badge variant="outline" className="text-xs">
                      +{group.selectedEmployees.length - 15} more
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  These employees will receive the benefits configured below, overriding any applicable corporate rules
                </p>
              </div>

              {/* AHC Benefits Section - Identical to Corporate Rules */}
              <div>
                <h3 className="font-medium text-lg mb-3">AHC (Annual Health Check) Benefits</h3>
                <p className="text-sm text-gray-600 mb-4">Select health check packages for group members (same options as Corporate Rules)</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {ahcPackageOptions.map((pkg) => (
                    <label key={pkg} className="flex items-center space-x-2">
                      <Checkbox
                        checked={group.ahcPackages.includes(pkg)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGroup({ ...group, ahcPackages: [...group.ahcPackages, pkg] });
                          } else {
                            setGroup({
                              ...group,
                              ahcPackages: group.ahcPackages.filter((p) => p !== pkg),
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{pkg}</span>
                    </label>
                  ))}
                </div>

                {group.ahcPackages.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Additional Tests</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {additionalTestOptions.map((test) => (
                        <label key={test} className="flex items-center space-x-2">
                          <Checkbox
                            checked={group.additionalTests.includes(test)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setGroup({ ...group, additionalTests: [...group.additionalTests, test] });
                              } else {
                                setGroup({
                                  ...group,
                                  additionalTests: group.additionalTests.filter((t) => t !== test),
                                });
                              }
                            }}
                          />
                          <span className="text-sm">{test}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <Switch
                      checked={group.includeSpouse}
                      onCheckedChange={(checked) => setGroup({ ...group, includeSpouse: checked })}
                    />
                    <span className="text-sm">Include spouse in AHC benefits</span>
                  </label>
                </div>
              </div>

              {/* OPD Benefits Section - Identical to Corporate Rules */}
              <div>
                <h3 className="font-medium text-lg mb-3">OPD (Out Patient Department) Benefits</h3>
                <p className="text-sm text-gray-600 mb-4">Configure OPD wallet and service limits (same structure as Corporate Rules)</p>
                
                <div className="mb-6">
                  <Label htmlFor="walletBalance">Total Annual Wallet Amount per Employee</Label>
                  <Input
                    id="walletBalance"
                    type="number"
                    placeholder="0"
                    value={group.opdWalletBalance}
                    onChange={(e) => setGroup({ ...group, opdWalletBalance: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-48"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Main funding source for all OPD transactions
                  </p>
                </div>

                {/* Service-Specific Configuration - Identical to Corporate Rules */}
                <div className="space-y-4">
                  {Object.entries(group.opdServices).map(([serviceName, service]) => (
                    <div key={serviceName} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={service.enabled}
                            onCheckedChange={(checked) =>
                              setGroup({
                                ...group,
                                opdServices: {
                                  ...group.opdServices,
                                  [serviceName]: { ...service, enabled: !!checked },
                                },
                              })
                            }
                          />
                          <span className="text-sm font-medium capitalize">
                            {serviceName === 'visionCare' ? 'VisionCare' : serviceName}
                          </span>
                        </label>
                      </div>

                      {service.enabled && (
                        <div className="space-y-4">
                          {/* Financial Configuration */}
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-xs">Sublimit Amount (₹)</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={service.sublimit}
                                onChange={(e) =>
                                  setGroup({
                                    ...group,
                                    opdServices: {
                                      ...group.opdServices,
                                      [serviceName]: {
                                        ...service,
                                        sublimit: parseInt(e.target.value) || 0,
                                      },
                                    },
                                  })
                                }
                                className="mt-1"
                              />
                              <p className="text-xs text-gray-500 mt-1">Budget control</p>
                            </div>
                            
                            <div>
                              <Label className="text-xs">Per-Transaction Limit (₹)</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={service.transactionLimit}
                                onChange={(e) =>
                                  setGroup({
                                    ...group,
                                    opdServices: {
                                      ...group.opdServices,
                                      [serviceName]: {
                                        ...service,
                                        transactionLimit: parseInt(e.target.value) || 0,
                                      },
                                    },
                                  })
                                }
                                className="mt-1"
                              />
                              <p className="text-xs text-gray-500 mt-1">Cashless only</p>
                            </div>

                            <div className="flex flex-col justify-center">
                              <label className="flex items-center space-x-2">
                                <Checkbox
                                  checked={service.reimbursementEnabled}
                                  onCheckedChange={(checked) =>
                                    setGroup({
                                      ...group,
                                      opdServices: {
                                        ...group.opdServices,
                                        [serviceName]: {
                                          ...service,
                                          reimbursementEnabled: !!checked,
                                        },
                                      },
                                    })
                                  }
                                />
                                <span className="text-xs">Enable reimbursement</span>
                              </label>
                            </div>
                          </div>

                          {/* Family Member Access Configuration - Identical to Corporate Rules */}
                          <div className="border-t pt-3">
                            <Label className="text-xs font-medium mb-2 block">Family Member Access</Label>
                            <div className="grid grid-cols-5 gap-3">
                              <label className="flex items-center space-x-2">
                                <Checkbox
                                  checked={service.familyAccess.employee}
                                  disabled={true}
                                  className="opacity-50"
                                />
                                <span className="text-xs text-gray-500">Employee</span>
                              </label>
                              
                              <label className="flex items-center space-x-2">
                                <Checkbox
                                  checked={service.familyAccess.spouse}
                                  onCheckedChange={(checked) =>
                                    setGroup({
                                      ...group,
                                      opdServices: {
                                        ...group.opdServices,
                                        [serviceName]: {
                                          ...service,
                                          familyAccess: {
                                            ...service.familyAccess,
                                            spouse: !!checked,
                                          },
                                        },
                                      },
                                    })
                                  }
                                />
                                <span className="text-xs">Spouse</span>
                              </label>
                              
                              <label className="flex items-center space-x-2">
                                <Checkbox
                                  checked={service.familyAccess.children}
                                  onCheckedChange={(checked) =>
                                    setGroup({
                                      ...group,
                                      opdServices: {
                                        ...group.opdServices,
                                        [serviceName]: {
                                          ...service,
                                          familyAccess: {
                                            ...service.familyAccess,
                                            children: !!checked,
                                          },
                                        },
                                      },
                                    })
                                  }
                                />
                                <span className="text-xs">Children</span>
                              </label>
                              
                              <label className="flex items-center space-x-2">
                                <Checkbox
                                  checked={service.familyAccess.parents}
                                  onCheckedChange={(checked) =>
                                    setGroup({
                                      ...group,
                                      opdServices: {
                                        ...group.opdServices,
                                        [serviceName]: {
                                          ...service,
                                          familyAccess: {
                                            ...service.familyAccess,
                                            parents: !!checked,
                                          },
                                        },
                                      },
                                    })
                                  }
                                />
                                <span className="text-xs">Parents</span>
                              </label>
                              
                              <label className="flex items-center space-x-2">
                                <Checkbox
                                  checked={service.familyAccess.parentsInLaw}
                                  onCheckedChange={(checked) =>
                                    setGroup({
                                      ...group,
                                      opdServices: {
                                        ...group.opdServices,
                                        [serviceName]: {
                                          ...service,
                                          familyAccess: {
                                            ...service.familyAccess,
                                            parentsInLaw: !!checked,
                                          },
                                        },
                                      },
                                    })
                                  }
                                />
                                <span className="text-xs">Parents-in-law</span>
                              </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Employee is always included. Configure which other family members can access this service.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Validation Summary - Same as Corporate Rules */}
                {group.opdWalletBalance > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded border">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Total Sublimits:</span>
                        <span className="font-medium">
                          ₹{Object.values(group.opdServices).reduce((sum, service) => 
                            service.enabled ? sum + service.sublimit : sum, 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Main Wallet:</span>
                        <span className="font-medium">₹{group.opdWalletBalance}</span>
                      </div>
                      {Object.values(group.opdServices).reduce((sum, service) => 
                        service.enabled ? sum + service.sublimit : sum, 0
                      ) !== group.opdWalletBalance && group.opdWalletBalance > 0 && (
                        <div className="text-red-600 text-xs mt-1">
                          ⚠️ Sublimits must sum exactly to main wallet balance
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between">
          <div className="flex gap-3">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step === 1 ? (
              <Button 
                onClick={() => setStep(2)}
                disabled={group.selectedEmployees.length === 0 || !group.name.trim()}
              >
                Next: Assign Benefits ({group.selectedEmployees.length} selected)
              </Button>
            ) : (
              <Button onClick={handleSave}>
                {editingGroup ? 'Update Group' : 'Save Group'}
              </Button>
            )}
          </div>
          {/* Debug info */}
          {step === 1 && (
            <div className="text-xs text-gray-500 mt-2">
              Debug: Name="{group.name}", Selected={group.selectedEmployees.length}, 
              Name Valid: {!!group.name.trim()}, 
              Button Disabled: {group.selectedEmployees.length === 0 || !group.name.trim()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBenefitGroupModal;