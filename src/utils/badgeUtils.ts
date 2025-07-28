// Badge utility functions for consistent status styling across the application
// Following MyHealthMeter CRM Status Streamlining PRD v1.0 - January 2025

export const getStatusBadgeClass = (status: string | null | undefined): string => {
  if (!status) return 'badge-default';
  
  const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '-');
  
  // Status mapping according to streamlined PRD requirements
  const statusMap: Record<string, string> = {
    // === APPOINTMENT STATUSES ===
    // Per PRD: Only "Medical Done" status with flag system
    'medical-done': 'badge-medical-done',
    'medical-complete': 'badge-medical-done',
    'completed': 'badge-medical-done',
    
    // === INVOICE STATUSES ===
    // Per PRD: Only 2 statuses - Submitted, Cancelled
    'submitted': 'badge-submitted',
    'cancelled': 'badge-cancelled',
    'canceled': 'badge-cancelled', // Alternative spelling
    
    // === DC BILL/DOCKET STATUSES ===
    // Per PRD: 5 statuses - Draft, Disputed, Approved, Cancelled, Paid
    'draft': 'badge-draft',
    'disputed': 'badge-disputed',
    'dispute-bill': 'badge-disputed',
    'approved': 'badge-approved',
    'paid': 'badge-paid',
    
    // === EMPLOYEE STATUSES ===
    'active': 'badge-active',
    'inactive': 'badge-inactive',
    'terminated': 'badge-terminated',
    
    // === BENEFIT & PASSCODE STATUSES ===
    'pending': 'badge-pending',
    'expired': 'badge-expired',
    'available': 'badge-available',
    'not-available': 'badge-not-available',
    'unavailable': 'badge-not-available',
    
    // === PACKAGE/SERVICE TYPES ===
    'ahc': 'badge-ahc',
    'pec': 'badge-pec',
    'opd': 'badge-opd',
    
    // === LEGACY STATUSES (to be deprecated) ===
    'sent': 'badge-sent',
    'overdue': 'badge-overdue',
    'rejected': 'badge-rejected',
    'processing': 'badge-processing',
    'scheduled': 'badge-scheduled',
    'rescheduled': 'badge-rescheduled',
  };
  
  return statusMap[normalizedStatus] || 'badge-default';
};

export const getEmployeeStatusBadgeClass = (status: string | null | undefined): string => {
  if (!status) return 'badge-default';
  
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active':
      return 'badge-active';
    case 'inactive':
      return 'badge-inactive';
    case 'terminated':
      return 'badge-terminated';
    default:
      return 'badge-default';
  }
};

export const getAHCBenefitStatusBadgeClass = (status: string | null | undefined): string => {
  if (!status) return 'badge-default';
  
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active':
      return 'badge-active';
    case 'inactive':
      return 'badge-inactive';
    default:
      return 'badge-default';
  }
};

export const getInvoiceStatusBadgeClass = (status: string | null | undefined): string => {
  if (!status) return 'badge-default';
  
  const normalizedStatus = status.toLowerCase();
  
  // Per PRD: Only 2 invoice statuses - Submitted, Cancelled
  switch (normalizedStatus) {
    case 'submitted':
      return 'badge-submitted';
    case 'cancelled':
    case 'canceled':
      return 'badge-cancelled';
    // Legacy statuses (should be migrated)
    case 'draft':
    case 'approved':
    case 'pending':
      return 'badge-submitted'; // Migrate to submitted
    case 'sent':
      return 'badge-sent'; // Legacy
    case 'paid':
      return 'badge-paid'; // Legacy
    case 'overdue':
      return 'badge-overdue'; // Legacy
    case 'rejected':
      return 'badge-rejected'; // Legacy
    default:
      return 'badge-default';
  }
};

export const getDCBillStatusBadgeClass = (status: string | null | undefined): string => {
  if (!status) return 'badge-default';
  
  const normalizedStatus = status.toLowerCase();
  
  // Per PRD: 5 DC Bill statuses - Draft, Disputed, Approved, Cancelled, Paid
  switch (normalizedStatus) {
    case 'draft':
      return 'badge-draft';
    case 'disputed':
    case 'dispute bill':
      return 'badge-disputed';
    case 'approved':
      return 'badge-approved';
    case 'cancelled':
    case 'canceled':
      return 'badge-cancelled';
    case 'paid':
      return 'badge-paid';
    // Legacy status mapping
    case 'submitted':
      return 'badge-approved'; // Migrate submitted -> approved
    case 'rejected':
      return 'badge-rejected'; // Legacy
    default:
      return 'badge-default';
  }
};

export const getPackageTypeBadgeClass = (packageType: string | null | undefined): string => {
  if (!packageType) return 'badge-default';
  
  const normalizedType = packageType.toLowerCase();
  
  switch (normalizedType) {
    case 'ahc':
      return 'badge-ahc';
    case 'pec':
      return 'badge-pec';
    case 'opd':
      return 'badge-opd';
    default:
      return 'badge-default';
  }
};

export const getPasscodeStatusBadgeClass = (status: string | null | undefined): string => {
  if (!status) return 'badge-default';
  
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active':
      return 'badge-active';
    case 'inactive':
      return 'badge-inactive';
    case 'pending':
      return 'badge-pending';
    case 'expired':
      return 'badge-expired';
    default:
      return 'badge-default';
  }
};

// Generic status badge component props
export interface StatusBadgeProps {
  status: string | null | undefined;
  className?: string;
}