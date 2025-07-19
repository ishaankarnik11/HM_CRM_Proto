import httpClient from './httpClient';
import { 
  Invoice, 
  Appointment, 
  DCBill, 
  Corporate, 
  PurchaseOrder, 
  DiagnosticCenter 
} from './api';

// API Client for real backend integration
export class APIClient {
  private static instance: APIClient;

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  // Invoice APIs
  async searchAppointments(params: {
    startDate: string;
    endDate: string;
    corporateId: string;
    serviceType?: string;
  }): Promise<Appointment[]> {
    const response = await httpClient.get('/api/appointments/search', { params });
    return response.data;
  }

  async createInvoice(invoiceData: {
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
  }): Promise<Invoice> {
    const response = await httpClient.post('/api/invoices', invoiceData);
    return response.data;
  }

  async getInvoices(filters?: {
    corporate?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    invoices: Invoice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = filters ? {
      ...filters,
      page: filters.page?.toString(),
      limit: filters.limit?.toString()
    } : {};
    
    const response = await httpClient.get('/api/invoices', { params });
    return response.data;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const response = await httpClient.get(`/api/invoices/${id}`);
    return response.data;
  }

  async updateInvoiceStatus(invoiceId: string, status: Invoice['status']): Promise<Invoice> {
    const response = await httpClient.patch(`/api/invoices/${invoiceId}/status`, { status });
    return response.data;
  }

  async deleteInvoice(invoiceId: string): Promise<void> {
    await httpClient.delete(`/api/invoices/${invoiceId}`);
  }

  // DC Bills APIs
  async searchDCAppointments(params: {
    diagnosticCenterId: string;
    location: string;
    startDate: string;
    endDate: string;
  }): Promise<Appointment[]> {
    const response = await httpClient.get('/api/appointments/dc-search', { params });
    return response.data;
  }

  async createDCBill(formData: FormData): Promise<DCBill> {
    const response = await httpClient.post('/api/dc-bills', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDCBills(filters?: {
    diagnosticCenter?: string;
    location?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    dcBills: DCBill[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = filters ? {
      ...filters,
      page: filters.page?.toString(),
      limit: filters.limit?.toString()
    } : {};
    
    const response = await httpClient.get('/api/dc-bills', { params });
    return response.data;
  }

  async getDCBillById(id: string): Promise<DCBill> {
    const response = await httpClient.get(`/api/dc-bills/${id}`);
    return response.data;
  }

  async updateDCBillStatus(billId: string, status: DCBill['status']): Promise<DCBill> {
    const response = await httpClient.patch(`/api/dc-bills/${billId}/status`, { status });
    return response.data;
  }

  async deleteDCBill(billId: string): Promise<void> {
    await httpClient.delete(`/api/dc-bills/${billId}`);
  }

  // Master Data APIs
  async getCorporates(): Promise<Corporate[]> {
    const response = await httpClient.get('/api/corporates');
    return response.data;
  }

  async getCorporateById(id: string): Promise<Corporate> {
    const response = await httpClient.get(`/api/corporates/${id}`);
    return response.data;
  }

  async getPurchaseOrders(corporateId: string): Promise<PurchaseOrder[]> {
    const response = await httpClient.get(`/api/corporates/${corporateId}/purchase-orders`);
    return response.data;
  }

  async getDiagnosticCenters(): Promise<DiagnosticCenter[]> {
    const response = await httpClient.get('/api/diagnostic-centers');
    return response.data;
  }

  async getDiagnosticCenterById(id: string): Promise<DiagnosticCenter> {
    const response = await httpClient.get(`/api/diagnostic-centers/${id}`);
    return response.data;
  }

  // Appointment APIs
  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await httpClient.get(`/api/appointments/${id}`);
    return response.data;
  }

  async createAppointment(appointmentData: {
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
  }): Promise<Appointment> {
    const response = await httpClient.post('/api/appointments', appointmentData);
    return response.data;
  }

  async updateAppointment(id: string, appointmentData: Partial<{
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
  }>): Promise<Appointment> {
    const response = await httpClient.patch(`/api/appointments/${id}`, appointmentData);
    return response.data;
  }

  async deleteAppointment(id: string): Promise<void> {
    await httpClient.delete(`/api/appointments/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await httpClient.get('/health');
    return response.data;
  }
}

// Export singleton instance
export const apiClient = APIClient.getInstance();