import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Play, 
  Save, 
  X,
  AlertCircle,
  CheckCircle,
  Settings,
  Filter,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Shield,
  Wallet,
  Mail,
  Users,
  Target,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Database
} from "lucide-react";

interface RuleCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
}

interface RuleAction {
  id: string;
  type: 'assign_benefit_group' | 'set_opd_wallet' | 'activate_eligibility' | 'send_notification' | 'block_eligibility';
  parameters: Record<string, any>;
}

interface Rule {
  id?: string;
  name: string;
  description: string;
  priority: number;
  isActive: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  logicOperator: 'AND' | 'OR';
}

interface RuleBuilderFormProps {
  rule?: Rule | null;
  onSave: (rule: Rule) => void;
  onCancel: () => void;
}

const RuleBuilderForm = ({ rule, onSave, onCancel }: RuleBuilderFormProps) => {
  const [formData, setFormData] = useState<Rule>({
    name: '',
    description: '',
    priority: 1,
    isActive: true,
    conditions: [],
    actions: [],
    logicOperator: 'AND'
  });

  const [showConditionsHelp, setShowConditionsHelp] = useState(false);
  const [showActionsHelp, setShowActionsHelp] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isTestingRule, setIsTestingRule] = useState(false);

  useEffect(() => {
    if (rule) {
      setFormData({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        priority: rule.priority,
        isActive: rule.isActive,
        conditions: rule.conditions || [],
        actions: rule.actions || [],
        logicOperator: rule.logicOperator || 'AND'
      });
    }
  }, [rule]);

  const availableFields = [
    { value: 'department', label: 'Department', type: 'string' },
    { value: 'designation', label: 'Designation', type: 'string' },
    { value: 'location', label: 'Location', type: 'string' },
    { value: 'salary', label: 'Salary', type: 'number' },
    { value: 'experience', label: 'Experience (Years)', type: 'number' },
    { value: 'age', label: 'Age', type: 'number' },
    { value: 'joinDate', label: 'Join Date', type: 'date' },
    { value: 'employeeType', label: 'Employee Type', type: 'string' },
    { value: 'grade', label: 'Grade', type: 'string' },
    { value: 'reportingManager', label: 'Reporting Manager', type: 'string' }
  ];

  const operatorsByType = {
    string: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'in', 'not_in'],
    number: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between'],
    date: ['equals', 'not_equals', 'before', 'after', 'between'],
    boolean: ['equals', 'not_equals']
  };

  const operatorLabels = {
    'equals': 'Equals',
    'not_equals': 'Not Equals',
    'contains': 'Contains',
    'not_contains': 'Does Not Contain',
    'starts_with': 'Starts With',
    'ends_with': 'Ends With',
    'in': 'In List',
    'not_in': 'Not In List',
    'greater_than': 'Greater Than',
    'less_than': 'Less Than',
    'greater_equal': 'Greater Than or Equal',
    'less_equal': 'Less Than or Equal',
    'between': 'Between',
    'before': 'Before',
    'after': 'After'
  };

  const actionTypes = [
    { value: 'assign_benefit_group', label: 'Assign Benefit Group', icon: Shield },
    { value: 'set_opd_wallet', label: 'Set OPD Wallet Amount', icon: Wallet },
    { value: 'activate_eligibility', label: 'Activate Eligibility', icon: CheckCircle },
    { value: 'send_notification', label: 'Send Notification', icon: Mail },
    { value: 'block_eligibility', label: 'Block Eligibility', icon: X }
  ];

  const addCondition = () => {
    const newCondition: RuleCondition = {
      id: `condition-${Date.now()}`,
      field: '',
      operator: '',
      value: '',
      dataType: 'string'
    };
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const updateCondition = (id: string, updates: Partial<RuleCondition>) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map(condition =>
        condition.id === id ? { ...condition, ...updates } : condition
      )
    }));
  };

  const removeCondition = (id: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter(condition => condition.id !== id)
    }));
  };

  const addAction = () => {
    const newAction: RuleAction = {
      id: `action-${Date.now()}`,
      type: 'assign_benefit_group',
      parameters: {}
    };
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const updateAction = (id: string, updates: Partial<RuleAction>) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === id ? { ...action, ...updates } : action
      )
    }));
  };

  const removeAction = (id: string) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter(action => action.id !== id)
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Rule name is required');
      return;
    }
    if (formData.conditions.length === 0) {
      alert('At least one condition is required');
      return;
    }
    if (formData.actions.length === 0) {
      alert('At least one action is required');
      return;
    }
    onSave(formData);
  };

  const handleTestRule = async () => {
    if (formData.conditions.length === 0) {
      alert('Add conditions before testing the rule');
      return;
    }

    setIsTestingRule(true);
    setShowTestModal(true);

    try {
      // Simulate rule testing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock test results with realistic data
      const mockTestResults = {
        totalEmployeesEvaluated: 1247,
        matchedEmployees: Math.floor(Math.random() * 300) + 50,
        wouldBeAffected: Math.floor(Math.random() * 200) + 25,
        estimatedImpact: {
          benefitGroupChanges: Math.floor(Math.random() * 150) + 10,
          opdWalletAllocations: Math.floor(Math.random() * 100) + 5,
          eligibilityActivations: Math.floor(Math.random() * 80) + 15,
          notificationsSent: Math.floor(Math.random() * 200) + 30
        },
        sampleMatches: [
          { id: 'EMP001', name: 'Rajesh Kumar', department: 'Engineering', salary: 85000, experience: 5, wouldMatch: true, currentBenefitGroup: 'Employee', newBenefitGroup: 'Senior' },
          { id: 'EMP045', name: 'Priya Sharma', department: 'Finance', salary: 95000, experience: 7, wouldMatch: true, currentBenefitGroup: 'Senior', newBenefitGroup: 'Manager' },
          { id: 'EMP123', name: 'Amit Patel', department: 'HR', salary: 75000, experience: 4, wouldMatch: true, currentBenefitGroup: 'Employee', newBenefitGroup: 'Senior' },
          { id: 'EMP089', name: 'Sneha Reddy', department: 'Engineering', salary: 120000, experience: 9, wouldMatch: true, currentBenefitGroup: 'Manager', newBenefitGroup: 'Executive' },
          { id: 'EMP156', name: 'Vikram Singh', department: 'Sales', salary: 65000, experience: 3, wouldMatch: false, currentBenefitGroup: 'Employee', newBenefitGroup: null }
        ],
        performanceMetrics: {
          executionTime: Math.floor(Math.random() * 500) + 100,
          memoryUsage: Math.floor(Math.random() * 50) + 20,
          complexity: formData.conditions.length > 3 ? 'High' : formData.conditions.length > 1 ? 'Medium' : 'Low'
        },
        potentialConflicts: [
          { ruleId: 'rule-001', ruleName: 'Department Head Benefits', conflictType: 'Priority Overlap', severity: 'Medium' },
          { ruleId: 'rule-003', ruleName: 'Senior Manager OPD', conflictType: 'Action Conflict', severity: 'Low' }
        ]
      };

      setTestResults(mockTestResults);
    } catch (error) {
      console.error('Rule testing failed:', error);
    } finally {
      setIsTestingRule(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Rule Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                placeholder="e.g., Executive Level Benefits"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Highest</SelectItem>
                  <SelectItem value="2">2 - High</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - Low</SelectItem>
                  <SelectItem value="5">5 - Lowest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this rule does and when it should be applied..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label>Active Rule</Label>
          </div>
        </CardContent>
      </Card>

      {/* Conditions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Conditions</CardTitle>
              <Badge variant="secondary">{formData.conditions.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConditionsHelp(!showConditionsHelp)}
              >
                {showConditionsHelp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Help
              </Button>
              <Button onClick={addCondition} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </div>
          </div>
          {showConditionsHelp && (
            <CardDescription className="mt-2 p-3 bg-blue-50 rounded border">
              <div className="text-sm space-y-1">
                <p><strong>Conditions</strong> define when this rule should be applied to employees.</p>
                <p>• Use <strong>AND</strong> if all conditions must be true</p>
                <p>• Use <strong>OR</strong> if any condition can be true</p>
                <p>• You can combine different employee fields like department, salary, experience, etc.</p>
              </div>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.conditions.length > 1 && (
            <div className="flex items-center gap-2">
              <Label>Logic Operator:</Label>
              <Select value={formData.logicOperator} onValueChange={(value: 'AND' | 'OR') => setFormData(prev => ({ ...prev, logicOperator: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                {formData.logicOperator === 'AND' ? 'All conditions must be true' : 'Any condition can be true'}
              </span>
            </div>
          )}

          {formData.conditions.map((condition, index) => {
            const field = availableFields.find(f => f.value === condition.field);
            const operators = field ? operatorsByType[field.type] : [];

            return (
              <div key={condition.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Condition {index + 1}</Badge>
                    {index > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {formData.logicOperator}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(condition.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label>Field</Label>
                    <Select value={condition.field} onValueChange={(value) => {
                      const selectedField = availableFields.find(f => f.value === value);
                      updateCondition(condition.id, {
                        field: value,
                        dataType: selectedField?.type as any,
                        operator: '',
                        value: ''
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields.map(field => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Operator</Label>
                    <Select value={condition.operator} onValueChange={(value) => updateCondition(condition.id, { operator: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map(op => (
                          <SelectItem key={op} value={op}>
                            {operatorLabels[op as keyof typeof operatorLabels]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Value</Label>
                    <Input
                      placeholder="Enter value"
                      value={condition.value}
                      onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {formData.conditions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No conditions added yet</p>
              <p className="text-sm">Add conditions to define when this rule should apply</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <CardTitle>Actions</CardTitle>
              <Badge variant="secondary">{formData.actions.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActionsHelp(!showActionsHelp)}
              >
                {showActionsHelp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Help
              </Button>
              <Button onClick={addAction} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Action
              </Button>
            </div>
          </div>
          {showActionsHelp && (
            <CardDescription className="mt-2 p-3 bg-green-50 rounded border">
              <div className="text-sm space-y-1">
                <p><strong>Actions</strong> define what happens when the conditions are met.</p>
                <p>• <strong>Assign Benefit Group:</strong> Automatically assign employees to specific benefit groups</p>
                <p>• <strong>Set OPD Wallet:</strong> Allocate specific OPD wallet amounts</p>
                <p>• <strong>Activate/Block Eligibility:</strong> Control employee eligibility status</p>
                <p>• <strong>Send Notification:</strong> Send automated emails or messages</p>
              </div>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.actions.map((action, index) => {
            const actionType = actionTypes.find(at => at.value === action.type);
            const ActionIcon = actionType?.icon || Zap;

            return (
              <div key={action.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Action {index + 1}</Badge>
                    <ActionIcon className="h-4 w-4" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAction(action.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Action Type</Label>
                    <Select value={action.type} onValueChange={(value) => updateAction(action.id, { type: value as any, parameters: {} })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map(at => {
                          const Icon = at.icon;
                          return (
                            <SelectItem key={at.value} value={at.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {at.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action-specific parameters */}
                  {action.type === 'assign_benefit_group' && (
                    <div className="space-y-2">
                      <Label>Benefit Group</Label>
                      <Select value={action.parameters.benefitGroup || ''} onValueChange={(value) => updateAction(action.id, { parameters: { benefitGroup: value } })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select benefit group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executive">Executive</SelectItem>
                          <SelectItem value="senior">Senior Management</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {action.type === 'set_opd_wallet' && (
                    <div className="space-y-2">
                      <Label>OPD Wallet Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 25000"
                        value={action.parameters.amount || ''}
                        onChange={(e) => updateAction(action.id, { parameters: { amount: e.target.value } })}
                      />
                    </div>
                  )}

                  {action.type === 'send_notification' && (
                    <div className="space-y-2">
                      <Label>Message Template</Label>
                      <Select value={action.parameters.template || ''} onValueChange={(value) => updateAction(action.id, { parameters: { template: value } })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="welcome">Welcome Message</SelectItem>
                          <SelectItem value="benefit_assigned">Benefit Group Assigned</SelectItem>
                          <SelectItem value="wallet_credited">OPD Wallet Credited</SelectItem>
                          <SelectItem value="eligibility_activated">Eligibility Activated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {formData.actions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No actions added yet</p>
              <p className="text-sm">Add actions to define what happens when conditions are met</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {formData.conditions.length > 0 && formData.actions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Rule Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">IF</Badge>
                <span className="text-sm font-medium">
                  {formData.conditions.map((condition, index) => {
                    const field = availableFields.find(f => f.value === condition.field);
                    const operator = operatorLabels[condition.operator as keyof typeof operatorLabels];
                    return (
                      <span key={condition.id}>
                        {index > 0 && ` ${formData.logicOperator} `}
                        {field?.label} {operator} "{condition.value}"
                      </span>
                    );
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">THEN</Badge>
                <span className="text-sm font-medium">
                  {formData.actions.map((action, index) => {
                    const actionType = actionTypes.find(at => at.value === action.type);
                    return (
                      <span key={action.id}>
                        {index > 0 && ', '}
                        {actionType?.label}
                        {action.type === 'assign_benefit_group' && action.parameters.benefitGroup && `: ${action.parameters.benefitGroup}`}
                        {action.type === 'set_opd_wallet' && action.parameters.amount && ` : ₹${action.parameters.amount}`}
                      </span>
                    );
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleTestRule}
            disabled={formData.conditions.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Test Rule
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Rule
          </Button>
        </div>
      </div>

      {/* Rule Test Results Modal */}
      <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Rule Test Results
            </DialogTitle>
            <DialogDescription>
              Testing rule: "{formData.name}" against current employee database
            </DialogDescription>
          </DialogHeader>
          
          {isTestingRule ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin h-12 w-12 border-3 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Testing Rule...</p>
                  <p className="text-sm text-muted-foreground">Evaluating {1247} employee records</p>
                </div>
              </div>
            </div>
          ) : testResults && (
            <div className="flex-1 overflow-auto space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{testResults.totalEmployeesEvaluated}</div>
                    <div className="text-sm text-muted-foreground">Employees Evaluated</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{testResults.matchedEmployees}</div>
                    <div className="text-sm text-muted-foreground">Matched Conditions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{testResults.wouldBeAffected}</div>
                    <div className="text-sm text-muted-foreground">Would Be Affected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((testResults.matchedEmployees / testResults.totalEmployeesEvaluated) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Match Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Estimated Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Estimated Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-semibold text-blue-600">{testResults.estimatedImpact.benefitGroupChanges}</div>
                      <div className="text-sm text-muted-foreground">Benefit Group Changes</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-semibold text-green-600">{testResults.estimatedImpact.opdWalletAllocations}</div>
                      <div className="text-sm text-muted-foreground">OPD Wallet Allocations</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-semibold text-orange-600">{testResults.estimatedImpact.eligibilityActivations}</div>
                      <div className="text-sm text-muted-foreground">Eligibility Activations</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-semibold text-purple-600">{testResults.estimatedImpact.notificationsSent}</div>
                      <div className="text-sm text-muted-foreground">Notifications Sent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-semibold">{testResults.performanceMetrics.executionTime}ms</div>
                      <div className="text-sm text-muted-foreground">Execution Time</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-semibold">{testResults.performanceMetrics.memoryUsage}MB</div>
                      <div className="text-sm text-muted-foreground">Memory Usage</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <Badge variant={testResults.performanceMetrics.complexity === 'High' ? 'destructive' : testResults.performanceMetrics.complexity === 'Medium' ? 'secondary' : 'default'}>
                        {testResults.performanceMetrics.complexity} Complexity
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">Rule Complexity</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Employee Matches */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Sample Employee Matches
                  </CardTitle>
                  <CardDescription>
                    First 5 employees that would be affected by this rule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Salary</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Current Group</TableHead>
                          <TableHead>New Group</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testResults.sampleMatches.map((employee: any) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-muted-foreground">{employee.id}</div>
                              </div>
                            </TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>₹{employee.salary.toLocaleString()}</TableCell>
                            <TableCell>{employee.experience} years</TableCell>
                            <TableCell>
                              <Badge variant="outline">{employee.currentBenefitGroup}</Badge>
                            </TableCell>
                            <TableCell>
                              {employee.newBenefitGroup ? (
                                <Badge variant="secondary">{employee.newBenefitGroup}</Badge>
                              ) : (
                                <span className="text-muted-foreground">No change</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={employee.wouldMatch ? "default" : "secondary"}>
                                {employee.wouldMatch ? "Match" : "No Match"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Potential Conflicts */}
              {testResults.potentialConflicts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      Potential Rule Conflicts
                    </CardTitle>
                    <CardDescription>
                      Rules that might conflict with this rule based on priority and actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testResults.potentialConflicts.map((conflict: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded bg-orange-50">
                          <div>
                            <div className="font-medium">{conflict.ruleName}</div>
                            <div className="text-sm text-muted-foreground">{conflict.conflictType}</div>
                          </div>
                          <Badge variant={conflict.severity === 'High' ? 'destructive' : conflict.severity === 'Medium' ? 'secondary' : 'outline'}>
                            {conflict.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rule Priority Recommendation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Priority Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Recommended Priority:</span>
                      <Badge variant="default">
                        {testResults.potentialConflicts.length > 1 ? '2 - High' : 
                         testResults.matchedEmployees > 100 ? '3 - Medium' : '4 - Low'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testResults.potentialConflicts.length > 1 
                        ? 'High priority recommended due to multiple rule conflicts'
                        : testResults.matchedEmployees > 100
                        ? 'Medium priority suggested for rules affecting many employees'
                        : 'Low priority suitable for rules with limited scope'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              {testResults && !isTestingRule && (
                <>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Export Test Report
                  </Button>
                  <Button variant="outline" onClick={handleTestRule}>
                    <Play className="h-4 w-4 mr-2" />
                    Re-test Rule
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTestModal(false)}>
                Close
              </Button>
              {testResults && !isTestingRule && (
                <Button onClick={() => {
                  setShowTestModal(false);
                  // Apply recommended priority
                  const recommendedPriority = testResults.potentialConflicts.length > 1 ? 2 : 
                                             testResults.matchedEmployees > 100 ? 3 : 4;
                  setFormData(prev => ({ ...prev, priority: recommendedPriority }));
                }}>
                  Apply Recommendations
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RuleBuilderForm;