// React hooks for Accounting API integration using TanStack Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountingAPI, Invoice, DCBill, Appointment } from '../services/api';

// Invoice Hooks
export const useSearchAppointments = (params: {
  startDate: string;
  endDate: string;
  corporateId: string;
  serviceType?: string;
}) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => accountingAPI.searchAppointments(params),
    enabled: !!(params.startDate && params.endDate && params.corporateId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invoiceData: Partial<Invoice>) => accountingAPI.createInvoice(invoiceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useInvoices = (filters?: {
  corporate?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => accountingAPI.getInvoices(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ invoiceId, status }: { invoiceId: string; status: Invoice['status'] }) => 
      accountingAPI.updateInvoiceStatus(invoiceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

// DC Bills Hooks
export const useSearchDCAppointments = (params: {
  diagnosticCenterId: string;
  location: string;
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['dc-appointments', params],
    queryFn: () => accountingAPI.searchDCAppointments(params),
    enabled: !!(params.diagnosticCenterId && params.location && params.startDate && params.endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateDCBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (billData: {
      diagnosticCenter: string;
      location: string;
      appointmentIds: string[];
      billFile?: File;
    }) => accountingAPI.createDCBill(billData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dc-bills'] });
    },
  });
};

export const useDCBills = (filters?: {
  diagnosticCenter?: string;
  location?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['dc-bills', filters],
    queryFn: () => accountingAPI.getDCBills(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateDCBillStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ billId, status }: { billId: string; status: DCBill['status'] }) => 
      accountingAPI.updateDCBillStatus(billId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dc-bills'] });
    },
  });
};

// Master Data Hooks
export const useCorporates = () => {
  return useQuery({
    queryKey: ['corporates'],
    queryFn: () => accountingAPI.getCorporates(),
    staleTime: 30 * 60 * 1000, // 30 minutes - master data changes less frequently
  });
};

export const useDiagnosticCenters = () => {
  return useQuery({
    queryKey: ['diagnostic-centers'],
    queryFn: () => accountingAPI.getDiagnosticCenters(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const usePurchaseOrders = (corporateId: string) => {
  return useQuery({
    queryKey: ['purchase-orders', corporateId],
    queryFn: () => accountingAPI.getPurchaseOrders(corporateId),
    enabled: !!corporateId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Utility hook for handling API errors
export const useApiError = () => {
  const handleError = (error: any) => {
    console.error('API Error:', error);
    // You can integrate with a toast notification system here
    return error.message || 'An unexpected error occurred';
  };

  return { handleError };
};