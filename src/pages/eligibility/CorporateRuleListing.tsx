import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Play, 
  Archive, 
  Clock,
  Users,
  Settings,
  Download,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { EligibilityRule } from '@/services/eligibilityMockData';
import { useEligibilityRules } from '@/hooks/useEligibilityQueries';
import { eligibilityAPI } from '@/services/eligibilityAPI';
import CreateCorporateRuleModal from '@/components/eligibility/CreateCorporateRuleModal';
import RuleDetailsModal from '@/components/eligibility/RuleDetailsModal';
import EligibleEmployeesModal from '@/components/eligibility/EligibleEmployeesModal';
import RuleActivityLogModal from '@/components/eligibility/RuleActivityLogModal';

type SortField = 'name' | 'status' | 'affectedEmployees' | 'lastEvaluated';
type SortDirection = 'asc' | 'desc' | null;

interface CorporateRuleListingProps {
  selectedCorporate: string;
  selectedProgramTerm: string;
  isReadOnly?: boolean;
}

const CorporateRuleListing: React.FC<CorporateRuleListingProps> = ({ 
  selectedCorporate, 
  selectedProgramTerm, 
  isReadOnly = false 
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeRangeFilter, setEmployeeRangeFilter] = useState('all');
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Modal states
  const [showRuleDetails, setShowRuleDetails] = useState(false);
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [showEligibleEmployees, setShowEligibleEmployees] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [selectedRule, setSelectedRule] = useState<EligibilityRule | null>(null);

  // Data fetching
  const { data: rules = [], isLoading } = useEligibilityRules();

  // Generate mock affected employee counts for rules
  const ruleAffectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rules.forEach(rule => {
      // Generate realistic employee counts based on rule criteria
      const baseCount = Math.floor(Math.random() * 400) + 50;
      counts[rule.id] = baseCount;
    });
    return counts;
  }, [rules]);

  // Filter and sort rules
  const filteredAndSortedRules = useMemo(() => {
    let filtered = rules.filter(rule => {
      // Corporate filter - only show rules for the selected corporate
      if (selectedCorporate) {
        const hasMatchingCorporateCondition = rule.conditions.some(condition => 
          condition.parameter === 'Corporate' && 
          condition.operator === 'equals' && 
          condition.value === selectedCorporate
        );
        if (!hasMatchingCorporateCondition) return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!rule.name.toLowerCase().includes(searchLower) &&
            !rule.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === 'active' && !rule.isActive) return false;
      if (statusFilter === 'archived' && rule.isActive) return false;

      // Employee range filter
      if (employeeRangeFilter !== 'all') {
        const count = ruleAffectedCounts[rule.id] || 0;
        switch (employeeRangeFilter) {
          case '0-50': if (count > 50) return false; break;
          case '51-200': if (count <= 50 || count > 200) return false; break;
          case '201-500': if (count <= 200 || count > 500) return false; break;
          case '500+': if (count <= 500) return false; break;
        }
      }

      return true;
    });

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortField) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'status':
            aValue = a.isActive ? 'active' : 'archived';
            bValue = b.isActive ? 'active' : 'archived';
            break;
          case 'affectedEmployees':
            aValue = ruleAffectedCounts[a.id] || 0;
            bValue = ruleAffectedCounts[b.id] || 0;
            break;
          case 'lastEvaluated':
            aValue = new Date(a.lastModified).getTime();
            bValue = new Date(b.lastModified).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [rules, searchTerm, statusFilter, employeeRangeFilter, sortField, sortDirection, ruleAffectedCounts, selectedCorporate]);

  // Sorting handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> none
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    if (sortDirection === 'asc') return <ChevronUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ChevronDown className="h-4 w-4" />;
    return null;
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedRules.length === filteredAndSortedRules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(filteredAndSortedRules.map(rule => rule.id));
    }
  };

  const handleSelectRule = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  // Action handlers
  const handleCreateRule = () => {
    setSelectedRule(null);
    setShowCreateRuleModal(true);
  };

  const handleEditRule = (rule: EligibilityRule) => {
    setSelectedRule(rule);
    setShowCreateRuleModal(true);
  };

  const handleViewDetails = (rule: EligibilityRule) => {
    setSelectedRule(rule);
    setShowRuleDetails(true);
  };

  const handleViewEligibleEmployees = (rule: EligibilityRule) => {
    setSelectedRule(rule);
    setShowEligibleEmployees(true);
  };

  const handleViewActivityLog = (rule: EligibilityRule) => {
    setSelectedRule(rule);
    setShowActivityLog(true);
  };

  const handleEvaluateRule = async (rule: EligibilityRule) => {
    try {
      console.log('Evaluating rule:', rule.name);
      
      // Show loading state
      const result = await eligibilityAPI.eligibilityRules.evaluateRule(rule.id);
      
      // Show results
      alert(`Rule Evaluation Complete!\n\n` +
            `Matched Employees: ${result.matchedEmployees}\n` +
            `Applied Actions: ${result.appliedActions}\n` +
            `Status: ${result.success ? 'Success' : 'Completed with errors'}\n` +
            (result.errors.length > 0 ? `Errors: ${result.errors.join(', ')}` : ''));
    } catch (error) {
      console.error('Rule evaluation failed:', error);
      alert(`Failed to evaluate rule: ${error}`);
    }
  };

  const handleArchiveRule = (rule: EligibilityRule) => {
    setSelectedRule(rule);
    setShowArchiveConfirm(true);
  };

  const confirmArchiveRule = async () => {
    if (selectedRule) {
      try {
        await eligibilityAPI.eligibilityRules.updateRule(selectedRule.id, { 
          isActive: false,
          lastModified: new Date().toISOString().split('T')[0],
          modifiedBy: 'Current User'
        });
        
        console.log('Successfully archived rule:', selectedRule.name);
        setShowArchiveConfirm(false);
        setSelectedRule(null);
      } catch (error) {
        console.error('Failed to archive rule:', error);
        alert('Failed to archive rule. Please try again.');
      }
    }
  };

  const handleBulkArchive = async () => {
    if (selectedRules.length === 0) return;
    
    try {
      const result = await eligibilityAPI.eligibilityRules.bulkArchiveRules(selectedRules);
      
      if (result.success > 0) {
        alert(`Successfully archived ${result.success} rule(s)` + 
              (result.failed > 0 ? `\nFailed to archive ${result.failed} rule(s)` : ''));
      }
      
      if (result.errors.length > 0) {
        console.error('Bulk archive errors:', result.errors);
      }
      
      // Clear selection
      setSelectedRules([]);
    } catch (error) {
      console.error('Failed to archive rules:', error);
      alert('Failed to archive rules. Please try again.');
    }
  };

  const handleBulkExport = () => {
    if (selectedRules.length === 0) return;
    
    const selectedRuleObjects = filteredAndSortedRules.filter(rule => selectedRules.includes(rule.id));
    
    const csvHeaders = ['Rule Name', 'Status', 'Priority', 'Description', 'Conditions Count', 'Actions Count', 'Created Date', 'Last Modified', 'Modified By'];
    const csvData = selectedRuleObjects.map(rule => [
      rule.name,
      rule.isActive ? 'Active' : 'Archived',
      rule.priority.toString(),
      rule.description,
      rule.conditions.length.toString(),
      rule.actions.length.toString(),
      rule.effectiveDateRange.startDate,
      rule.lastModified,
      rule.modifiedBy
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `corporate-rules-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Exported ${selectedRules.length} rules to CSV`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setEmployeeRangeFilter('all');
    setSortField(null);
    setSortDirection(null);
  };

  const formatCriteria = (rule: EligibilityRule) => {
    const criteria = rule.conditions.map(condition => {
      const operatorText = {
        'equals': '=',
        'not_equals': '≠',
        'greater_than': '>',
        'less_than': '<',
        'contains': 'contains',
        'in_list': 'in'
      }[condition.operator] || condition.operator;
      
      return `${condition.parameter} ${operatorText} ${Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}`;
    }).join(' AND ');
    
    return criteria.length > 100 ? criteria.substring(0, 100) + '...' : criteria;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Corporate Eligibility Rules
          </CardTitle>
          {!isReadOnly && (
            <Button onClick={handleCreateRule} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Rule
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Bulk Actions Bar */}
        {selectedRules.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedRules.length} rule(s) selected
                </span>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={handleSelectAll}
                  className="h-auto p-0"
                >
                  Select all {filteredAndSortedRules.length} rules
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {!isReadOnly && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBulkArchive}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Selected
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedRules([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        {selectedRules.length === 0 && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rules by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              {/* Employee Range Filter */}
              <Select value={employeeRangeFilter} onValueChange={setEmployeeRangeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Affected Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="0-50">0-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(searchTerm || statusFilter !== 'all' || employeeRangeFilter !== 'all' || sortField) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Rules Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedRules.length === filteredAndSortedRules.length && filteredAndSortedRules.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="w-1/4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Rule Name
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-20 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead className="w-3/10">Criteria</TableHead>
                <TableHead 
                  className="w-32 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('affectedEmployees')}
                >
                  <div className="flex items-center gap-2">
                    Affected Employees
                    {getSortIcon('affectedEmployees')}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-36 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('lastEvaluated')}
                >
                  <div className="flex items-center gap-2">
                    Last Evaluated
                    {getSortIcon('lastEvaluated')}
                  </div>
                </TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="w-4 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-48 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-6 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-64 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-12 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-24 h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-8 h-8 bg-gray-200 rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedRules.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Settings className="h-12 w-12 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {rules.length === 0 ? 'No eligibility rules created yet' : 'No rules match your filters'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {rules.length === 0 
                            ? 'Create rules to automatically assign benefits based on employee criteria'
                            : 'Try adjusting your filters or search terms'
                          }
                        </p>
                        {rules.length === 0 ? (
                          !isReadOnly && (
                            <Button onClick={handleCreateRule} className="bg-green-600 hover:bg-green-700">
                              Create First Rule
                            </Button>
                          )
                        ) : (
                          <Button variant="outline" onClick={clearFilters}>
                            Clear all filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRules.includes(rule.id)}
                        onCheckedChange={() => handleSelectRule(rule.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{rule.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.isActive ? "default" : "secondary"} className={
                        rule.isActive 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }>
                        {rule.isActive ? 'Active' : 'Archived'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={formatCriteria(rule)}>
                        {formatCriteria(rule)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewEligibleEmployees(rule)}
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                      >
                        <Users className="h-4 w-4" />
                        {(ruleAffectedCounts[rule.id] || 0).toLocaleString()}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(rule.lastModified)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                          <DropdownMenuItem onClick={() => handleViewDetails(rule)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {!isReadOnly && rule.isActive && (
                            <>
                              <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit Rule
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEvaluateRule(rule)}>
                                <Play className="mr-2 h-4 w-4" />
                                Evaluate Now
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleArchiveRule(rule)}
                                className="text-red-600"
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archive Rule
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleViewActivityLog(rule)}>
                            <Clock className="mr-2 h-4 w-4" />
                            View Activity Log
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Archive Confirmation Dialog */}
        <Dialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Archive Rule</DialogTitle>
              <DialogDescription>
                Are you sure you want to archive '{selectedRule?.name}'? This will stop the rule from being applied to employees.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowArchiveConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmArchiveRule}>
                Archive Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Corporate Rule Modal */}
        <CreateCorporateRuleModal
          isOpen={showCreateRuleModal}
          onClose={() => {
            setShowCreateRuleModal(false);
            setSelectedRule(null);
          }}
          onSave={(ruleData) => {
            console.log('Saving rule:', ruleData);
            // TODO: Implement actual save functionality
            setShowCreateRuleModal(false);
            setSelectedRule(null);
          }}
          existingRule={selectedRule}
          mode={selectedRule ? 'edit' : 'create'}
        />

        {/* Rule Details Modal */}
        <RuleDetailsModal
          open={showRuleDetails}
          onOpenChange={setShowRuleDetails}
          rule={selectedRule}
          affectedEmployeeCount={selectedRule ? ruleAffectedCounts[selectedRule.id] || 0 : 0}
          onEdit={handleEditRule}
          onViewEmployees={handleViewEligibleEmployees}
          canEdit={!isReadOnly}
        />

        {/* Eligible Employees Modal */}
        <EligibleEmployeesModal
          open={showEligibleEmployees}
          onOpenChange={setShowEligibleEmployees}
          rule={selectedRule}
        />

        {/* Activity Log Modal */}
        <RuleActivityLogModal
          open={showActivityLog}
          onOpenChange={setShowActivityLog}
          rule={selectedRule}
        />
      </CardContent>
    </Card>
  );
};

export default CorporateRuleListing;