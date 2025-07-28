// API Service Layer for MyHealthMeter CRM Accounting Module
// This provides mock implementations that can be easily replaced with real API calls

export interface Invoice {
  id: string;
  invoiceNumber: string;
  corporate: string;
  corporateId: string;
  selectedPO?: {
    id: string;
    number: string;
    balance: number;
  };
  appointments: Appointment[];
  subtotal: number;
  gstAmount: number;
  total: number;
  createdDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  createdBy: string;
  zohoReference?: string;
}

export interface Appointment {
  id: string;
  employeeName: string;
  employeeId: string;
  corporate: string;
  corporateId: string;
  appointmentDate: string;
  serviceRate: number;
  packageType: 'AHC' | 'PEC' | 'OPD';
  serviceType: string;
  status: 'Medical Done' | 'Pending' | 'Cancelled';
  age?: number;
  gender?: 'M' | 'F';
}

export interface DCBill {
  id: string;
  docketNumber: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  diagnosticCenter: string;
  location: string;
  period: string;
  appointmentIds: string[];
  count: number;
  amount: number;
  createdDate: string;
  submittedDate?: string;
  billFile?: {
    name: string;
    url: string;
    size: number;
  };
  zohoReference?: string;
}

export interface Corporate {
  id: string;
  name: string;
  active: boolean;
  address: string;
  gstin: string;
  purchaseOrders: PurchaseOrder[];
}

export interface PurchaseOrder {
  id: string;
  number: string;
  balance: number;
  total: number;
  validUntil: string;
}

export interface DiagnosticCenter {
  id: string;
  name: string;
  locations: string[];
  active: boolean;
}

// Mock data - replace with actual API calls
const mockCorporates: Corporate[] = [
  {
    id: '1',
    name: 'TechCorp India',
    active: true,
    address: 'Tech Park, Bangalore - 560001',
    gstin: '29ABCDE1234F1Z5',
    purchaseOrders: [
      { id: '1', number: 'PO-2024-001', balance: 50000, total: 100000, validUntil: '2024-12-31' },
      { id: '2', number: 'PO-2024-002', balance: 75000, total: 150000, validUntil: '2024-12-31' }
    ]
  },
  {
    id: '2',
    name: 'HealthPlus Solutions',
    active: true,
    address: 'Health Tower, Mumbai - 400001',
    gstin: '27FGHIJ5678K2L6',
    purchaseOrders: [
      { id: '3', number: 'PO-2024-003', balance: 100000, total: 200000, validUntil: '2024-12-31' }
    ]
  }
];

const mockDiagnosticCenters: DiagnosticCenter[] = [
  {
    id: '1',
    name: 'Apollo Diagnostics',
    locations: ['Mumbai Central', 'Andheri', 'Bandra'],
    active: true
  },
  {
    id: '2',
    name: 'SRL Diagnostics',
    locations: ['Worli', 'Lower Parel', 'Powai'],
    active: true
  }
];

// API Service Class
export class AccountingAPIService {
  private static instance: AccountingAPIService;
  private invoices: Invoice[] = [];
  private dcBills: DCBill[] = [];

  static getInstance(): AccountingAPIService {
    if (!AccountingAPIService.instance) {
      AccountingAPIService.instance = new AccountingAPIService();
    }
    return AccountingAPIService.instance;
  }

  // Invoice APIs
  async searchAppointments(params: {
    startDate: string;
    endDate: string;
    corporateId: string;
    serviceType?: string;
  }): Promise<Appointment[]> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    return [
      {
        id: '1',
        employeeName: 'Meghna Padwal',
        employeeId: 'EMP001',
        corporate: 'TechCorp India',
        corporateId: '1',
        appointmentDate: '2024-07-12',
        serviceRate: 1500,
        packageType: 'AHC',
        serviceType: 'Annual Health Checkup',
        status: 'Medical Done',
        age: 28,
        gender: 'F'
      },
      {
        id: '2',
        employeeName: 'Nikita Rawat',
        employeeId: 'EMP002',
        corporate: 'TechCorp India',
        corporateId: '1',
        appointmentDate: '2024-07-13',
        serviceRate: 1200,
        packageType: 'PEC',
        serviceType: 'Pre-Employment Checkup',
        status: 'Medical Done',
        age: 25,
        gender: 'F'
      }
    ];
  }

  async createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      corporate: invoiceData.corporate || '',
      corporateId: invoiceData.corporateId || '',
      selectedPO: invoiceData.selectedPO,
      appointments: invoiceData.appointments || [],
      subtotal: invoiceData.subtotal || 0,
      gstAmount: invoiceData.gstAmount || 0,
      total: invoiceData.total || 0,
      createdDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      createdBy: 'current-user'
    };

    this.invoices.push(newInvoice);
    return newInvoice;
  }

  async getInvoices(filters?: {
    corporate?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filteredInvoices = [...this.invoices];

    if (filters?.corporate) {
      filteredInvoices = filteredInvoices.filter(inv => 
        inv.corporate.toLowerCase().includes(filters.corporate!.toLowerCase())
      );
    }

    if (filters?.status) {
      filteredInvoices = filteredInvoices.filter(inv => inv.status === filters.status);
    }

    if (filters?.startDate) {
      filteredInvoices = filteredInvoices.filter(inv => 
        new Date(inv.createdDate) >= new Date(filters.startDate!)
      );
    }

    if (filters?.endDate) {
      filteredInvoices = filteredInvoices.filter(inv => 
        new Date(inv.createdDate) <= new Date(filters.endDate!)
      );
    }

    return filteredInvoices;
  }

  async updateInvoiceStatus(invoiceId: string, status: Invoice['status']): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const invoice = this.invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    invoice.status = status;
    return invoice;
  }

  // DC Bills APIs
  async searchDCAppointments(params: {
    diagnosticCenterId: string;
    location: string;
    startDate: string;
    endDate: string;
  }): Promise<Appointment[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '3',
        employeeName: 'Rajesh Kumar',
        employeeId: 'EMP003',
        corporate: 'TechCorp India',
        corporateId: '1',
        appointmentDate: '2024-07-15',
        serviceRate: 1500,
        packageType: 'AHC',
        serviceType: 'Annual Health Checkup',
        status: 'Medical Done'
      }
    ];
  }

  async createDCBill(billData: {
    diagnosticCenter: string;
    location: string;
    appointmentIds: string[];
    billFile?: File;
  }): Promise<DCBill> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newBill: DCBill = {
      id: Date.now().toString(),
      docketNumber: `DCK-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      status: 'DRAFT',
      diagnosticCenter: billData.diagnosticCenter,
      location: billData.location,
      period: `${new Date().toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
      appointmentIds: billData.appointmentIds,
      count: billData.appointmentIds.length,
      amount: billData.appointmentIds.length * 1500, // Mock calculation
      createdDate: new Date().toISOString(),
      billFile: billData.billFile ? {
        name: billData.billFile.name,
        url: URL.createObjectURL(billData.billFile),
        size: billData.billFile.size
      } : undefined
    };

    this.dcBills.push(newBill);
    return newBill;
  }

  async getDCBills(filters?: {
    diagnosticCenter?: string;
    location?: string;
    status?: string;
  }): Promise<DCBill[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filteredBills = [...this.dcBills];

    if (filters?.diagnosticCenter) {
      filteredBills = filteredBills.filter(bill => 
        bill.diagnosticCenter.toLowerCase().includes(filters.diagnosticCenter!.toLowerCase())
      );
    }

    if (filters?.location) {
      filteredBills = filteredBills.filter(bill => bill.location === filters.location);
    }

    if (filters?.status) {
      filteredBills = filteredBills.filter(bill => bill.status === filters.status);
    }

    return filteredBills;
  }

  async updateDCBillStatus(billId: string, status: DCBill['status']): Promise<DCBill> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const bill = this.dcBills.find(b => b.id === billId);
    if (!bill) {
      throw new Error('DC Bill not found');
    }

    bill.status = status;
    if (status === 'SUBMITTED') {
      bill.submittedDate = new Date().toISOString();
    }
    return bill;
  }

  // Master Data APIs
  async getCorporates(): Promise<Corporate[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCorporates;
  }

  async getDiagnosticCenters(): Promise<DiagnosticCenter[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockDiagnosticCenters;
  }

  async getPurchaseOrders(corporateId: string): Promise<PurchaseOrder[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const corporate = mockCorporates.find(c => c.id === corporateId);
    return corporate?.purchaseOrders || [];
  }
}

// Export singleton instance
export const accountingAPI = AccountingAPIService.getInstance();