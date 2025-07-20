import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Building,
  Users,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Plus,
  Copy,
  Play,
  UserPlus,
  UserMinus,
  UserCheck,
  X,
  Edit
} from "lucide-react";
import { Employee, Corporate, BenefitGroup, EligibilityRule, ProgramTerm } from "@/services/eligibilityMockData";
import { useBenefitGroups, useEligibilityRules } from "@/hooks/useEligibilityQueries";
import { eligibilityAPI } from "@/services/eligibilityAPI";
import CreateCorporateRuleModal from "@/components/eligibility/CreateCorporateRuleModal";
import CreateBenefitGroupModal from "@/components/eligibility/CreateBenefitGroupModal";
import EmployeeManagement from "./EmployeeManagement";
import CorporateRuleListing from "./CorporateRuleListing";

interface CorporateEligibilityViewProps {
  selectedCorporate: string;
  selectedProgramTerm: string;
  programTerms: ProgramTerm[];
}

const CorporateEligibilityView = ({ selectedCorporate, selectedProgramTerm, programTerms }: CorporateEligibilityViewProps) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'add' | 'remove' | 'update'>('add');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<any | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);

  // React Query hooks
  const { data: benefitGroups = [], isLoading: benefitGroupsLoading } = useBenefitGroups();
  const { data: eligibilityRules = [], isLoading: rulesLoading } = useEligibilityRules();

  const loading = benefitGroupsLoading || rulesLoading;

  // Check if selected term is past term (read-only mode)
  const selectedTerm = programTerms.find(term => term.id === selectedProgramTerm);
  const isReadOnlyMode = selectedTerm?.status === 'Past';
  const isFutureTerm = selectedTerm?.status === 'Future';


  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setUploadFile(file);
    setValidationResults(null); // Reset previous validation results
  };

  const handleValidateFile = async () => {
    if (!uploadFile) return;
    
    setIsValidating(true);
    
    try {
      // Simulate file validation based on upload mode
      // Note: In real implementation, this would:
      // 1. Parse CSV and skip the first row (header)
      // 2. Validate only data rows starting from row 2
      // 3. Report row numbers relative to data rows (not including header)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockValidationResults = generateMockValidationResults(uploadFile.name, uploadMode);
      
      setValidationResults(mockValidationResults);
      setShowValidationModal(true);
    } catch (error) {
      console.error('Validation failed:', error);
      alert('Validation failed. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleProcessUpload = async () => {
    if (!validationResults || validationResults.errorRows > 0 || !uploadFile) return;
    
    setIsProcessingUpload(true);
    
    try {
      // Parse the uploaded CSV file
      const csvData = await parseCsvFile(uploadFile);
      
      if (uploadMode === 'add') {
        // Convert CSV data to employee objects
        const employeesToAdd = csvData.map((row, index) => ({
          employeeId: row['Emp ID'],
          name: row['Name'],
          email: row['Email'],
          phone: row['Mobile'],
          dateOfJoining: row['DOJ'],
          corporate: row['Corporate'] || selectedCorporate,
          location: row['Location'],
          designation: row['Designation'],
          department: row['Designation'], // Using designation as department for now
          age: calculateAgeFromDOB(row['DOB']),
          servicePeriod: calculateServicePeriod(row['DOJ']),
          benefitGroup: 'Standard', // Default benefit group
          opdWalletBalance: 15000, // Default wallet balance
          opdWalletAllocated: 15000,
          opdWalletUsed: 0,
          eligibilityStatus: 'Active' as const
        }));

        // Call API to add employees
        const result = await eligibilityAPI.employee.addEmployees(employeesToAdd);
        
        alert(`Successfully added ${result.success} employees! ${result.failed > 0 ? `${result.failed} failed to add.` : ''}`);
        
      } else if (uploadMode === 'remove') {
        // Extract employee IDs from CSV
        const employeeIds = csvData.map(row => row['Emp ID']);
        
        // Call API to remove employees
        const result = await eligibilityAPI.employee.removeEmployees(employeeIds);
        
        alert(`Successfully removed ${result.success} employees! ${result.failed > 0 ? `${result.failed} failed to remove.` : ''}`);
        
      } else if (uploadMode === 'update') {
        // Extract updates from CSV
        const updates = csvData.map(row => ({
          employeeId: row['Emp ID'],
          updates: {
            name: row['Name'],
            email: row['Email'],
            phone: row['Mobile'],
            location: row['Location'],
            designation: row['Designation'],
            department: row['Department']
          }
        }));
        
        // Call API to update employees
        const result = await eligibilityAPI.employee.updateEmployees(updates);
        
        alert(`Successfully updated ${result.success} employees! ${result.failed > 0 ? `${result.failed} failed to update.` : ''}`);
      }
      
      // Reset form
      setUploadFile(null);
      setValidationResults(null);
      
    } catch (error) {
      console.error('Upload processing failed:', error);
      alert('Upload processing failed. Please try again.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Helper function to parse CSV file
  const parseCsvFile = (file: File): Promise<Record<string, string>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            reject(new Error('CSV file must have header and data rows'));
            return;
          }
          
          // Parse header (first line)
          const headers = lines[0].split(',').map(h => h.trim());
          
          // Parse data rows (skip header)
          const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            return row;
          });
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Helper function to calculate age from DOB
  const calculateAgeFromDOB = (dob: string): number => {
    if (!dob) return 30; // Default age
    try {
      const [day, month, year] = dob.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 30; // Default age if parsing fails
    }
  };

  // Helper function to calculate service period
  const calculateServicePeriod = (doj: string): string => {
    if (!doj) return '0 years';
    try {
      const [day, month, year] = doj.split('/').map(Number);
      const joinDate = new Date(year, month - 1, day);
      const today = new Date();
      const years = today.getFullYear() - joinDate.getFullYear();
      const months = today.getMonth() - joinDate.getMonth();
      
      if (years === 0) {
        return `${Math.max(0, months)} months`;
      }
      return `${years} years`;
    } catch {
      return '0 years';
    }
  };

  const handleDownloadTemplate = () => {
    // Generate template based on upload mode
    const templateName = `employee_${uploadMode}_template.csv`;
    
    // Generate CSV content based on upload mode
    const csvContent = generateTemplateCSV(uploadMode);
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', templateName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Downloaded ${templateName}`);
  };

  const generateTemplateCSV = (mode: 'add' | 'remove' | 'update') => {
    let headers: string[] = [];
    let sampleRows: string[][] = [];

    if (mode === 'add') {
      headers = [
        'Emp ID', 'Name', 'Email', 'Mobile', 'DOB', 'DOJ', 
        'Corporate', 'Entity', 'Location', 'Designation', 
        'Cost Center', 'HR Name', 'HR Email', 'Dependent Count', 'Dependent Type'
      ];
      sampleRows = [
        [
          'ESI1001', 'Rajesh Kumar', 'rajesh.kumar@energysolutions.com', '9876543210', '15/01/1985', '01/04/2024',
          'Energy Solutions Inc', 'ESI Mumbai', 'Mumbai', 'Senior Analyst',
          'CC001', 'Priya Sharma', 'priya.sharma@energysolutions.com', '3', 'Spouse'
        ],
        [
          'ESI1002', 'Kavya Mishra', 'kavya.mishra@energysolutions.com', '9876543211', '22/05/1990', '15/04/2024',
          'Energy Solutions Inc', 'ESI Delhi', 'Delhi', 'Manager',
          'CC002', 'Priya Sharma', 'priya.sharma@energysolutions.com', '2', 'Children'
        ],
        [
          'ESI1003', 'Suresh Iyer', 'suresh.iyer@energysolutions.com', '9876543212', '08/11/1982', '01/05/2024',
          'Energy Solutions Inc', 'ESI Bangalore', 'Bangalore', 'Team Lead',
          'CC001', 'Priya Sharma', 'priya.sharma@energysolutions.com', '4', 'Multiple'
        ],
        [
          'ESI1004', 'Anita Reddy', 'anita.reddy@energysolutions.com', '9876543213', '12/07/1988', '10/05/2024',
          'Energy Solutions Inc', 'ESI Chennai', 'Chennai', 'Senior Executive',
          'CC003', 'Priya Sharma', 'priya.sharma@energysolutions.com', '1', 'Spouse'
        ],
        [
          'ESI1005', 'Vikram Singh', 'vikram.singh@energysolutions.com', '9876543214', '25/03/1992', '20/05/2024',
          'Energy Solutions Inc', 'ESI Pune', 'Pune', 'Analyst',
          'CC002', 'Priya Sharma', 'priya.sharma@energysolutions.com', '0', 'None'
        ]
      ];
    } else if (mode === 'remove') {
      headers = ['Emp ID', 'Email'];
      sampleRows = [
        ['ESI1001', 'rajesh.kumar@energysolutions.com'],
        ['ESI1002', 'kavya.mishra@energysolutions.com']
      ];
    } else { // update
      headers = [
        'Emp ID', 'Name', 'Email', 'Mobile', 'Location', 
        'Designation', 'Department', 'HR Name', 'HR Email'
      ];
      sampleRows = [
        [
          'ESI1001', 'Rajesh Kumar Updated', 'rajesh.kumar.new@energysolutions.com', '9876543210', 'Delhi',
          'Senior Manager', 'IT', 'Jane Smith', 'jane.smith@energysolutions.com'
        ],
        [
          'ESI1002', 'Kavya Mishra Updated', 'kavya.mishra.new@energysolutions.com', '9876543211', 'Mumbai',
          'Associate Manager', 'Finance', 'Jane Smith', 'jane.smith@energysolutions.com'
        ]
      ];
    }

    // Create CSV content with header and sample rows
    const csvRows = [
      headers.join(','),
      ...sampleRows.map(row => row.join(','))
    ];

    return csvRows.join('\n');
  };

  const generateMockValidationResults = (filename: string, mode: 'add' | 'remove' | 'update') => {
    // Note: Row counts exclude header line (which is ignored during validation)
    const baseResults = {
      filename,
      totalRows: mode === 'add' ? 5 : mode === 'remove' ? 2 : 2, // Actual data rows (excluding header)
      validRows: mode === 'add' ? 5 : mode === 'remove' ? 2 : 2, // All rows are valid in template
      errorRows: 0, // No errors in downloaded template
      warningCount: 0, // No warnings in downloaded template
      errors: [],
      warnings: [],
      duplicates: [],
      fieldValidation: {},
      headerIgnored: true // Indicates header line was properly ignored
    };

    // Template files downloaded from the system should be valid
    // Only show errors if user uploads a modified/different file
    // For testing purposes, template validation will show all rows as valid
    
    // Add field validation summary for success cases
    if (mode === 'add') {
      baseResults.fieldValidation = {
        'Emp ID': { valid: 5, invalid: 0, format: 'Alphanumeric (e.g., ESI1001)' },
        'Name': { valid: 5, invalid: 0, format: 'Full name, max 100 chars' },
        'Email': { valid: 5, invalid: 0, format: 'Valid email format' },
        'Mobile': { valid: 5, invalid: 0, format: '10 digits' },
        'DOB': { valid: 5, invalid: 0, format: 'DD/MM/YYYY' },
        'DOJ': { valid: 5, invalid: 0, format: 'DD/MM/YYYY' },
        'Corporate': { valid: 5, invalid: 0, format: 'Valid corporate name' },
        'Entity': { valid: 5, invalid: 0, format: 'Valid entity code' },
        'Location': { valid: 5, invalid: 0, format: 'Valid location' },
        'Designation': { valid: 5, invalid: 0, format: 'Job title' },
        'Cost Center': { valid: 5, invalid: 0, format: 'Cost center code' },
        'HR Name': { valid: 5, invalid: 0, format: 'HR contact name' },
        'HR Email': { valid: 5, invalid: 0, format: 'Valid email format' },
        'Dependent Count': { valid: 5, invalid: 0, format: 'Number (0-6)' },
        'Dependent Type': { valid: 5, invalid: 0, format: 'None/Spouse/Children/Multiple' }
      };
    } else if (mode === 'remove') {
      baseResults.fieldValidation = {
        'Emp ID': { valid: 2, invalid: 0, format: 'Existing employee ID' },
        'Email': { valid: 2, invalid: 0, format: 'Valid email format' }
      };
    } else { // update
      baseResults.fieldValidation = {
        'Emp ID': { valid: 2, invalid: 0, format: 'Existing employee ID' },
        'Name': { valid: 2, invalid: 0, format: 'Full name, max 100 chars' },
        'Email': { valid: 2, invalid: 0, format: 'Valid email format' },
        'Mobile': { valid: 2, invalid: 0, format: '10 digits' },
        'Location': { valid: 2, invalid: 0, format: 'Valid location' },
        'Designation': { valid: 2, invalid: 0, format: 'Job title' },
        'Department': { valid: 2, invalid: 0, format: 'Valid department' },
        'HR Name': { valid: 2, invalid: 0, format: 'HR contact name' },
        'HR Email': { valid: 2, invalid: 0, format: 'Valid email format' }
      };
    }

    return baseResults;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setShowCreateRuleModal(true);
  };

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    setShowCreateRuleModal(true);
  };

  const handleTestRule = async (rule: any) => {
    console.log('Testing rule:', rule.name);
    // In a real implementation, this would call the rule testing API
    alert(`Testing rule: ${rule.name}\n\nThis would simulate the rule against current employee data and show results in a modal similar to the Rule Builder test feature.`);
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setShowCreateGroupModal(true);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setShowEditGroupModal(true);
  };

  const handleSaveGroup = (groupData: any) => {
    console.log('Saving group:', groupData);
    // In a real implementation, this would save the group via API
    setShowCreateGroupModal(false);
    setShowEditGroupModal(false);
    setEditingGroup(null);
  };

  if (!selectedCorporate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">Select a Corporate</h3>
          <p className="text-sm text-muted-foreground">Choose a corporate to manage their eligibility settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Upload & Validate Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            1. Upload & Validate Eligibility
          </CardTitle>
          <CardDescription>
            Upload employee eligibility data and validate against corporate rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mode Selection */}
          <div className="mb-6">
            <Label className="text-base font-medium mb-3 block">Select Upload Mode</Label>
            <RadioGroup value={uploadMode} onValueChange={(value) => {
              setUploadMode(value as 'add' | 'remove' | 'update');
              setUploadFile(null);
              setValidationResults(null);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label htmlFor="add" className="cursor-pointer">
                  <div className={`border-2 rounded-lg p-4 transition-colors ${uploadMode === 'add' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="add" id="add" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <UserPlus className="h-4 w-4" />
                          Add Employees
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Onboard new employees to eligibility system
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                <label htmlFor="remove" className="cursor-pointer">
                  <div className={`border-2 rounded-lg p-4 transition-colors ${uploadMode === 'remove' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="remove" id="remove" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <UserMinus className="h-4 w-4" />
                          Remove Employees
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Soft-delete employees from eligibility
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                <label htmlFor="update" className="cursor-pointer">
                  <div className={`border-2 rounded-lg p-4 transition-colors ${uploadMode === 'update' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="update" id="update" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <UserCheck className="h-4 w-4" />
                          Update Employees
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Modify existing employee attributes
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Upload File</Label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center relative ${
                isReadOnlyMode 
                  ? 'border-gray-200 bg-gray-50' 
                  : uploadFile 
                    ? 'border-green-300 bg-green-50'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={isReadOnlyMode || isValidating}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                {isValidating ? (
                  <div className="space-y-2">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-blue-600">Validating file...</p>
                  </div>
                ) : uploadFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                    <p className="text-sm font-medium text-green-800">{uploadFile.name}</p>
                    <p className="text-xs text-green-600">Ready for validation</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadFile(null);
                        setValidationResults(null);
                      }}
                      className="mt-2"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className={`h-8 w-8 mx-auto mb-2 ${
                      isReadOnlyMode ? 'text-gray-400' : 'text-muted-foreground'
                    }`} />
                    <p className={`text-sm ${
                      isReadOnlyMode ? 'text-gray-400' : 'text-muted-foreground'
                    }`}>
                      {isReadOnlyMode ? 'Upload disabled for past terms' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-muted-foreground">Supports .xlsx, .xls, .csv</p>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  disabled={isReadOnlyMode || isValidating}
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {uploadFile ? 'Change File' : 'Choose File'}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Download Template</Label>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {uploadMode.charAt(0).toUpperCase() + uploadMode.slice(1)} Template.csv
                </Button>
                <p className="text-xs text-muted-foreground">
                  Template for {uploadMode} mode with required columns
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Validation Status</Label>
              <div className="space-y-2">
                {validationResults ? (
                  <div className="space-y-2">
                    <div className={`flex items-center justify-between p-3 rounded border ${
                      validationResults.errorRows > 0 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="text-sm">
                        <div className="font-medium">
                          {validationResults.validRows}/{validationResults.totalRows} rows valid
                        </div>
                        <div className="text-muted-foreground">
                          {validationResults.errorRows} errors, {validationResults.warningCount} warnings
                        </div>
                      </div>
                      <Badge 
                        variant="default" 
                        className={validationResults.errorRows > 0 ? "bg-orange-500" : "bg-green-600"}
                      >
                        {validationResults.errorRows > 0 ? 'Issues Found' : 'Valid'}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setShowValidationModal(true)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Validation Report
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <span className="text-sm text-muted-foreground">No file uploaded</span>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                )}
                
                {/* Validate Button */}
                {uploadFile && !validationResults && (
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={handleValidateFile}
                    disabled={isReadOnlyMode || isValidating}
                  >
                    {isValidating ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                        Validating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Validate File
                      </>
                    )}
                  </Button>
                )}
                
                {/* Upload Button */}
                {validationResults && (
                  <Button 
                    className="w-full" 
                    onClick={handleProcessUpload}
                    disabled={isReadOnlyMode || validationResults.errorRows > 0 || isProcessingUpload}
                  >
                    {isProcessingUpload ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {isReadOnlyMode ? 'Upload Disabled' : 
                         validationResults.errorRows > 0 ? 'Fix Errors First' : `${uploadMode.charAt(0).toUpperCase() + uploadMode.slice(1)} ${validationResults.validRows} Employees`}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Employee List - New PRD Compliant Implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            2. Employee List
          </CardTitle>
          <CardDescription>
            Comprehensive employee management for {selectedCorporate} - PRD compliant interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeManagement />
        </CardContent>
      </Card>

      {/* Section 3: Corporate Rule Listing - New PRD Compliant Implementation */}
      <CorporateRuleListing 
        selectedCorporate={selectedCorporate}
        selectedProgramTerm={selectedProgramTerm}
        isReadOnly={isReadOnlyMode}
      />

      {/* Section 4: Benefit Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            4. Benefit Groups (Add-Ons/Overrides)
          </CardTitle>
          <CardDescription>
            Configure benefit group overrides for {selectedCorporate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {benefitGroups.map((group) => (
              <Card key={group.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {group.employeeCount} employees
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">OPD Wallet</Label>
                    <p className="text-lg font-semibold">₹{group.opdWalletAllocation.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">AHC Benefits</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {group.ahcBenefits.slice(0, 2).map((benefit) => (
                        <Badge key={benefit} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                      {group.ahcBenefits.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{group.ahcBenefits.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      disabled={isReadOnlyMode}
                      onClick={() => handleEditGroup(group)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      {isReadOnlyMode ? 'Read Only' : 'Edit'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Create New Benefit Group Card */}
            {!isReadOnlyMode && (
              <Card className="border-2 border-dashed border-muted-foreground/25">
                <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center">
                    <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Create New Group</p>
                    <p className="text-xs text-muted-foreground">Add benefit group override</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={handleCreateGroup}
                    >
                      Create Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Read-Only Indicator Card */}
            {isReadOnlyMode && (
              <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
                <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">Historical Data</p>
                    <p className="text-xs text-gray-500">Benefit group changes not permitted</p>
                    <Badge variant="secondary" className="mt-3 bg-gray-100 text-gray-600">
                      Read Only Mode
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Validation Modal */}
      <Dialog open={showValidationModal} onOpenChange={setShowValidationModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              File Validation Report
            </DialogTitle>
            <DialogDescription>
              {validationResults?.filename} - {validationResults?.totalRows} rows analyzed
            </DialogDescription>
          </DialogHeader>
          
          {validationResults && (
            <div className="flex-1 overflow-auto space-y-6">
              {/* Overall Success Message */}
              {validationResults.errorRows === 0 && validationResults.warningCount === 0 && validationResults.duplicates.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        🎉 Validation Successful!
                      </h3>
                      <p className="text-green-700 text-sm mt-1">
                        All {validationResults.totalRows} records passed validation and are ready to be processed. 
                        Your file follows the correct format and contains valid data.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card className={validationResults.validRows > 0 && validationResults.errorRows === 0 ? "border-green-200 bg-green-50" : ""}>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <div className="text-2xl font-bold text-green-600">{validationResults.validRows}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Valid Rows</div>
                  </CardContent>
                </Card>
                <Card className={validationResults.errorRows > 0 ? "border-red-200 bg-red-50" : ""}>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {validationResults.errorRows === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <div className={`text-2xl font-bold ${validationResults.errorRows === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {validationResults.errorRows}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </CardContent>
                </Card>
                <Card className={validationResults.warningCount > 0 ? "border-orange-200 bg-orange-50" : ""}>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {validationResults.warningCount === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                      )}
                      <div className={`text-2xl font-bold ${validationResults.warningCount === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {validationResults.warningCount}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </CardContent>
                </Card>
                <Card className={validationResults.duplicates.length > 0 ? "border-blue-200 bg-blue-50" : ""}>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {validationResults.duplicates.length === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <Copy className="h-5 w-5 text-blue-600 mr-2" />
                      )}
                      <div className={`text-2xl font-bold ${validationResults.duplicates.length === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                        {validationResults.duplicates.length}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Duplicates</div>
                  </CardContent>
                </Card>
              </div>

              {/* Field Validation Summary */}
              <Card className={Object.values(validationResults.fieldValidation).every((stats: any) => stats.invalid === 0) ? "border-green-200 bg-green-50" : ""}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {Object.values(validationResults.fieldValidation).every((stats: any) => stats.invalid === 0) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    )}
                    Field Validation Summary
                    {Object.values(validationResults.fieldValidation).every((stats: any) => stats.invalid === 0) && (
                      <Badge variant="default" className="bg-green-600 ml-2">All Fields Valid</Badge>
                    )}
                  </CardTitle>
                  {Object.values(validationResults.fieldValidation).every((stats: any) => stats.invalid === 0) && (
                    <p className="text-sm text-green-700 mt-1">
                      ✅ All fields in your file follow the correct format and data types. No formatting issues detected.
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(validationResults.fieldValidation).map(([field, stats]: [string, any]) => (
                      <div 
                        key={field} 
                        className={`flex items-center justify-between p-3 border rounded ${
                          stats.invalid === 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {stats.invalid === 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{field}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${stats.invalid === 0 ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}`}
                          >
                            Format: {stats.format}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">{stats.valid}</span>
                            <span className="text-muted-foreground"> valid</span>
                          </div>
                          {stats.invalid > 0 ? (
                            <div className="text-sm">
                              <span className="text-red-600 font-medium">{stats.invalid}</span>
                              <span className="text-muted-foreground"> invalid</span>
                            </div>
                          ) : (
                            <Badge variant="default" className="bg-green-600 text-xs">
                              Perfect!
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Errors Table */}
              {validationResults.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Validation Errors ({validationResults.errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Row</TableHead>
                            <TableHead>Field</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Error</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.errors.map((error: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono">{error.row}</TableCell>
                              <TableCell className="font-medium">{error.field}</TableCell>
                              <TableCell className="font-mono text-red-600">{error.value || '(empty)'}</TableCell>
                              <TableCell className="text-sm">{error.error}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Fix
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warnings Table */}
              {validationResults.warnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Warnings ({validationResults.warnings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Row</TableHead>
                            <TableHead>Field</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Warning</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.warnings.map((warning: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono">{warning.row}</TableCell>
                              <TableCell className="font-medium">{warning.field}</TableCell>
                              <TableCell className="font-mono text-orange-600">{warning.value || '(empty)'}</TableCell>
                              <TableCell className="text-sm">{warning.error}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Duplicates */}
              {validationResults.duplicates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Copy className="h-5 w-5 text-blue-500" />
                      Duplicate Records ({validationResults.duplicates.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {validationResults.duplicates.map((duplicate: any, index: number) => (
                        <div key={index} className="p-3 border rounded bg-blue-50">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {Object.keys(duplicate)[0]}: {Object.values(duplicate)[0]}
                            </div>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {duplicate.rows.length} occurrences
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Found in rows: {duplicate.rows.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Error Report
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Corrected File
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowValidationModal(false)}>
                Close
              </Button>
              {validationResults?.errorRows === 0 && (
                <Button onClick={() => setShowValidationModal(false)}>
                  Proceed with Upload
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rule Builder Modal */}
      {/* Create Corporate Rule Modal */}
      <CreateCorporateRuleModal
        isOpen={showCreateRuleModal}
        onClose={() => setShowCreateRuleModal(false)}
        onSave={(rule) => {
          console.log('Rule saved:', rule);
          setShowCreateRuleModal(false);
          // In a real implementation, this would save the rule via API
        }}
      />

      {/* Create/Edit Benefit Group Modal */}
      <CreateBenefitGroupModal
        isOpen={showCreateGroupModal || showEditGroupModal}
        onClose={() => {
          setShowCreateGroupModal(false);
          setShowEditGroupModal(false);
          setEditingGroup(null);
        }}
        onSave={handleSaveGroup}
        editingGroup={editingGroup}
      />
    </div>
  );
};

export default CorporateEligibilityView;