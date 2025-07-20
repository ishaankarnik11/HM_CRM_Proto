import React, { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Users, DollarSign, Calendar, Settings } from 'lucide-react';
import { EligibilityRule, RuleCondition, RuleAction } from '@/services/eligibilityMockData';

interface RuleConfigurationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  rule?: EligibilityRule | null;
  onSave: (rule: Partial<EligibilityRule>) => void;
}

interface FormData {
  name: string;
  description: string;
  isActive: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  effectiveDateRange: {
    startDate: string;
    endDate: string;
  };
}

const CONDITION_PARAMETERS = [
  'Age',
  'Service Period',
  'Department',
  'Location',
  'Designation',
  'Corporate'
];

const CONDITION_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'contains', label: 'Contains' },
  { value: 'in_list', label: 'In List' }
];

const ACTION_TYPES = [
  'Assign Benefit Group',
  'Set Wallet Amount',
  'Enable AHC',
  'Set Family Coverage'
];

const BENEFIT_GROUPS = ['Executive', 'Premium', 'Standard', 'Basic'];
const DEPARTMENTS = ['HR', 'IT', 'Finance', 'Operations', 'Sales', 'Marketing', 'Legal', 'Admin', 'R&D', 'Quality'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
const DESIGNATIONS = ['Manager', 'Senior Manager', 'Analyst', 'Senior Analyst', 'Executive', 'Associate', 'Director', 'VP', 'AVP', 'Team Lead'];

const RuleConfigurationModal: React.FC<RuleConfigurationModalProps> = ({
  open,
  onOpenChange,
  mode,
  rule,
  onSave
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isActive: true,
    priority: 1,
    conditions: [],
    actions: [],
    effectiveDateRange: {
      startDate: '',
      endDate: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when rule changes
  useEffect(() => {
    if (mode === 'edit' && rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        isActive: rule.isActive,
        priority: rule.priority,
        conditions: [...rule.conditions],
        actions: [...rule.actions],
        effectiveDateRange: { ...rule.effectiveDateRange }
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        isActive: true,
        priority: 1,
        conditions: [],
        actions: [],
        effectiveDateRange: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      });
    }
    setErrors({});
  }, [mode, rule, open]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.conditions.length === 0) {
      newErrors.conditions = 'At least one condition is required';
    }

    if (formData.actions.length === 0) {
      newErrors.actions = 'At least one action is required';
    }

    if (!formData.effectiveDateRange.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.effectiveDateRange.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.effectiveDateRange.startDate && formData.effectiveDateRange.endDate &&
        formData.effectiveDateRange.startDate >= formData.effectiveDateRange.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Validate conditions
    formData.conditions.forEach((condition, index) => {
      if (!condition.parameter) {
        newErrors[`condition_${index}_parameter`] = 'Parameter is required';
      }
      if (!condition.operator) {
        newErrors[`condition_${index}_operator`] = 'Operator is required';
      }
      if (!condition.value || (Array.isArray(condition.value) && condition.value.length === 0)) {
        newErrors[`condition_${index}_value`] = 'Value is required';
      }
    });

    // Validate actions
    formData.actions.forEach((action, index) => {
      if (!action.type) {
        newErrors[`action_${index}_type`] = 'Action type is required';
      }
      if (action.value === undefined || action.value === null || action.value === '') {
        newErrors[`action_${index}_value`] = 'Action value is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const ruleData: Partial<EligibilityRule> = {
      ...formData,
      conditions: formData.conditions.map((condition, index) => ({
        ...condition,
        id: condition.id || `cond-${Date.now()}-${index}`
      })),
      actions: formData.actions.map((action, index) => ({
        ...action,
        id: action.id || `act-${Date.now()}-${index}`
      }))
    };

    onSave(ruleData);
    onOpenChange(false);
  };

  const addCondition = () => {
    const newCondition: Partial<RuleCondition> = {
      parameter: 'Age',
      operator: 'equals',
      value: ''
    };
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition as RuleCondition]
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, field: keyof RuleCondition, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const addAction = () => {
    const newAction: Partial<RuleAction> = {
      type: 'Assign Benefit Group',
      value: ''
    };
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, newAction as RuleAction]
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, field: keyof RuleAction, value: any) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const getValueInput = (condition: RuleCondition, index: number) => {
    if (condition.operator === 'in_list') {
      let options: string[] = [];
      switch (condition.parameter) {
        case 'Department': options = DEPARTMENTS; break;
        case 'Location': options = LOCATIONS; break;
        case 'Designation': options = DESIGNATIONS; break;
        default: return (
          <Input
            placeholder="Enter comma-separated values"
            value={Array.isArray(condition.value) ? condition.value.join(', ') : ''}
            onChange={(e) => updateCondition(index, 'value', e.target.value.split(',').map(v => v.trim()))}
          />
        );
      }

      return (
        <Select 
          value={Array.isArray(condition.value) ? condition.value.join(',') : ''}
          onValueChange={(value) => updateCondition(index, 'value', value.split(','))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select values" />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (condition.parameter === 'Age' || condition.parameter === 'Service Period') {
      return (
        <Input
          type="number"
          placeholder="Enter number"
          value={condition.value as string}
          onChange={(e) => updateCondition(index, 'value', parseInt(e.target.value) || 0)}
        />
      );
    }

    return (
      <Input
        placeholder="Enter value"
        value={condition.value as string}
        onChange={(e) => updateCondition(index, 'value', e.target.value)}
      />
    );
  };

  const getActionValueInput = (action: RuleAction, index: number) => {
    switch (action.type) {
      case 'Assign Benefit Group':
        return (
          <Select 
            value={action.value as string}
            onValueChange={(value) => updateAction(index, 'value', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select benefit group" />
            </SelectTrigger>
            <SelectContent>
              {BENEFIT_GROUPS.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'Set Wallet Amount':
        return (
          <Input
            type="number"
            placeholder="Enter amount"
            value={action.value as string}
            onChange={(e) => updateAction(index, 'value', parseInt(e.target.value) || 0)}
          />
        );

      case 'Enable AHC':
        return (
          <Switch
            checked={action.value as boolean}
            onCheckedChange={(checked) => updateAction(index, 'value', checked)}
          />
        );

      case 'Set Family Coverage':
        return (
          <Switch
            checked={action.value as boolean}
            onCheckedChange={(checked) => updateAction(index, 'value', checked)}
          />
        );

      default:
        return (
          <Input
            placeholder="Enter value"
            value={action.value as string}
            onChange={(e) => updateAction(index, 'value', e.target.value)}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {mode === 'create' ? 'Create New Rule' : `Edit Rule: ${rule?.name}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Configure a new eligibility rule to automatically assign benefits based on employee criteria.'
              : 'Modify the rule configuration. Changes will apply to future evaluations.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rule Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Rule Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter rule name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="1"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this rule does and when it should be applied"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.effectiveDateRange.startDate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      effectiveDateRange: { ...prev.effectiveDateRange, startDate: e.target.value }
                    }))}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.effectiveDateRange.endDate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      effectiveDateRange: { ...prev.effectiveDateRange, endDate: e.target.value }
                    }))}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Rule is active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Eligibility Conditions
                </CardTitle>
                <Button onClick={addCondition} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {errors.conditions && (
                <p className="text-sm text-red-500 mb-4">{errors.conditions}</p>
              )}
              
              {formData.conditions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No conditions added yet. Add conditions to define who this rule applies to.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.conditions.map((condition, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">Condition {index + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>Parameter</Label>
                          <Select
                            value={condition.parameter}
                            onValueChange={(value) => updateCondition(index, 'parameter', value)}
                          >
                            <SelectTrigger className={errors[`condition_${index}_parameter`] ? 'border-red-500' : ''}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CONDITION_PARAMETERS.map(param => (
                                <SelectItem key={param} value={param}>{param}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`condition_${index}_parameter`] && (
                            <p className="text-sm text-red-500 mt-1">{errors[`condition_${index}_parameter`]}</p>
                          )}
                        </div>

                        <div>
                          <Label>Operator</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value) => updateCondition(index, 'operator', value)}
                          >
                            <SelectTrigger className={errors[`condition_${index}_operator`] ? 'border-red-500' : ''}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CONDITION_OPERATORS.map(op => (
                                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`condition_${index}_operator`] && (
                            <p className="text-sm text-red-500 mt-1">{errors[`condition_${index}_operator`]}</p>
                          )}
                        </div>

                        <div>
                          <Label>Value</Label>
                          <div className={errors[`condition_${index}_value`] ? 'border-red-500' : ''}>
                            {getValueInput(condition, index)}
                          </div>
                          {errors[`condition_${index}_value`] && (
                            <p className="text-sm text-red-500 mt-1">{errors[`condition_${index}_value`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Benefit Actions
                </CardTitle>
                <Button onClick={addAction} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {errors.actions && (
                <p className="text-sm text-red-500 mb-4">{errors.actions}</p>
              )}
              
              {formData.actions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No actions added yet. Add actions to define what benefits should be assigned.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.actions.map((action, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">Action {index + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAction(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Action Type</Label>
                          <Select
                            value={action.type}
                            onValueChange={(value) => updateAction(index, 'type', value)}
                          >
                            <SelectTrigger className={errors[`action_${index}_type`] ? 'border-red-500' : ''}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ACTION_TYPES.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`action_${index}_type`] && (
                            <p className="text-sm text-red-500 mt-1">{errors[`action_${index}_type`]}</p>
                          )}
                        </div>

                        <div>
                          <Label>Value</Label>
                          <div className={errors[`action_${index}_value`] ? 'border-red-500' : ''}>
                            {getActionValueInput(action, index)}
                          </div>
                          {errors[`action_${index}_value`] && (
                            <p className="text-sm text-red-500 mt-1">{errors[`action_${index}_value`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === 'create' ? 'Create Rule' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RuleConfigurationModal;