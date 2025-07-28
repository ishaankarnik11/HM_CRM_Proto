// Audit Logging Service for MyHealthMeter CRM Accounting Module

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entityType: 'INVOICE' | 'DC_BILL' | 'APPOINTMENT';
  entityId: string;
  entityName: string;
  details: string;
  metadata?: Record<string, any>;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  ipAddress?: string;
  userAgent?: string;
}

export type AuditAction = 
  // Invoice Actions
  | 'SEARCH_EXECUTED'
  | 'APPOINTMENT_SELECTED' 
  | 'APPOINTMENT_DESELECTED'
  | 'INVOICE_DRAFT_CREATED'
  | 'PROFORMA_VIEWED'
  | 'PO_SELECTED'
  | 'PDF_DOWNLOADED'
  | 'PDF_PRINTED'
  | 'INVOICE_SAVED'
  | 'INVOICE_DELETED'
  | 'INVOICE_EXPORTED'
  | 'INVOICE_ZOHO_REFERENCE_UPDATED'
  
  // DC Bill Actions
  | 'DOCKET_DRAFT_CREATED'
  | 'APPOINTMENT_MOVED'
  | 'BILL_FILE_UPLOADED'
  | 'AMOUNT_CONFIRMED'
  | 'DOCKET_SUBMITTED'
  | 'DOCKET_DELETED'
  | 'DOCKET_STATUS_CHANGED'
  | 'DOCKET_VIEWED'
  | 'DOCKET_EDITED'
  | 'DOCKET_EXPORTED'
  | 'COMMENTS_ADDED'
  | 'DOCKET_ZOHO_REFERENCE_UPDATED'
  
  // System Actions
  | 'SYSTEM_GENERATED'
  | 'BULK_OPERATION';

export interface AuditLogFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: AuditAction;
  entityType?: 'INVOICE' | 'DC_BILL' | 'APPOINTMENT';
  entityId?: string;
  status?: 'SUCCESS' | 'FAILED' | 'PENDING';
  searchQuery?: string;
}

class AuditLogService {
  private static instance: AuditLogService;
  private auditLogs: AuditLogEntry[] = [];
  private currentUser = { id: 'user-1', name: 'VISHAL' }; // TODO: Get from auth context

  static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      AuditLogService.instance = new AuditLogService();
    }
    return AuditLogService.instance;
  }

  constructor() {
    this.generateSampleAuditLogs();
  }

  private generateSampleAuditLogs() {
    const sampleLogs: Omit<AuditLogEntry, 'id' | 'timestamp'>[] = [];
    const users = ['VISHAL', 'RAJESH', 'PRIYA', 'AMIT', 'SNEHA'];
    const corporateNames = [
      'Tech Solutions India Pvt Ltd', 'Global Services Ltd', 'Manufacturing Co', 'Financial Services Inc',
      'Healthcare Systems Ltd', 'Digital Innovation Corp', 'Engineering Solutions', 'Pharma Industries',
      'Logistics Network Ltd', 'Energy Solutions Inc'
    ];
    
    const diagnosticCenters = [
      'HealthCare Labs Mumbai', 'Diagnostic Center Pune', 'MediScan Bangalore', 'PathLab Chennai',
      'LabCorp Hyderabad', 'Wellness Lab Delhi', 'Care Diagnostics Kolkata', 'Metro Lab Ahmedabad'
    ];

    // Generate comprehensive audit logs for invoices (inv-1 to inv-156)
    for (let i = 1; i <= 156; i++) {
      const invoiceId = `inv-${i}`;
      const invoiceNumber = `INV/2024/${i.toString().padStart(4, '0')}`;
      const corporate = corporateNames[i % corporateNames.length];
      const user = users[i % users.length];
      const amount = Math.floor(Math.random() * 50000) + 10000;
      const appointmentCount = Math.floor(Math.random() * 15) + 3;
      
      // Base timestamp - spread over last 30 days
      const baseTime = new Date().getTime() - (i * 8 * 60 * 60 * 1000); // 8 hours apart
      
      // Invoice creation workflow
      const invoiceActions: Omit<AuditLogEntry, 'id' | 'timestamp'>[] = [
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'SEARCH_EXECUTED',
          entityType: 'INVOICE',
          entityId: invoiceId,
          entityName: invoiceNumber,
          details: `Searched appointments for ${corporate} from 2024-06-01 to 2024-06-30`,
          status: 'SUCCESS',
          metadata: { corporate, startDate: '2024-06-01', endDate: '2024-06-30' }
        },
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'APPOINTMENT_SELECTED',
          entityType: 'INVOICE',
          entityId: invoiceId,
          entityName: invoiceNumber,
          details: `Selected ${appointmentCount} appointments for ${corporate}`,
          status: 'SUCCESS',
          metadata: { selectedCount: appointmentCount, corporate }
        },
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'PROFORMA_VIEWED',
          entityType: 'INVOICE',
          entityId: invoiceId,
          entityName: invoiceNumber,
          details: `Opened pro-forma invoice modal for ${corporate} with ${appointmentCount} appointments`,
          status: 'SUCCESS',
          metadata: { corporate, appointmentCount, totalAmount: amount }
        },
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'PO_SELECTED',
          entityType: 'INVOICE',
          entityId: invoiceId,
          entityName: invoiceNumber,
          details: `Selected PO-2024-${i.toString().padStart(3, '0')} (Balance: ₹${(amount * 2).toLocaleString()})`,
          status: 'SUCCESS',
          metadata: { poNumber: `PO-2024-${i.toString().padStart(3, '0')}`, balance: amount * 2, corporate }
        },
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'INVOICE_DRAFT_CREATED',
          entityType: 'INVOICE',
          entityId: invoiceId,
          entityName: invoiceNumber,
          details: `Created invoice for ${corporate} with ${appointmentCount} appointments (₹${amount.toLocaleString()})`,
          status: 'SUCCESS',
          metadata: { corporate, appointmentCount, totalAmount: amount, poNumber: `PO-2024-${i.toString().padStart(3, '0')}` }
        }
      ];

      // Add occasional additional actions
      if (i % 3 === 0) {
        invoiceActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'PDF_DOWNLOADED',
          entityType: 'INVOICE',
          entityId: invoiceId,
          entityName: invoiceNumber,
          details: `Downloaded pro-forma invoice PDF`,
          status: 'SUCCESS',
          metadata: { corporate, totalAmount: amount }
        });
      }

      if (i % 4 === 0) {
        invoiceActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'PDF_PRINTED',
          entityType: 'INVOICE',
          entityId: invoiceId,
          entityName: invoiceNumber,
          details: `Printed pro-forma invoice for ${corporate}`,
          status: 'SUCCESS',
          metadata: { corporate, totalAmount: amount }
        });
      }

      if (i % 5 === 0) {
        invoiceActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'INVOICE_EXPORTED',
          entityType: 'INVOICE',
          entityId: invoiceId,
          entityName: invoiceNumber,
          details: `Exported invoice to CSV`,
          status: 'SUCCESS',
          metadata: { corporate, exportCount: 1 }
        });
      }

      sampleLogs.push(...invoiceActions);
    }

    // Generate comprehensive audit logs for DC Bills (dcb-1 to dcb-89)
    for (let i = 1; i <= 89; i++) {
      const dcBillId = `dcb-${i}`;
      const dcBillNumber = `DCB/2024/${i.toString().padStart(4, '0')}`;
      const diagnosticCenter = diagnosticCenters[i % diagnosticCenters.length];
      const user = users[i % users.length];
      const amount = Math.floor(Math.random() * 35000) + 8000;
      const appointmentCount = Math.floor(Math.random() * 20) + 5;
      const location = diagnosticCenter.includes('Mumbai') ? 'Andheri' : 
                     diagnosticCenter.includes('Pune') ? 'Koregaon Park' :
                     diagnosticCenter.includes('Bangalore') ? 'Koramangala' : 'Main Branch';
      
      // Base timestamp - spread over last 30 days
      const baseTime = new Date().getTime() - (i * 10 * 60 * 60 * 1000); // 10 hours apart
      
      // DC Bill creation workflow
      const dcBillActions: Omit<AuditLogEntry, 'id' | 'timestamp'>[] = [
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'SEARCH_EXECUTED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Searched appointments for ${diagnosticCenter} at ${location} from 2024-06-01 to 2024-06-30`,
          status: 'SUCCESS',
          metadata: { diagnosticCenter, location, startDate: '2024-06-01', endDate: '2024-06-30' }
        },
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'APPOINTMENT_SELECTED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Selected ${appointmentCount} appointments for ${diagnosticCenter}`,
          status: 'SUCCESS',
          metadata: { selectedCount: appointmentCount, diagnosticCenter, location }
        },
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'BILL_FILE_UPLOADED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Uploaded file: DC_Bill_${i.toString().padStart(4, '0')}.pdf`,
          status: 'SUCCESS',
          metadata: { fileName: `DC_Bill_${i.toString().padStart(4, '0')}.pdf`, fileSize: Math.floor(Math.random() * 5000000) + 1000000, diagnosticCenter, location }
        },
        {
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'AMOUNT_CONFIRMED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Confirmed system total matches bill amount (₹${amount.toLocaleString()})`,
          status: 'SUCCESS',
          metadata: { amount, diagnosticCenter, location, appointmentCount }
        }
      ];

      // Add comments for some bills
      if (i % 3 === 0) {
        dcBillActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'COMMENTS_ADDED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Added comments: Processing bulk appointment batch for ${diagnosticCenter}`,
          status: 'SUCCESS',
          metadata: { commentLength: 45, diagnosticCenter, location }
        });
      }

      // Determine final status and add appropriate actions
      const statusChance = Math.random();
      if (statusChance < 0.7) {
        // Most bills are submitted
        dcBillActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'DOCKET_SUBMITTED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Submitted DC bill for ${diagnosticCenter} at ${location} (₹${amount.toLocaleString()})`,
          status: 'SUCCESS',
          metadata: { diagnosticCenter, location, appointmentCount, totalAmount: amount, status: 'SUBMITTED' }
        });
      } else if (statusChance < 0.9) {
        // Some bills remain as draft
        dcBillActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'DOCKET_DRAFT_CREATED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Created draft DC bill for ${diagnosticCenter} at ${location} (₹${amount.toLocaleString()})`,
          status: 'SUCCESS',
          metadata: { diagnosticCenter, location, appointmentCount, totalAmount: amount, status: 'DRAFT' }
        });
      } else {
        // Some bills are disputed
        dcBillActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'DOCKET_SUBMITTED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Submitted DC bill for ${diagnosticCenter} at ${location} (₹${amount.toLocaleString()})`,
          status: 'SUCCESS',
          metadata: { diagnosticCenter, location, appointmentCount, totalAmount: amount, status: 'SUBMITTED' }
        });
        
        dcBillActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'DOCKET_STATUS_CHANGED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Changed status from SUBMITTED to DISPUTED`,
          status: 'SUCCESS',
          metadata: { fromStatus: 'SUBMITTED', toStatus: 'DISPUTED', diagnosticCenter, location }
        });
      }

      // Add occasional additional actions
      if (i % 4 === 0) {
        dcBillActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'DOCKET_VIEWED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Viewed docket ${dcBillNumber} for ${diagnosticCenter}`,
          status: 'SUCCESS',
          metadata: { diagnosticCenter, location, status: 'SUBMITTED', amount }
        });
      }

      if (i % 6 === 0) {
        dcBillActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'PDF_DOWNLOADED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Downloaded docket ${dcBillNumber} PDF`,
          status: 'SUCCESS',
          metadata: { diagnosticCenter, location, totalAmount: amount }
        });
      }

      if (i % 7 === 0) {
        dcBillActions.push({
          userId: `user-${(i % users.length) + 1}`,
          userName: user,
          action: 'DOCKET_EXPORTED',
          entityType: 'DC_BILL',
          entityId: dcBillId,
          entityName: dcBillNumber,
          details: `Exported DC bill to CSV`,
          status: 'SUCCESS',
          metadata: { diagnosticCenter, exportCount: 1 }
        });
      }

      sampleLogs.push(...dcBillActions);
    }

    // Generate timestamps - spread logs over last 30 days with realistic intervals
    const now = new Date();
    this.auditLogs = sampleLogs.map((log, index) => ({
      id: `audit-${index + 1}`,
      timestamp: new Date(now.getTime() - (Math.floor(index / 5) * 3 * 60 * 60 * 1000) - (index % 5 * 30 * 60 * 1000)).toISOString(), // Group actions by entity with 30min intervals
      ...log
    }));
  }

  // Log a new audit entry
  logActivity(
    action: AuditAction,
    entityType: 'INVOICE' | 'DC_BILL' | 'APPOINTMENT',
    entityId: string,
    entityName: string,
    details: string,
    metadata?: Record<string, any>,
    status: 'SUCCESS' | 'FAILED' | 'PENDING' = 'SUCCESS'
  ): void {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      action,
      entityType,
      entityId,
      entityName,
      details,
      metadata,
      status,
      ipAddress: '192.168.1.1', // TODO: Get real IP
      userAgent: navigator.userAgent
    };

    this.auditLogs.unshift(entry); // Add to beginning for chronological order
  }

  // Get audit logs for a specific entity
  getAuditLogs(entityType: 'INVOICE' | 'DC_BILL', entityId: string): AuditLogEntry[] {
    return this.auditLogs.filter(log => 
      log.entityType === entityType && log.entityId === entityId
    );
  }

  // Get all audit logs with optional filtering
  getAllAuditLogs(filter?: AuditLogFilter): AuditLogEntry[] {
    let filtered = [...this.auditLogs];

    if (filter?.startDate) {
      filtered = filtered.filter(log => log.timestamp >= filter.startDate + 'T00:00:00.000Z');
    }

    if (filter?.endDate) {
      filtered = filtered.filter(log => log.timestamp <= filter.endDate + 'T23:59:59.999Z');
    }

    if (filter?.userId) {
      filtered = filtered.filter(log => log.userId === filter.userId);
    }

    if (filter?.action) {
      filtered = filtered.filter(log => log.action === filter.action);
    }

    if (filter?.entityType) {
      filtered = filtered.filter(log => log.entityType === filter.entityType);
    }

    if (filter?.entityId) {
      filtered = filtered.filter(log => log.entityId === filter.entityId);
    }

    if (filter?.status) {
      filtered = filtered.filter(log => log.status === filter.status);
    }

    if (filter?.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.details.toLowerCase().includes(query) ||
        log.entityName.toLowerCase().includes(query) ||
        log.userName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  // Group audit logs by date
  groupLogsByDate(logs: AuditLogEntry[]): Record<string, AuditLogEntry[]> {
    const grouped: Record<string, AuditLogEntry[]> = {};
    
    logs.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });

    return grouped;
  }

  // Get action display name
  getActionDisplayName(action: AuditAction): string {
    const actionMap: Record<AuditAction, string> = {
      // Invoice Actions
      'SEARCH_EXECUTED': 'Search Executed',
      'APPOINTMENT_SELECTED': 'Appointment Selected',
      'APPOINTMENT_DESELECTED': 'Appointment Deselected',
      'INVOICE_DRAFT_CREATED': 'Invoice Draft Created',
      'PROFORMA_VIEWED': 'Pro-forma Viewed',
      'PO_SELECTED': 'PO Selected',
      'PDF_DOWNLOADED': 'PDF Downloaded',
      'PDF_PRINTED': 'PDF Printed',
      'INVOICE_SAVED': 'Invoice Saved',
      'INVOICE_DELETED': 'Invoice Deleted',
      'INVOICE_EXPORTED': 'Invoice Exported',
      
      // DC Bill Actions
      'DOCKET_DRAFT_CREATED': 'Docket Draft Created',
      'APPOINTMENT_MOVED': 'Appointment Moved',
      'BILL_FILE_UPLOADED': 'Bill File Uploaded',
      'AMOUNT_CONFIRMED': 'Amount Confirmed',
      'DOCKET_SUBMITTED': 'Docket Submitted',
      'DOCKET_DELETED': 'Docket Deleted',
      'DOCKET_STATUS_CHANGED': 'Status Changed',
      'DOCKET_VIEWED': 'Docket Viewed',
      'DOCKET_EDITED': 'Docket Edited',
      'DOCKET_EXPORTED': 'Docket Exported',
      'COMMENTS_ADDED': 'Comments Added',
      
      // System Actions
      'SYSTEM_GENERATED': 'System Generated',
      'BULK_OPERATION': 'Bulk Operation'
    };

    return actionMap[action] || action;
  }

  // Format timestamp for display
  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Format date for display
  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}

export const auditLogService = AuditLogService.getInstance();
export type { AuditLogEntry, AuditAction, AuditLogFilter };