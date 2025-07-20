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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  User,
  Search, 
  Download,
  Calendar,
  Filter,
  FileEdit,
  Settings,
  Archive,
  Play,
  UserPlus,
  Eye
} from 'lucide-react';
import { EligibilityRule } from '@/services/eligibilityMockData';

interface RuleActivityLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: EligibilityRule | null;
}

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  user: string;
  actionType: 'Created' | 'Modified' | 'Activated' | 'Archived' | 'Evaluated' | 'Viewed';
  description: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  ipAddress?: string;
  sessionId?: string;
}

const RuleActivityLogModal: React.FC<RuleActivityLogModalProps> = ({
  open,
  onOpenChange,
  rule
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Generate mock activity log data
  const activityLog = useMemo((): ActivityLogEntry[] => {
    if (!rule) return [];

    const users = ['System Admin', 'HR Manager', 'John Smith', 'Sarah Johnson', 'Mike Wilson'];
    const actionTypes: ActivityLogEntry['actionType'][] = ['Created', 'Modified', 'Activated', 'Archived', 'Evaluated', 'Viewed'];
    
    const entries: ActivityLogEntry[] = [];
    
    // Generate 15-25 activity entries
    const entryCount = Math.floor(Math.random() * 11) + 15;
    
    for (let i = 0; i < entryCount; i++) {
      const daysAgo = Math.floor(Math.random() * 90); // Last 90 days
      const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 24 * 60 * 60 * 1000);
      const user = users[Math.floor(Math.random() * users.length)];
      const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      
      let description = '';
      let changes: ActivityLogEntry['changes'] = undefined;
      
      switch (actionType) {
        case 'Created':
          description = `Rule "${rule.name}" was created with ${rule.conditions.length} conditions and ${rule.actions.length} actions`;
          break;
        case 'Modified':
          description = `Rule configuration updated`;
          changes = [
            { field: 'Description', oldValue: 'Previous description...', newValue: rule.description },
            { field: 'Priority', oldValue: '2', newValue: rule.priority.toString() }
          ];
          break;
        case 'Activated':
          description = `Rule status changed to Active`;
          changes = [
            { field: 'Status', oldValue: 'Archived', newValue: 'Active' }
          ];
          break;
        case 'Archived':
          description = `Rule was archived and is no longer active`;
          changes = [
            { field: 'Status', oldValue: 'Active', newValue: 'Archived' }
          ];
          break;
        case 'Evaluated':
          description = `Rule evaluated against ${Math.floor(Math.random() * 500 + 100)} employees. ${Math.floor(Math.random() * 50 + 10)} employees matched criteria`;
          break;
        case 'Viewed':
          description = `Rule details viewed by user`;
          break;
      }
      
      entries.push({
        id: `activity-${i}`,
        timestamp: timestamp.toISOString(),
        user,
        actionType,
        description,
        changes,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        sessionId: `sess-${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [rule]);

  // Get unique users for filter
  const uniqueUsers = useMemo(() => {
    const users = [...new Set(activityLog.map(entry => entry.user))];
    return users.sort();
  }, [activityLog]);

  // Filter activity log
  const filteredActivityLog = useMemo(() => {
    return activityLog.filter(entry => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!entry.description.toLowerCase().includes(searchLower) &&
            !entry.user.toLowerCase().includes(searchLower) &&
            !entry.actionType.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Activity type filter
      if (activityTypeFilter !== 'all' && entry.actionType !== activityTypeFilter) {
        return false;
      }

      // User filter
      if (userFilter !== 'all' && entry.user !== userFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.from) {
        const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
        if (entryDate < dateRange.from) return false;
      }
      if (dateRange.to) {
        const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
        if (entryDate > dateRange.to) return false;
      }

      return true;
    });
  }, [activityLog, searchTerm, activityTypeFilter, userFilter, dateRange]);

  const getActionIcon = (actionType: ActivityLogEntry['actionType']) => {
    switch (actionType) {
      case 'Created': return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'Modified': return <FileEdit className="h-4 w-4 text-blue-600" />;
      case 'Activated': return <Play className="h-4 w-4 text-green-600" />;
      case 'Archived': return <Archive className="h-4 w-4 text-gray-600" />;
      case 'Evaluated': return <Settings className="h-4 w-4 text-purple-600" />;
      case 'Viewed': return <Eye className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadgeColor = (actionType: ActivityLogEntry['actionType']) => {
    switch (actionType) {
      case 'Created': return 'bg-green-100 text-green-800';
      case 'Modified': return 'bg-blue-100 text-blue-800';
      case 'Activated': return 'bg-green-100 text-green-800';
      case 'Archived': return 'bg-gray-100 text-gray-600';
      case 'Evaluated': return 'bg-purple-100 text-purple-800';
      case 'Viewed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const handleExportCSV = () => {
    if (!rule) return;
    
    const csvHeaders = ['Timestamp', 'User', 'Action Type', 'Description', 'IP Address'];
    const csvData = filteredActivityLog.map(entry => [
      entry.timestamp,
      entry.user,
      entry.actionType,
      entry.description,
      entry.ipAddress || 'N/A'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rule-activity-log-${rule.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActivityTypeFilter('all');
    setUserFilter('all');
    setDateRange({ from: '', to: '' });
  };

  if (!rule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Log: {rule.name}
          </DialogTitle>
          <DialogDescription>
            Complete timeline of all rule-related activities and changes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Activity Type Filter */}
              <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="Created">Created</SelectItem>
                  <SelectItem value="Modified">Modified</SelectItem>
                  <SelectItem value="Activated">Activated</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Evaluated">Evaluated</SelectItem>
                  <SelectItem value="Viewed">Viewed</SelectItem>
                </SelectContent>
              </Select>

              {/* User Filter */}
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {/* Date Range */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Date Range:</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  placeholder="From"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-40"
                />
                <span className="text-sm text-gray-500">to</span>
                <Input
                  type="date"
                  placeholder="To"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-40"
                />
              </div>
              {(searchTerm || activityTypeFilter !== 'all' || userFilter !== 'all' || dateRange.from || dateRange.to) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            Showing {filteredActivityLog.length} of {activityLog.length} activities
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredActivityLog.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-500">
                  {activityLog.length === 0 ? 'No activity has been recorded for this rule yet' : 'Try adjusting your filters'}
                </p>
              </div>
            ) : (
              filteredActivityLog.map((entry, index) => {
                const { date, time } = formatTimestamp(entry.timestamp);
                return (
                  <Card key={entry.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                            {getActionIcon(entry.actionType)}
                          </div>
                          {index < filteredActivityLog.length - 1 && (
                            <div className="w-px h-6 bg-gray-200 mt-2" />
                          )}
                        </div>

                        {/* Activity content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className={getActionBadgeColor(entry.actionType)}>
                                {entry.actionType}
                              </Badge>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{entry.user}</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              <div>{date}</div>
                              <div className="text-xs">{time}</div>
                            </div>
                          </div>

                          <p className="text-gray-800 mb-2">{entry.description}</p>

                          {/* Changes details */}
                          {entry.changes && entry.changes.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Changes:</h4>
                              <div className="space-y-1">
                                {entry.changes.map((change, changeIndex) => (
                                  <div key={changeIndex} className="text-sm">
                                    <span className="font-medium">{change.field}:</span>
                                    <span className="text-red-600 line-through ml-2">{change.oldValue}</span>
                                    <span className="text-green-600 ml-2">→ {change.newValue}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Technical details */}
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span>IP: {entry.ipAddress}</span>
                            <span>Session: {entry.sessionId}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
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

export default RuleActivityLogModal;