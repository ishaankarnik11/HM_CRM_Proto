import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  FileDown,
  UserPlus,
  UserMinus,
  UserCheck,
  X,
  FileX,
  Loader2
} from "lucide-react";
import { useDropzone } from "react-dropzone";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCorporate: string;
  selectedProgramTerm: string;
}

type UploadMode = 'add' | 'remove' | 'update';

interface ValidationResult {
  filename: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  duplicates: DuplicateRecord[];
  fieldValidation: Record<string, FieldValidation>;
}

interface ValidationError {
  row: number;
  field: string;
  value: string;
  error: string;
  severity: 'error';
}

interface ValidationWarning {
  row: number;
  field: string;
  value: string;
  error: string;
  severity: 'warning';
}

interface DuplicateRecord {
  type: 'Employee ID' | 'Email' | 'Mobile';
  value: string;
  rows: number[];
}

interface FieldValidation {
  valid: number;
  invalid: number;
  format: string;
}

interface ProcessingResult {
  successCount: number;
  failureCount: number;
  successFilename?: string;
  failureFilename?: string;
  timestamp: string;
}

const BulkUploadModal = ({ isOpen, onClose, selectedCorporate, selectedProgramTerm }: BulkUploadModalProps) => {
  const [uploadMode, setUploadMode] = useState<UploadMode>('add');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit');
        return;
      }
      setUploadedFile(file);
      setValidationResult(null);
      setProcessingResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isValidating || isProcessing
  });

  const handleValidate = async () => {
    if (!uploadedFile) return;

    setIsValidating(true);
    setUploadProgress(0);

    try {
      // Simulate validation progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Simulate validation results based on mode
      const mockValidation: ValidationResult = {
        filename: uploadedFile.name,
        totalRows: uploadMode === 'add' ? 147 : uploadMode === 'remove' ? 23 : 89,
        validRows: uploadMode === 'add' ? 142 : uploadMode === 'remove' ? 22 : 85,
        errorRows: uploadMode === 'add' ? 5 : uploadMode === 'remove' ? 1 : 4,
        errors: generateMockErrors(uploadMode),
        warnings: generateMockWarnings(uploadMode),
        duplicates: uploadMode === 'add' ? generateMockDuplicates() : [],
        fieldValidation: generateFieldValidation(uploadMode)
      };

      setValidationResult(mockValidation);
    } catch (error) {
      console.error('Validation failed:', error);
      alert('Validation failed. Please try again.');
    } finally {
      setIsValidating(false);
      setUploadProgress(0);
    }
  };

  const handleProcess = async () => {
    if (!validationResult || validationResult.errorRows > 0) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate processing progress
      for (let i = 0; i <= 100; i += 5) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Simulate processing results
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, 15);
      const result: ProcessingResult = {
        successCount: validationResult.validRows,
        failureCount: 0,
        successFilename: `eligibility_${uploadMode}_success_${timestamp}.csv`,
        timestamp: new Date().toLocaleString()
      };

      setProcessingResult(result);
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadTemplate = () => {
    // In a real implementation, this would download the actual template
    console.log(`Downloading ${uploadMode} template`);
    alert(`Downloading employee ${uploadMode} template`);
  };

  const handleDownloadResult = (filename?: string) => {
    if (!filename) return;
    // In a real implementation, this would download the actual file
    console.log(`Downloading ${filename}`);
    alert(`Downloading ${filename}`);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setValidationResult(null);
    setProcessingResult(null);
    setUploadProgress(0);
  };

  const getModeIcon = (mode: UploadMode) => {
    switch (mode) {
      case 'add': return <UserPlus className="h-4 w-4" />;
      case 'remove': return <UserMinus className="h-4 w-4" />;
      case 'update': return <UserCheck className="h-4 w-4" />;
    }
  };

  const getModeDescription = (mode: UploadMode) => {
    switch (mode) {
      case 'add': return 'Onboard new employees to eligibility system';
      case 'remove': return 'Soft-delete employees from eligibility';
      case 'update': return 'Modify existing employee attributes';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Employee Upload
          </DialogTitle>
          <DialogDescription>
            Upload employee data for {selectedCorporate} - {selectedProgramTerm}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Select Upload Mode</CardTitle>
              <CardDescription>Choose the operation you want to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={uploadMode} onValueChange={(value) => {
                setUploadMode(value as UploadMode);
                resetUpload();
              }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label htmlFor="add" className="cursor-pointer">
                    <Card className={`border-2 transition-colors ${uploadMode === 'add' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="add" id="add" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 font-medium">
                              {getModeIcon('add')}
                              Add Employees
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getModeDescription('add')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </label>

                  <label htmlFor="remove" className="cursor-pointer">
                    <Card className={`border-2 transition-colors ${uploadMode === 'remove' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="remove" id="remove" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 font-medium">
                              {getModeIcon('remove')}
                              Remove Employees
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getModeDescription('remove')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </label>

                  <label htmlFor="update" className="cursor-pointer">
                    <Card className={`border-2 transition-colors ${uploadMode === 'update' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="update" id="update" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 font-medium">
                              {getModeIcon('update')}
                              Update Employees
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getModeDescription('update')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Upload File</CardTitle>
              <CardDescription>
                Upload your {uploadMode} file or download the template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Area */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Upload File</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-blue-500 bg-blue-50' : 
                      uploadedFile ? 'border-green-500 bg-green-50' : 
                      'border-gray-300 hover:border-gray-400'
                    } ${(isValidating || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input {...getInputProps()} />
                    {isValidating || isProcessing ? (
                      <div className="space-y-3">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
                        <p className="text-sm font-medium">
                          {isValidating ? 'Validating file...' : 'Processing upload...'}
                        </p>
                        <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                      </div>
                    ) : uploadedFile ? (
                      <div className="space-y-2">
                        <FileSpreadsheet className="h-8 w-8 mx-auto text-green-600" />
                        <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
                        <p className="text-xs text-green-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetUpload();
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {isDragActive ? 'Drop the file here...' : 'Drag & drop or click to upload'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports .xlsx, .xls, .csv (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Template Download */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Download Template</Label>
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-6">
                      <FileDown className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                      <p className="text-sm font-medium mb-3">
                        Get the {uploadMode} template with all required columns
                      </p>
                      <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Validate Button */}
              {uploadedFile && !validationResult && (
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleValidate} disabled={isValidating}>
                    {isValidating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Validate File
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Results */}
          {validationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Validation Results</CardTitle>
                <CardDescription>
                  Review validation results before processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {validationResult.validRows}
                      </div>
                      <div className="text-sm text-muted-foreground">Valid Rows</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {validationResult.errorRows}
                      </div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {validationResult.warnings.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Errors */}
                {validationResult.errors.length > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-2">Validation Errors:</div>
                      <ul className="space-y-1 text-sm">
                        {validationResult.errors.slice(0, 3).map((error, idx) => (
                          <li key={idx}>
                            Row {error.row}: {error.field} - {error.error}
                          </li>
                        ))}
                        {validationResult.errors.length > 3 && (
                          <li className="text-muted-foreground">
                            ...and {validationResult.errors.length - 3} more errors
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Warnings */}
                {validationResult.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-2">Warnings:</div>
                      <ul className="space-y-1 text-sm">
                        {validationResult.warnings.slice(0, 2).map((warning, idx) => (
                          <li key={idx}>
                            Row {warning.row}: {warning.field} - {warning.error}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Process Button */}
                {!processingResult && (
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button variant="outline" onClick={resetUpload}>
                      <FileX className="h-4 w-4 mr-2" />
                      Upload Different File
                    </Button>
                    <Button 
                      onClick={handleProcess}
                      disabled={validationResult.errorRows > 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {validationResult.errorRows > 0 ? 'Fix Errors First' : 'Process Upload'}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Processing Results */}
          {processingResult && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Upload Completed Successfully
                </CardTitle>
                <CardDescription>
                  Processed at {processingResult.timestamp}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium">{processingResult.successCount} employees {uploadMode}ed successfully</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Download the result files below
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Success
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processingResult.successFilename && (
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleDownloadResult(processingResult.successFilename)}
                    >
                      <FileDown className="h-4 w-4 mr-2 text-green-600" />
                      Download Success File
                    </Button>
                  )}
                  {processingResult.failureFilename && (
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleDownloadResult(processingResult.failureFilename)}
                    >
                      <FileDown className="h-4 w-4 mr-2 text-red-600" />
                      Download Failure File
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            <Info className="h-4 w-4 inline mr-1" />
            Files are validated before processing to ensure data integrity
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions to generate mock data
function generateMockErrors(mode: UploadMode): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (mode === 'add') {
    errors.push(
      { row: 23, field: 'Email', value: 'invalid-email', error: 'Invalid email format', severity: 'error' },
      { row: 45, field: 'Employee ID', value: 'EMP001', error: 'Duplicate employee ID', severity: 'error' },
      { row: 67, field: 'Name', value: '', error: 'Required field missing', severity: 'error' },
      { row: 89, field: 'Mobile', value: '12345', error: 'Mobile must be 10 digits', severity: 'error' },
      { row: 134, field: 'DOJ', value: '32/13/2024', error: 'Invalid date format', severity: 'error' }
    );
  } else if (mode === 'remove') {
    errors.push(
      { row: 15, field: 'Employee ID', value: 'EMP999', error: 'Employee not found', severity: 'error' }
    );
  } else {
    errors.push(
      { row: 12, field: 'Employee ID', value: 'EMP888', error: 'Employee not found', severity: 'error' },
      { row: 34, field: 'Email', value: 'john@company.com', error: 'Email already exists for another employee', severity: 'error' },
      { row: 56, field: 'Location', value: 'InvalidCity', error: 'Location not in master list', severity: 'error' },
      { row: 78, field: 'Department', value: '', error: 'Cannot update to empty value', severity: 'error' }
    );
  }
  
  return errors;
}

function generateMockWarnings(mode: UploadMode): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  
  if (mode === 'add') {
    warnings.push(
      { row: 12, field: 'Location', value: 'Mumbai Office', error: 'Location not in corporate list', severity: 'warning' },
      { row: 78, field: 'HR Email', value: '', error: 'HR email recommended for billing', severity: 'warning' }
    );
  } else if (mode === 'remove') {
    warnings.push(
      { row: 8, field: 'Employee ID', value: 'EMP123', error: 'Employee has taken AHC in current term', severity: 'warning' }
    );
  }
  
  return warnings;
}

function generateMockDuplicates(): DuplicateRecord[] {
  return [
    { type: 'Employee ID', value: 'EMP001', rows: [45, 97] },
    { type: 'Email', value: 'john.doe@company.com', rows: [23, 156] }
  ];
}

function generateFieldValidation(mode: UploadMode): Record<string, FieldValidation> {
  const baseValidation = {
    'Employee ID': { valid: 142, invalid: 5, format: 'Alphanumeric' },
    'Name': { valid: 146, invalid: 1, format: 'Text, max 100 chars' },
    'Email': { valid: 145, invalid: 2, format: 'Valid email format' }
  };
  
  if (mode === 'add') {
    return {
      ...baseValidation,
      'Mobile': { valid: 144, invalid: 3, format: '10 digits' },
      'DOJ': { valid: 146, invalid: 1, format: 'DD/MM/YYYY' },
      'Corporate': { valid: 147, invalid: 0, format: 'Valid corporate name' }
    };
  } else if (mode === 'remove') {
    return {
      'Employee ID': { valid: 22, invalid: 1, format: 'Alphanumeric' }
    };
  } else {
    return {
      ...baseValidation,
      'Location': { valid: 88, invalid: 1, format: 'Valid location' },
      'Department': { valid: 88, invalid: 1, format: 'Valid department' }
    };
  }
}

export default BulkUploadModal;