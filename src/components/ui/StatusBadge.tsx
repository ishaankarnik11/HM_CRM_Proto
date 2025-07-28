import React from 'react';
import { 
  getStatusBadgeClass,
  getInvoiceStatusBadgeClass,
  getDCBillStatusBadgeClass,
  getEmployeeStatusBadgeClass,
  getAHCBenefitStatusBadgeClass,
  getPackageTypeBadgeClass,
  getPasscodeStatusBadgeClass
} from '../../utils/badgeUtils';

interface StatusBadgeProps {
  status: string | null | undefined;
  type?: 'general' | 'invoice' | 'dcbill' | 'employee' | 'ahc-benefit' | 'package' | 'passcode';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = 'general', 
  className = '' 
}) => {
  if (!status) {
    return <span className={`badge-default ${className}`}>-</span>;
  }

  let badgeClass: string;
  
  switch (type) {
    case 'invoice':
      badgeClass = getInvoiceStatusBadgeClass(status);
      break;
    case 'dcbill':
      badgeClass = getDCBillStatusBadgeClass(status);
      break;
    case 'employee':
      badgeClass = getEmployeeStatusBadgeClass(status);
      break;
    case 'ahc-benefit':
      badgeClass = getAHCBenefitStatusBadgeClass(status);
      break;
    case 'package':
      badgeClass = getPackageTypeBadgeClass(status);
      break;
    case 'passcode':
      badgeClass = getPasscodeStatusBadgeClass(status);
      break;
    default:
      badgeClass = getStatusBadgeClass(status);
      break;
  }

  return (
    <span className={`${badgeClass} ${className}`}>
      {status}
    </span>
  );
};

// Specific badge components for common use cases
export const InvoiceStatusBadge: React.FC<{ status: string | null | undefined; className?: string }> = ({ status, className }) => (
  <StatusBadge status={status} type="invoice" className={className} />
);

export const DCBillStatusBadge: React.FC<{ status: string | null | undefined; className?: string }> = ({ status, className }) => (
  <StatusBadge status={status} type="dcbill" className={className} />
);

export const EmployeeStatusBadge: React.FC<{ status: string | null | undefined; className?: string }> = ({ status, className }) => (
  <StatusBadge status={status} type="employee" className={className} />
);

export const AHCBenefitStatusBadge: React.FC<{ status: string | null | undefined; className?: string }> = ({ status, className }) => (
  <StatusBadge status={status} type="ahc-benefit" className={className} />
);

export const PackageTypeBadge: React.FC<{ packageType: string | null | undefined; className?: string }> = ({ packageType, className }) => (
  <StatusBadge status={packageType} type="package" className={className} />
);

export const PasscodeStatusBadge: React.FC<{ status: string | null | undefined; className?: string }> = ({ status, className }) => (
  <StatusBadge status={status} type="passcode" className={className} />
);

export default StatusBadge;