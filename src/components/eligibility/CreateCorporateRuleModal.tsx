import { useState, useEffect } from "react";
import { X, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Types and interfaces as per PRD
interface Criterion {
  id: string;
  parameter: string;
  operator: string;
  value: string;
  value2?: string; // For "between" operator
  valueList?: string[]; // For "in list" operators
}

interface OPDService {
  enabled: boolean;
  sublimit: number;
  dependentCoverage: {
    spouse: boolean;
    parents: boolean;
    inLaws: boolean;
  };
  reimbursementEnabled: boolean;
}

interface CorporateRule {
  name: string;
  enabled: boolean;
  criteria: Criterion[];
  ahcPackages: string[];
  additionalTests: string[];
  opdWalletBalance: number;
  opdServices: {
    consultation: OPDService;
    diagnostics: OPDService;
    medicines: OPDService;
    dental: OPDService;
    visionCare: OPDService;
  };
}

interface CreateCorporateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: CorporateRule) => void;
  existingRule?: any; // EligibilityRule from mock data
  mode?: 'create' | 'edit';
}

const CreateCorporateRuleModal = ({ isOpen, onClose, onSave, existingRule, mode = 'create' }: CreateCorporateRuleModalProps) => {
  const [rule, setRule] = useState<CorporateRule>({
    name: "",
    enabled: true,
    criteria: [],
    ahcPackages: [],
    additionalTests: [],
    opdWalletBalance: 0,
    opdServices: {
      consultation: { 
        enabled: false, 
        sublimit: 0, 
        dependentCoverage: { spouse: false, parents: false, inLaws: false },
        reimbursementEnabled: false
      },
      diagnostics: { 
        enabled: false, 
        sublimit: 0, 
        dependentCoverage: { spouse: false, parents: false, inLaws: false },
        reimbursementEnabled: false
      },
      medicines: { 
        enabled: false, 
        sublimit: 0, 
        dependentCoverage: { spouse: false, parents: false, inLaws: false },
        reimbursementEnabled: false
      },
      dental: { 
        enabled: false, 
        sublimit: 0, 
        dependentCoverage: { spouse: false, parents: false, inLaws: false },
        reimbursementEnabled: false
      },
      visionCare: { 
        enabled: false, 
        sublimit: 0, 
        dependentCoverage: { spouse: false, parents: false, inLaws: false },
        reimbursementEnabled: false
      },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Convert existing rule to modal format
  const convertExistingRuleToModalFormat = (existingRule: any): CorporateRule => {
    // Filter out Corporate conditions as they're used for filtering, not editing
    const filteredConditions = existingRule.conditions.filter((condition: any) => 
      condition.parameter !== 'Corporate'
    );

    const convertedCriteria: Criterion[] = filteredConditions.map((condition: any) => {
      // Map parameter names from existing format to modal format
      const parameterMapping: Record<string, string> = {
        'Age': 'age',
        'Location': 'location', 
        'Department': 'department',
        'Designation': 'designation',
        'Gender': 'gender',
        'Service Period': 'joinDate',
        'Employee ID': 'employeeId',
        'Employee Type': 'employeeType'
      };

      // Map operator names from existing format to modal format
      const operatorMapping: Record<string, string> = {
        'equals': 'equals',
        'not_equals': 'notEquals',
        'greater_than': 'greaterThan',
        'less_than': 'lessThan',
        'contains': 'contains',
        'in_list': 'inList',
        'not_in_list': 'notInList'
      };

      const mappedParameter = parameterMapping[condition.parameter] || condition.parameter.toLowerCase();
      const mappedOperator = operatorMapping[condition.operator] || condition.operator;

      return {
        id: condition.id,
        parameter: mappedParameter,
        operator: mappedOperator,
        value: Array.isArray(condition.value) ? condition.value.join(", ") : String(condition.value),
        valueList: Array.isArray(condition.value) ? condition.value : undefined
      };
    });

    return {
      name: existingRule.name,
      enabled: existingRule.isActive,
      criteria: convertedCriteria,
      ahcPackages: [], // Will be populated based on actions
      additionalTests: [], // Will be populated based on actions
      opdWalletBalance: 0,
      opdServices: {
        consultation: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
        diagnostics: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
        medicines: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
        dental: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
        visionCare: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
      },
    };
  };

  // Effect to populate form when editing existing rule
  useEffect(() => {
    if (mode === 'edit' && existingRule) {
      const convertedRule = convertExistingRuleToModalFormat(existingRule);
      setRule(convertedRule);
    } else if (mode === 'create') {
      // Reset form for create mode
      setRule({
        name: "",
        enabled: true,
        criteria: [],
        ahcPackages: [],
        additionalTests: [],
        opdWalletBalance: 0,
        opdServices: {
          consultation: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
          diagnostics: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
          medicines: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
          dental: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
          visionCare: { enabled: false, sublimit: 0, dependentCoverage: { spouse: false, parents: false, inLaws: false }, reimbursementEnabled: false },
        },
      });
    }
  }, [mode, existingRule]);

  // Parameter options as per PRD
  const parameterOptions = [
    { value: "department", label: "Department", type: "text" },
    { value: "designation", label: "Designation", type: "text" },
    { value: "location", label: "Location", type: "text" },
    { value: "employeeId", label: "Employee ID", type: "text" },
    { value: "joinDate", label: "Join Date", type: "date" },
    { value: "age", label: "Age", type: "number" },
    { value: "gender", label: "Gender", type: "select" },
    { value: "employeeType", label: "Employee Type", type: "select" },
  ];

  // AHC Packages as per PRD
  const ahcPackageOptions = [
    "Standard",
    "Premium",
    "Executive", 
    "Comprehensive",
    "Wellness"
  ];

  // Additional Tests as per PRD
  const additionalTestOptions = [
    "Vitamin D",
    "B12",
    "Thyroid",
    "HbA1c",
    "Lipid Profile",
    "Iron Studies",
    "Kidney Panel",
    "Liver Panel"
  ];

  // Dynamic operator options based on parameter type
  const getOperatorOptions = (parameterType: string) => {
    switch (parameterType) {
      case "text":
        return [
          { value: "equals", label: "Equals" },
          { value: "notEquals", label: "Not Equals" },
          { value: "contains", label: "Contains" },
          { value: "startsWith", label: "Starts With" },
          { value: "endsWith", label: "Ends With" },
          { value: "inList", label: "In List" },
          { value: "notInList", label: "Not In List" },
        ];
      case "date":
        return [
          { value: "equals", label: "Equals" },
          { value: "before", label: "Before" },
          { value: "after", label: "After" },
          { value: "between", label: "Between" },
          { value: "notBetween", label: "Not Between" },
        ];
      case "number":
        return [
          { value: "equals", label: "Equals" },
          { value: "greaterThan", label: "Greater Than" },
          { value: "lessThan", label: "Less Than" },
          { value: "between", label: "Between" },
          { value: "notBetween", label: "Not Between" },
        ];
      case "select":
        return [
          { value: "equals", label: "Equals" },
          { value: "notEquals", label: "Not Equals" },
          { value: "inList", label: "In List" },
        ];
      default:
        return [];
    }
  };

  // Add new criterion
  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: Date.now().toString(),
      parameter: "",
      operator: "",
      value: "",
    };
    setRule(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCriterion]
    }));
  };

  // Remove criterion
  const removeCriterion = (id: string) => {
    setRule(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== id)
    }));
  };

  // Update criterion
  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    setRule(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  };

  // Update OPD service
  const updateOPDService = (serviceName: keyof typeof rule.opdServices, updates: Partial<OPDService>) => {
    setRule(prev => ({
      ...prev,
      opdServices: {
        ...prev.opdServices,
        [serviceName]: {
          ...prev.opdServices[serviceName],
          ...updates
        }
      }
    }));
  };

  // Validation logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Rule name validation
    if (!rule.name.trim()) {
      newErrors.name = "Rule name is required";
    } else if (rule.name.length > 100) {
      newErrors.name = "Rule name must be 100 characters or less";
    }

    // At least one criteria condition required
    if (rule.criteria.length === 0) {
      newErrors.criteria = "At least one criteria condition is required";
    }

    // Validate each criterion
    rule.criteria.forEach((criterion, index) => {
      if (!criterion.parameter) {
        newErrors[`criterion_${index}_parameter`] = "Parameter is required";
      }
      if (!criterion.operator) {
        newErrors[`criterion_${index}_operator`] = "Operator is required";
      }
      if (!criterion.value && criterion.operator !== "inList" && criterion.operator !== "notInList") {
        newErrors[`criterion_${index}_value`] = "Value is required";
      }
    });

    // At least one action selected
    const hasAnyAction = rule.ahcPackages.length > 0 || 
                        rule.additionalTests.length > 0 || 
                        Object.values(rule.opdServices).some(service => service.enabled);

    if (!hasAnyAction) {
      newErrors.actions = "At least one action (AHC package, test, or OPD service) must be selected";
    }

    // OPD service validations
    const hasEnabledOPDService = Object.values(rule.opdServices).some(service => service.enabled);
    if (hasEnabledOPDService) {
      if (rule.opdWalletBalance < 500 || rule.opdWalletBalance > 50000) {
        newErrors.opdWalletBalance = "Wallet balance must be between ₹500 and ₹50,000";
      }

      // Validate each enabled OPD service
      Object.entries(rule.opdServices).forEach(([serviceName, service]) => {
        if (service.enabled) {
          if (service.sublimit <= 0) {
            newErrors[`${serviceName}_sublimit`] = "Sublimit amount is required when service is enabled";
          }
          const hasAnyDependent = service.dependentCoverage.spouse || 
                                 service.dependentCoverage.parents || 
                                 service.dependentCoverage.inLaws;
          if (!hasAnyDependent) {
            newErrors[`${serviceName}_dependents`] = "At least one dependent must be selected";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave(rule);
    }
  };

  // Calculate total sublimits for reference
  const getTotalSublimits = () => {
    return Object.values(rule.opdServices)
      .filter(service => service.enabled)
      .reduce((total, service) => total + service.sublimit, 0);
  };

  const isFormValid = () => {
    return rule.name.trim() &&
           rule.criteria.length > 0 &&
           (rule.ahcPackages.length > 0 || 
            rule.additionalTests.length > 0 || 
            Object.values(rule.opdServices).some(service => service.enabled));
  };

  // Render value input based on parameter type and operator
  const renderValueInput = (criterion: Criterion, index: number) => {
    const parameter = parameterOptions.find(p => p.value === criterion.parameter);
    const parameterType = parameter?.type || "text";
    
    if (criterion.operator === "between" || criterion.operator === "notBetween") {
      return (
        <div className="flex gap-2">
          <Input
            placeholder="From"
            value={criterion.value}
            onChange={(e) => updateCriterion(criterion.id, { value: e.target.value })}
            type={parameterType === "number" ? "number" : parameterType === "date" ? "date" : "text"}
          />
          <Input
            placeholder="To"
            value={criterion.value2 || ""}
            onChange={(e) => updateCriterion(criterion.id, { value2: e.target.value })}
            type={parameterType === "number" ? "number" : parameterType === "date" ? "date" : "text"}
          />
        </div>
      );
    }

    if (criterion.operator === "inList" || criterion.operator === "notInList") {
      return (
        <Input
          placeholder="Enter values separated by commas"
          value={criterion.valueList?.join(", ") || ""}
          onChange={(e) => updateCriterion(criterion.id, { 
            valueList: e.target.value.split(",").map(v => v.trim()).filter(v => v) 
          })}
        />
      );
    }

    return (
      <Input
        placeholder="Enter value"
        value={criterion.value}
        onChange={(e) => updateCriterion(criterion.id, { value: e.target.value })}
        type={parameterType === "number" ? "number" : parameterType === "date" ? "date" : "text"}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Rule' : 'Create New Rule'}</h2>
            <p className="text-sm text-gray-600 mt-1">Configure rule conditions and actions for employee eligibility.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="enabled-toggle" className="text-sm font-medium">Enabled</Label>
              <Switch
                id="enabled-toggle"
                checked={rule.enabled}
                onCheckedChange={(checked) => setRule(prev => ({ ...prev, enabled: checked }))}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Rule Name Section */}
            <div>
              <Label htmlFor="rule-name" className="text-sm font-medium">Rule Name</Label>
              <Input
                id="rule-name"
                placeholder="Enter rule name"
                value={rule.name}
                onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? "border-red-500" : ""}
                maxLength={100}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Criteria Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Criteria (AND logic)</CardTitle>
                  <Button variant="outline" size="sm" onClick={addCriterion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.criteria && (
                  <div className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.criteria}
                  </div>
                )}
                
                {rule.criteria.map((criterion, index) => (
                  <div key={criterion.id} className="grid grid-cols-12 gap-3 items-start">
                    {/* Parameter Dropdown */}
                    <div className="col-span-3">
                      <Select
                        value={criterion.parameter}
                        onValueChange={(value) => updateCriterion(criterion.id, { 
                          parameter: value, 
                          operator: "", 
                          value: "",
                          value2: "",
                          valueList: undefined
                        })}
                      >
                        <SelectTrigger className={errors[`criterion_${index}_parameter`] ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select parameter" />
                        </SelectTrigger>
                        <SelectContent>
                          {parameterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`criterion_${index}_parameter`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`criterion_${index}_parameter`]}</p>
                      )}
                    </div>

                    {/* Operator Dropdown */}
                    <div className="col-span-3">
                      <Select
                        value={criterion.operator}
                        onValueChange={(value) => updateCriterion(criterion.id, { 
                          operator: value,
                          value: "",
                          value2: "",
                          valueList: undefined
                        })}
                        disabled={!criterion.parameter}
                      >
                        <SelectTrigger className={errors[`criterion_${index}_operator`] ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {getOperatorOptions(
                            parameterOptions.find(p => p.value === criterion.parameter)?.type || "text"
                          ).map((operator) => (
                            <SelectItem key={operator.value} value={operator.value}>
                              {operator.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`criterion_${index}_operator`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`criterion_${index}_operator`]}</p>
                      )}
                    </div>

                    {/* Value Input */}
                    <div className="col-span-5">
                      {renderValueInput(criterion, index)}
                      {errors[`criterion_${index}_value`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`criterion_${index}_value`]}</p>
                      )}
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCriterion(criterion.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}

                {rule.criteria.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No conditions added yet. Click "Add Condition" to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions Configuration</CardTitle>
                {errors.actions && (
                  <div className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.actions}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AHC Packages */}
                <div>
                  <h4 className="font-medium mb-3">AHC Packages</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {ahcPackageOptions.map((packageName) => (
                      <div key={packageName} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ahc-${packageName}`}
                          checked={rule.ahcPackages.includes(packageName)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRule(prev => ({
                                ...prev,
                                ahcPackages: [...prev.ahcPackages, packageName]
                              }));
                            } else {
                              setRule(prev => ({
                                ...prev,
                                ahcPackages: prev.ahcPackages.filter(p => p !== packageName)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`ahc-${packageName}`} className="text-sm font-normal">
                          {packageName}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Additional Tests */}
                <div>
                  <h4 className="font-medium mb-3">Additional Tests</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {additionalTestOptions.map((test) => (
                      <div key={test} className="flex items-center space-x-2">
                        <Checkbox
                          id={`test-${test}`}
                          checked={rule.additionalTests.includes(test)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRule(prev => ({
                                ...prev,
                                additionalTests: [...prev.additionalTests, test]
                              }));
                            } else {
                              setRule(prev => ({
                                ...prev,
                                additionalTests: prev.additionalTests.filter(t => t !== test)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`test-${test}`} className="text-sm font-normal">
                          {test}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* OPD Services & Sublimits */}
                <div>
                  <h4 className="font-medium mb-3">OPD Services & Sublimits</h4>
                  
                  {/* Wallet Balance */}
                  <div className="mb-4">
                    <Label htmlFor="wallet-balance" className="text-sm font-medium">Wallet Balance ₹</Label>
                    <Input
                      id="wallet-balance"
                      type="number"
                      placeholder="0"
                      value={rule.opdWalletBalance || ""}
                      onChange={(e) => setRule(prev => ({ 
                        ...prev, 
                        opdWalletBalance: parseInt(e.target.value) || 0 
                      }))}
                      className={errors.opdWalletBalance ? "border-red-500" : ""}
                      min={500}
                      max={50000}
                    />
                    {errors.opdWalletBalance && (
                      <p className="text-sm text-red-600 mt-1">{errors.opdWalletBalance}</p>
                    )}
                  </div>

                  {/* Service Configuration */}
                  <div className="space-y-4">
                    {Object.entries(rule.opdServices).map(([serviceName, service]) => (
                      <div key={serviceName} className="border rounded-lg p-4 space-y-3">
                        {/* Service Enable Checkbox */}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${serviceName}`}
                            checked={service.enabled}
                            onCheckedChange={(checked) => 
                              updateOPDService(serviceName as keyof typeof rule.opdServices, { 
                                enabled: !!checked,
                                sublimit: checked ? service.sublimit || 0 : 0
                              })
                            }
                          />
                          <Label htmlFor={`service-${serviceName}`} className="text-sm font-medium capitalize">
                            {serviceName === 'visionCare' ? 'Vision Care' : serviceName}
                          </Label>
                        </div>

                        {/* Sublimit and Dependencies (shown only when service is enabled) */}
                        {service.enabled && (
                          <>
                            {/* Sublimit Amount */}
                            <div>
                              <Label className="text-sm">Sublimit ₹</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={service.sublimit || ""}
                                onChange={(e) => 
                                  updateOPDService(serviceName as keyof typeof rule.opdServices, { 
                                    sublimit: parseInt(e.target.value) || 0 
                                  })
                                }
                                className={errors[`${serviceName}_sublimit`] ? "border-red-500" : ""}
                                min={1}
                              />
                              {errors[`${serviceName}_sublimit`] && (
                                <p className="text-xs text-red-600 mt-1">{errors[`${serviceName}_sublimit`]}</p>
                              )}
                            </div>

                            {/* Dependent Coverage */}
                            <div>
                              <Label className="text-sm">Coverage for:</Label>
                              <div className="flex gap-4 mt-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${serviceName}-spouse`}
                                    checked={service.dependentCoverage.spouse}
                                    onCheckedChange={(checked) => 
                                      updateOPDService(serviceName as keyof typeof rule.opdServices, {
                                        dependentCoverage: {
                                          ...service.dependentCoverage,
                                          spouse: !!checked
                                        }
                                      })
                                    }
                                  />
                                  <Label htmlFor={`${serviceName}-spouse`} className="text-sm">Spouse</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${serviceName}-parents`}
                                    checked={service.dependentCoverage.parents}
                                    onCheckedChange={(checked) => 
                                      updateOPDService(serviceName as keyof typeof rule.opdServices, {
                                        dependentCoverage: {
                                          ...service.dependentCoverage,
                                          parents: !!checked
                                        }
                                      })
                                    }
                                  />
                                  <Label htmlFor={`${serviceName}-parents`} className="text-sm">Parents</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${serviceName}-inlaws`}
                                    checked={service.dependentCoverage.inLaws}
                                    onCheckedChange={(checked) => 
                                      updateOPDService(serviceName as keyof typeof rule.opdServices, {
                                        dependentCoverage: {
                                          ...service.dependentCoverage,
                                          inLaws: !!checked
                                        }
                                      })
                                    }
                                  />
                                  <Label htmlFor={`${serviceName}-inlaws`} className="text-sm">In-laws</Label>
                                </div>
                              </div>
                              {errors[`${serviceName}_dependents`] && (
                                <p className="text-xs text-red-600 mt-1">{errors[`${serviceName}_dependents`]}</p>
                              )}
                            </div>

                            {/* Reimbursement */}
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${serviceName}-reimbursement`}
                                checked={service.reimbursementEnabled}
                                onCheckedChange={(checked) => 
                                  updateOPDService(serviceName as keyof typeof rule.opdServices, { 
                                    reimbursementEnabled: !!checked 
                                  })
                                }
                              />
                              <Label htmlFor={`${serviceName}-reimbursement`} className="text-sm">
                                Enable Reimbursement
                              </Label>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Visual indicator for total sublimits vs wallet balance */}
                  {rule.opdWalletBalance > 0 && getTotalSublimits() > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Total Sublimits:</span>
                          <span className="font-medium">₹{getTotalSublimits().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Wallet Balance:</span>
                          <span className="font-medium">₹{rule.opdWalletBalance.toLocaleString()}</span>
                        </div>
                        {getTotalSublimits() > rule.opdWalletBalance && (
                          <p className="text-blue-700 mt-2 text-xs">
                            Note: Sublimits can exceed wallet balance to accommodate dependent coverage
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Rule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCorporateRuleModal;