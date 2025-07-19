// React hooks for Accounting API integration using TanStack Query with mock data
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Invoice, DCBill, Appointment } from '../services/api';
import { mockDataService } from '../services/mockData';

// Invoice Hooks
export const useSearchAppointments = (params: {
  startDate: string;
  endDate: string;
  corporateId: string;
  serviceType?: string;
}) => {
  return useQuery({
    queryKey: ['appointments', 'search', params],
    queryFn: () => Promise.resolve(mockDataService.getAppointments(params)),
    enabled: !!(params.startDate && params.endDate && params.corporateId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invoiceData: {
      corporate: string;
      corporateId: string;
      selectedPO?: {
        id: string;
        number: string;
        balance: number;
      };
      appointmentIds: string[];
      subtotal: number;
      gstAmount: number;
      total: number;
      createdBy: string;
    }) => Promise.resolve(mockDataService.createInvoice(invoiceData)),
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
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => Promise.resolve(mockDataService.getInvoices(filters)),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useInvoiceById = (id: string) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => Promise.resolve(mockDataService.getInvoiceById(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ invoiceId, status }: { invoiceId: string; status: Invoice['status'] }) => 
      Promise.resolve({ success: true, invoiceId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invoiceId: string) => Promise.resolve({ success: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useCorporates = () => {
  return useQuery({
    queryKey: ['corporates'],
    queryFn: () => Promise.resolve(mockDataService.getCorporates()),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useDiagnosticCenters = () => {
  return useQuery({
    queryKey: ['diagnostic-centers'],
    queryFn: () => Promise.resolve([
      { id: 'dc-1', name: 'HealthCare Labs Mumbai', locations: ['Andheri', 'Bandra', 'Powai'] },
      { id: 'dc-2', name: 'Medical Center Pune', locations: ['Koregaon Park', 'Kothrud'] },
      { id: 'dc-3', name: 'Diagnostics Plus Bangalore', locations: ['Koramangala', 'Whitefield'] },
      { id: 'dc-4', name: 'City Health Chennai', locations: ['Anna Nagar', 'T.Nagar'] },
      { id: 'dc-5', name: 'Prime Diagnostics Hyderabad', locations: ['Banjara Hills', 'Madhapur'] },
      { id: 'dc-6', name: 'Advanced Medical Delhi', locations: ['Connaught Place', 'Karol Bagh'] },
      { id: 'dc-7', name: 'Wellness Labs Kolkata', locations: ['Salt Lake', 'Park Street'] },
      { id: 'dc-8', name: 'Life Sciences Ahmedabad', locations: ['Navrangpura', 'Satellite'] }
    ]),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: 1000,
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
    queryKey: ['dc-appointments', 'search', params],
    queryFn: () => Promise.resolve(mockDataService.getAppointments({
      startDate: params.startDate,
      endDate: params.endDate
    }).filter(apt => apt.id.includes(params.diagnosticCenterId.split('-')[1] || '1')).map(apt => ({
      id: apt.id,
      appointmentId: apt.id,
      employeeName: apt.employeeName,
      corporate: apt.corporate,
      date: apt.appointmentDate,
      rate: apt.serviceRate,
      draftStatus: null
    }))),
    enabled: !!(params.diagnosticCenterId && params.location && params.startDate && params.endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useCreateDCBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => Promise.resolve({
      id: `dcb-${Date.now()}`,
      docketNumber: `DCB/2024/${Date.now().toString().slice(-4)}`,
      status: formData.get('status') || 'DRAFT',
      diagnosticCenter: 'Mock DC',
      location: formData.get('location') || 'Mock Location',
      period: `${formData.get('startDate')} - ${formData.get('endDate')}`,
      appointmentCount: JSON.parse(formData.get('appointmentIds') as string || '[]').length,
      totalAmount: parseFloat(formData.get('totalAmount') as string || '0'),
      createdDate: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dc-bills'] });
    },
  });
};

export const useDCBills = (filters?: {
  diagnosticCenter?: string;
  location?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['dc-bills', filters],
    queryFn: () => Promise.resolve(mockDataService.getDCBills(filters)),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useDCBillById = (id: string) => {
  return useQuery({
    queryKey: ['dc-bills', id],
    queryFn: () => Promise.resolve(mockDataService.getDCBillById(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

// Entity and Location Hooks
export const useEntities = (corporateId?: string) => {
  return useQuery({
    queryKey: ['entities', corporateId],
    queryFn: () => Promise.resolve(mockDataService.getEntities(corporateId)),
    enabled: !!corporateId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useLocations = (entityId?: string, corporateId?: string) => {
  return useQuery({
    queryKey: ['locations', entityId, corporateId],
    queryFn: () => Promise.resolve(mockDataService.getLocations(entityId, corporateId)),
    enabled: !!(entityId || corporateId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useApiError = () => {
  const handleError = (error: any) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  return { handleError };
};

export const useUpdateDCBillStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ billId, status }: { billId: string; status: DCBill['status'] }) => 
      Promise.resolve({ success: true, billId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dc-bills'] });
    },
  });
};

export const useDeleteDCBill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (billId: string) => Promise.resolve({ success: true, billId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dc-bills'] });
    },
  });
};

// Master Data Hooks - using mock data
export const useCorporateById = (id: string) => {
  return useQuery({
    queryKey: ['corporates', id],
    queryFn: () => Promise.resolve(mockDataService.getCorporates().find(corp => corp.id === id)),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useDiagnosticCenterById = (id: string) => {
  return useQuery({
    queryKey: ['diagnostic-centers', id],
    queryFn: () => Promise.resolve([
      { id: 'dc-1', name: 'HealthCare Labs Mumbai', locations: ['Andheri', 'Bandra', 'Powai'] },
      { id: 'dc-2', name: 'Medical Center Pune', locations: ['Koregaon Park', 'Kothrud'] },
      { id: 'dc-3', name: 'Diagnostics Plus Bangalore', locations: ['Koramangala', 'Whitefield'] },
      { id: 'dc-4', name: 'City Health Chennai', locations: ['Anna Nagar', 'T.Nagar'] },
      { id: 'dc-5', name: 'Prime Diagnostics Hyderabad', locations: ['Banjara Hills', 'Madhapur'] },
      { id: 'dc-6', name: 'Advanced Medical Delhi', locations: ['Connaught Place', 'Karol Bagh'] },
      { id: 'dc-7', name: 'Wellness Labs Kolkata', locations: ['Salt Lake', 'Park Street'] },
      { id: 'dc-8', name: 'Life Sciences Ahmedabad', locations: ['Navrangpura', 'Satellite'] }
    ].find(dc => dc.id === id)),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const usePurchaseOrders = (corporateId: string) => {
  return useQuery({
    queryKey: ['purchase-orders', corporateId],
    queryFn: () => Promise.resolve([
      { id: 'po-1', number: `PO/2024/001`, balance: 150000, amount: 200000 },
      { id: 'po-2', number: `PO/2024/002`, balance: 75000, amount: 100000 },
      { id: 'po-3', number: `PO/2024/003`, balance: 250000, amount: 300000 }
    ]),
    enabled: !!corporateId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

// Appointment Hooks - using mock data
export const useAppointmentById = (id: string) => {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => Promise.resolve(mockDataService.getAppointments().find(apt => apt.id === id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointmentData: {
      employeeName: string;
      employeeId: string;
      corporateId: string;
      appointmentDate: string;
      serviceRate: number;
      packageType: 'AHC' | 'PEC' | 'OPD';
      serviceType: string;
      status?: 'Medical Done' | 'Pending' | 'Cancelled';
      age?: number;
      gender?: 'M' | 'F';
      diagnosticCenterId?: string;
    }) => Promise.resolve({ ...appointmentData, id: `apt-${Date.now()}` }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: Partial<{
        employeeName: string;
        employeeId: string;
        appointmentDate: string;
        serviceRate: number;
        packageType: 'AHC' | 'PEC' | 'OPD';
        serviceType: string;
        status: 'Medical Done' | 'Pending' | 'Cancelled';
        age: number;
        gender: 'M' | 'F';
        diagnosticCenterId: string;
      }>;
    }) => Promise.resolve({ success: true, id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => Promise.resolve({ success: true, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Health Check Hook - using mock data
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => Promise.resolve({ status: 'ok', timestamp: new Date().toISOString() }),
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000,
  });
};