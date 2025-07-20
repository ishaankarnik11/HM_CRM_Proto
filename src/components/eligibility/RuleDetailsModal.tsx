import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Edit2, 
  Calendar, 
  Users, 
  Settings, 
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { EligibilityRule } from '@/services/eligibilityMockData';

interface RuleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: EligibilityRule | null;
  affectedEmployeeCount?: number;
  onEdit?: (rule: EligibilityRule) => void;
  onViewEmployees?: (rule: EligibilityRule) => void;
  canEdit?: boolean;
}

const RuleDetailsModal: React.FC<RuleDetailsModalProps> = ({
  open,
  onOpenChange,
  rule,
  affectedEmployeeCount = 0,
  onEdit,
  onViewEmployees,
  canEdit = true
}) => {
  if (!rule) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCriteria = (rule: EligibilityRule) => {
    return rule.conditions.map((condition, index) => {
      const operatorText = {
        'equals': 'equals',
        'not_equals': 'does not equal',
        'greater_than': 'is greater than',
        'less_than': 'is less than',
        'contains': 'contains',
        'in_list': 'is one of'
      }[condition.operator] || condition.operator;
      
      const valueText = Array.isArray(condition.value) 
        ? condition.value.join(', ') 
        : condition.value.toString();
      
      return (
        <div key={condition.id || index} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
          <span className="font-medium">{condition.parameter}</span>
          <span className="text-gray-600">{operatorText}</span>
          <Badge variant="outline" className="font-normal">
            {valueText}
          </Badge>
        </div>
      );
    });
  };

  const formatActions = (rule: EligibilityRule) => {
    return rule.actions.map((action, index) => {
      let actionDescription = '';
      let actionIcon = <Settings className="h-4 w-4" />;
      
      switch (action.type) {
        case 'Assign Benefit Group':
          actionDescription = `Assign "${action.value}" benefit group`;
          actionIcon = <Shield className="h-4 w-4" />;
          break;
        case 'Set Wallet Amount':
          actionDescription = `Set OPD wallet to ₹${Number(action.value).toLocaleString()}`;
          actionIcon = <DollarSign className="h-4 w-4" />;
          break;
        case 'Enable AHC':
          actionDescription = `${action.value ? 'Enable' : 'Disable'} Annual Health Check`;
          actionIcon = action.value ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
          break;
        case 'Set Family Coverage':
          actionDescription = `${action.value ? 'Enable' : 'Disable'} family member coverage`;
          actionIcon = <Users className="h-4 w-4" />;
          break;
        default:
          actionDescription = `${action.type}: ${action.value}`;
      }
      
      return (
        <div key={action.id || index} className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
            {actionIcon}
          </div>
          <span>{actionDescription}</span>
        </div>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Rule Details: {rule.name}
          </DialogTitle>
          <DialogDescription>
            View complete rule configuration and affected employees
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Rule Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Rule Name</h4>
                  <p className="text-base font-medium">{rule.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Status</h4>
                  <Badge variant={rule.isActive ? "default" : "secondary"} className={
                    rule.isActive 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                  }>
                    {rule.isActive ? 'Active' : 'Archived'}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Priority</h4>
                  <p className="text-base">{rule.priority}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Created Date</h4>
                  <p className="text-base">{formatDate(rule.effectiveDateRange.startDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Last Modified</h4>
                  <p className="text-base">{formatDate(rule.lastModified)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Modified By</h4>
                  <p className="text-base">{rule.modifiedBy}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-1">Description</h4>
                <p className="text-base text-gray-800">{rule.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-1">Effective Period</h4>
                <div className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(rule.effectiveDateRange.startDate)}</span>
                  <span className="text-gray-500">to</span>
                  <span>{formatDate(rule.effectiveDateRange.endDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Criteria Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Employees must meet ALL of the following conditions:
                </p>
                {formatCriteria(rule)}
              </div>
            </CardContent>
          </Card>

          {/* Benefits Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Benefits Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  When conditions are met, the following actions will be applied:
                </p>
                <div className="space-y-3">
                  {formatActions(rule)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affected Employees Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Affected Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {affectedEmployeeCount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    employees match this rule's criteria
                  </p>
                </div>
                {onViewEmployees && (
                  <Button 
                    variant="outline" 
                    onClick={() => onViewEmployees(rule)}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    View Employee List
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Last Evaluation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Last Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {formatDate(rule.lastModified)} at {new Date(rule.lastModified + 'T10:30:00').toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rule was last evaluated automatically during the nightly batch process
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {canEdit && onEdit && (
            <Button onClick={() => onEdit(rule)} className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Rule
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RuleDetailsModal;