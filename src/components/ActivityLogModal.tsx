import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Filter, Search, FileDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { auditLogService, AuditLogEntry, AuditAction, AuditLogFilter } from '../services/auditLog';
import { exportToCSV } from '../services/csvExport';
import { useToast } from '../hooks/use-toast';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'INVOICE' | 'DC_BILL';
  entityId: string;
  entityName: string;
}

export const ActivityLogModal = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName
}: ActivityLogModalProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [filters, setFilters] = useState<AuditLogFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadAuditLogs();
    }
  }, [isOpen, entityType, entityId]);

  useEffect(() => {
    applyFilters();
  }, [auditLogs, filters, searchQuery]);

  const loadAuditLogs = () => {
    const logs = auditLogService.getAuditLogs(entityType, entityId);
    setAuditLogs(logs);
  };

  const applyFilters = () => {
    const filtered = auditLogService.getAllAuditLogs({
      ...filters,
      entityType,
      entityId,
      searchQuery: searchQuery || undefined
    });
    setFilteredLogs(filtered);
  };

  const groupedLogs = auditLogService.groupLogsByDate(filteredLogs);
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleFilterChange = (key: keyof AuditLogFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleExport = () => {
    try {
      if (filteredLogs.length === 0) {
        toast({
          title: "No Data to Export",
          description: "No audit logs found to export",
          variant: "destructive"
        });
        return;
      }

      const columnMapping = {
        'timestamp': 'Timestamp',
        'userName': 'User',
        'action': 'Action',
        'details': 'Details',
        'status': 'Status',
        'entityName': 'Entity'
      };

      const exportData = filteredLogs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp).toLocaleString(),
        action: auditLogService.getActionDisplayName(log.action)
      }));

      exportToCSV(exportData, `activity_log_${entityName}`, columnMapping);
      
      toast({
        title: "Export Successful",
        description: `${filteredLogs.length} audit logs exported to CSV`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export audit logs to CSV",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600';
      case 'FAILED':
        return 'text-red-600';
      case 'PENDING':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-semibold">Activity Log</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {entityName} • {filteredLogs.length} activities
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={filteredLogs.length === 0}
                className="flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Filters Section */}
        {showFilters && (
          <div className="border-t border-b bg-gray-50 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <Select value={filters.action || ''} onValueChange={(value) => handleFilterChange('action', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Actions</SelectItem>
                    <SelectItem value="PROFORMA_VIEWED">Pro-forma Viewed</SelectItem>
                    <SelectItem value="PDF_DOWNLOADED">PDF Downloaded</SelectItem>
                    <SelectItem value="DOCKET_SUBMITTED">Docket Submitted</SelectItem>
                    <SelectItem value="DOCKET_STATUS_CHANGED">Status Changed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            {sortedDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No activity logs found</p>
                <p className="text-sm">Activities will appear here as they occur</p>
              </div>
            ) : (
              sortedDates.map(date => (
                <div key={date} className="space-y-3">
                  {/* Date Header */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {formatDateHeader(date)}
                    </div>
                  </div>

                  {/* Timeline Items */}
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-4">
                      {groupedLogs[date].map((log, index) => (
                        <div key={log.id} className="relative flex items-start space-x-3">
                          {/* Timeline Dot */}
                          <div className="relative">
                            <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                              {getStatusIcon(log.status)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {auditLogService.formatTimestamp(log.timestamp)}
                                </span>
                                <span className={`text-sm ${getStatusColor(log.status)}`}>
                                  ✓
                                </span>
                              </div>
                            </div>
                            <div className="mt-1">
                              <span className="text-sm font-medium text-gray-900">{log.userName}</span>
                              <span className="text-sm text-gray-600 ml-1">{log.details}</span>
                            </div>
                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                              <div className="mt-1 text-xs text-gray-500">
                                {Object.entries(log.metadata).map(([key, value]) => (
                                  <span key={key} className="mr-3">
                                    {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};