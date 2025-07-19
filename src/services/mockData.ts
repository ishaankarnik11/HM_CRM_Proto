// Mock data service for production-like demo
interface MockAppointment {
  id: string;
  employeeName: string;
  employeeId: string;
  corporate: string;
  corporateId: string;
  appointmentDate: string;
  serviceRate: number;
  packageType: 'AHC' | 'PEC' | 'OPD';
  serviceType: string;
  status: string;
  age?: number;
  gender?: 'M' | 'F';
}

interface MockInvoice {
  id: string;
  invoiceNumber: string;
  corporate: string;
  corporateId: string;
  selectedPO?: {
    id: string;
    number: string;
    balance: number;
  };
  createdDate: string;
  appointments: MockAppointment[];
  subtotal: number;
  gstAmount: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  createdBy: string;
}

interface MockDCBill {
  id: string;
  dcBillNumber: string;
  diagnosticCenter: string;
  diagnosticCenterId: string;
  billDate: string;
  billAmount: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'DISPUTED';
  uploadedBy: string;
  uploadDate: string;
  fileName: string;
  fileSize: number;
  appointmentCount: number;
  serviceType: 'AHC' | 'PEC' | 'OPD';
  appointments: MockAppointment[];
  remarks?: string;
}

interface MockEntity {
  id: string;
  name: string;
  corporateId: string;
  locations: MockLocation[];
}

interface MockLocation {
  id: string;
  name: string;
  address: string;
  entityId: string;
  corporateId: string;
}

interface MockCorporate {
  id: string;
  name: string;
  gstin: string;
  address: string;
  active: boolean;
  entities: MockEntity[];
}

class MockDataService {
  private static instance: MockDataService;
  private mockAppointments: MockAppointment[] = [];
  private mockInvoices: MockInvoice[] = [];
  private mockDCBills: MockDCBill[] = [];
  private mockCorporates: MockCorporate[] = [];
  private mockEntities: MockEntity[] = [];
  private mockLocations: MockLocation[] = [];

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  constructor() {
    this.generateMockData();
  }

  private generateMockData() {
    this.generateMockCorporates();
    this.generateMockEntities();
    this.generateMockLocations();
    this.generateMockAppointments();
    this.generateMockInvoices();
    this.generateMockDCBills();
  }

  private generateMockCorporates() {
    const corporateNames = [
      'Tech Solutions India Pvt Ltd', 'Global Services Ltd', 'Manufacturing Co', 'Financial Services Inc',
      'Healthcare Systems Ltd', 'Digital Innovation Corp', 'Engineering Solutions', 'Pharma Industries',
      'Logistics Network Ltd', 'Energy Solutions Inc', 'Construction Corp', 'Retail Chain Ltd',
      'Media House Pvt Ltd', 'Food Processing Inc', 'Textile Industries', 'Chemical Solutions',
      'Auto Components Ltd', 'Software Services', 'Banking Solutions', 'Insurance Group',
      'Real Estate Developers', 'Mining Corporation', 'Steel Industries', 'Cement Manufacturing',
      'Telecom Services Ltd', 'Aviation Corp', 'Shipping Lines', 'Railway Systems'
    ];

    const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Uttar Pradesh'];
    
    this.mockCorporates = corporateNames.map((name, index) => ({
      id: `corp-${index + 1}`,
      name,
      gstin: `${['27', '29', '33', '07', '24', '09'][index % 6]}AABCT${(1000 + index).toString()}M${index % 10}Z${(index % 9) + 1}`,
      address: `${name} Address, ${states[index % states.length]}`,
      active: index % 10 !== 0,
      entities: [] // Will be populated after entities are generated
    }));
  }

  private generateMockEntities() {
    const entityTypes = ['Head Office', 'Regional Office', 'Branch Office', 'Manufacturing Unit', 'Distribution Center'];
    
    this.mockCorporates.forEach(corporate => {
      const entityCount = Math.floor(Math.random() * 3) + 2; // 2-4 entities per corporate
      
      for (let i = 0; i < entityCount; i++) {
        const entityType = entityTypes[i % entityTypes.length];
        const entity: MockEntity = {
          id: `${corporate.id}-entity-${i + 1}`,
          name: `${corporate.name} - ${entityType}`,
          corporateId: corporate.id,
          locations: [] // Will be populated after locations are generated
        };
        
        this.mockEntities.push(entity);
        corporate.entities.push(entity);
      }
    });
  }

  private generateMockLocations() {
    const locationNames = [
      'Andheri', 'Bandra', 'Koregaon Park', 'Hinjewadi', 'Koramangala', 'Whitefield',
      'Anna Nagar', 'T.Nagar', 'Banjara Hills', 'Jubilee Hills', 'Connaught Place', 'Gurgaon',
      'Salt Lake', 'Park Street', 'Navrangpura', 'Satellite', 'Gomti Nagar', 'Hazratganj',
      'Civil Lines', 'Malviya Nagar', 'Marine Drive', 'Nariman Point', 'Powai', 'Thane West'
    ];
    
    this.mockEntities.forEach(entity => {
      const locationCount = Math.floor(Math.random() * 3) + 1; // 1-3 locations per entity
      
      for (let i = 0; i < locationCount; i++) {
        const locationName = locationNames[Math.floor(Math.random() * locationNames.length)];
        const location: MockLocation = {
          id: `${entity.id}-loc-${i + 1}`,
          name: `${locationName} Office`,
          address: `${locationName} Address, ${locationName}`,
          entityId: entity.id,
          corporateId: entity.corporateId
        };
        
        this.mockLocations.push(location);
        entity.locations.push(location);
      }
    });
  }

  private generateMockAppointments() {
    const employeeNames = [
      'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Joshi', 'Vikram Singh', 'Deepika Reddy',
      'Suresh Babu', 'Anita Gupta', 'Rohit Agarwal', 'Kavita Nair', 'Manish Verma', 'Sneha Rao',
      'Arjun Malhotra', 'Pooja Mehta', 'Sanjay Yadav', 'Ritu Sinha', 'Nitin Sharma', 'Meera Iyer',
      'Karan Chopra', 'Divya Jain', 'Arun Kumar', 'Lakshmi Priya', 'Vivek Gupta', 'Preeti Desai',
      'Ashok Tiwari', 'Neha Agarwal', 'Manoj Sharma', 'Anjali Reddy', 'Ravi Khurana', 'Poornima Rao'
    ];

    const packageTypes: ('AHC' | 'PEC' | 'OPD')[] = ['AHC', 'PEC', 'OPD'];
    const serviceTypes = ['Annual Health Checkup', 'Pre-Employment Checkup', 'General Consultation'];
    const rates = { AHC: [2500, 3000, 3500, 4000], PEC: [1800, 2000, 2200, 2400], OPD: [800, 1000, 1200] };

    for (let i = 1; i <= 300; i++) {
      const packageType = packageTypes[i % packageTypes.length];
      const corporate = this.mockCorporates[i % this.mockCorporates.length];
      const employeeName = employeeNames[i % employeeNames.length];
      
      // Generate dates in the last 6 months
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() - Math.floor(Math.random() * 180));

      this.mockAppointments.push({
        id: `apt-${i}`,
        employeeName,
        employeeId: `EMP${i.toString().padStart(4, '0')}`,
        corporate: corporate.name,
        corporateId: corporate.id,
        appointmentDate: appointmentDate.toISOString().split('T')[0],
        serviceRate: rates[packageType][Math.floor(Math.random() * rates[packageType].length)],
        packageType,
        serviceType: serviceTypes[packageTypes.indexOf(packageType)],
        status: 'Medical Done',
        age: Math.floor(Math.random() * 40) + 25,
        gender: Math.random() > 0.5 ? 'M' : 'F'
      });
    }
  }

  private generateMockInvoices() {
    const statuses: ('DRAFT' | 'SENT' | 'PAID' | 'OVERDUE')[] = ['DRAFT', 'SENT', 'PAID', 'OVERDUE'];
    const packageTypes: ('AHC' | 'PEC' | 'OPD')[] = ['AHC', 'PEC', 'OPD'];
    
    for (let i = 1; i <= 156; i++) {
      const corporate = this.mockCorporates[i % this.mockCorporates.length];
      const appointmentCount = Math.floor(Math.random() * 10) + 3; // 3-12 appointments per invoice
      
      // Select a single package type for this invoice
      const invoicePackageType = packageTypes[i % packageTypes.length];
      
      // Filter appointments by corporate and package type
      const eligibleAppointments = this.mockAppointments.filter(apt => 
        apt.corporateId === corporate.id && 
        apt.packageType === invoicePackageType &&
        apt.status === 'Medical Done'
      );
      
      // If not enough appointments, create them from the existing pool but ensure same service type
      const invoiceAppointments: MockAppointment[] = [];
      for (let j = 0; j < appointmentCount && j < eligibleAppointments.length; j++) {
        invoiceAppointments.push(eligibleAppointments[j]);
      }
      
      // If we need more appointments, duplicate some with different IDs
      if (invoiceAppointments.length < appointmentCount) {
        const baseAppointments = eligibleAppointments.length > 0 ? eligibleAppointments : 
          this.mockAppointments.filter(apt => apt.packageType === invoicePackageType);
        
        for (let j = invoiceAppointments.length; j < appointmentCount && baseAppointments.length > 0; j++) {
          const baseApt = baseAppointments[j % baseAppointments.length];
          invoiceAppointments.push({
            ...baseApt,
            id: `inv-apt-${i}-${j}`,
            corporateId: corporate.id,
            corporate: corporate.name
          });
        }
      }

      const subtotal = invoiceAppointments.reduce((sum, apt) => sum + apt.serviceRate, 0);
      const gstAmount = subtotal * 0.18;
      const total = subtotal + gstAmount;

      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));

      this.mockInvoices.push({
        id: `inv-${i}`,
        invoiceNumber: `INV/2024/${i.toString().padStart(4, '0')}`,
        corporate: corporate.name,
        corporateId: corporate.id,
        selectedPO: Math.random() > 0.3 ? {
          id: `po-${i}`,
          number: `PO/2024/${i.toString().padStart(3, '0')}`,
          balance: total + Math.floor(Math.random() * 50000)
        } : undefined,
        createdDate: createdDate.toISOString(),
        appointments: invoiceAppointments,
        subtotal,
        gstAmount,
        total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdBy: `User ${i % 5 + 1}`
      });
    }
  }

  private generateMockDCBills() {
    const diagnosticCenters = [
      'HealthCare Labs Mumbai', 'Medical Center Pune', 'Diagnostics Plus Bangalore', 'City Health Chennai',
      'Prime Diagnostics Hyderabad', 'Advanced Medical Delhi', 'Wellness Labs Kolkata', 'Life Sciences Ahmedabad',
      'Metro Health Jaipur', 'Central Diagnostics Surat', 'Unity Medical Lucknow', 'Global Health Kanpur',
      'Precision Labs Nagpur', 'Supreme Diagnostics Indore', 'Alpha Medical Thane', 'Beta Healthcare Bhopal'
    ];

    const statuses: ('DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'DISPUTED')[] = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'DISPUTED'];
    const fileNames = ['DC_Bill_Invoice.pdf', 'Medical_Services_Bill.pdf', 'Healthcare_Invoice.pdf', 'Diagnostic_Bill.pdf'];
    const packageTypes: ('AHC' | 'PEC' | 'OPD')[] = ['AHC', 'PEC', 'OPD'];
    const rates = { AHC: [2500, 3000, 3500, 4000], PEC: [1800, 2000, 2200, 2400], OPD: [800, 1000, 1200] };

    for (let i = 1; i <= 89; i++) {
      const dc = diagnosticCenters[i % diagnosticCenters.length];
      const billDate = new Date();
      billDate.setDate(billDate.getDate() - Math.floor(Math.random() * 120));

      const uploadDate = new Date(billDate);
      uploadDate.setDate(uploadDate.getDate() + Math.floor(Math.random() * 7));

      // Assign a single service type to each DC bill
      const serviceType = packageTypes[i % packageTypes.length];
      const appointmentCount = Math.floor(Math.random() * 20) + 5;
      
      // Generate actual appointments for this DC bill
      const dcAppointments: MockAppointment[] = [];
      const eligibleAppointments = this.mockAppointments.filter(apt => apt.packageType === serviceType);
      
      for (let j = 0; j < appointmentCount; j++) {
        const baseApt = eligibleAppointments[j % eligibleAppointments.length];
        dcAppointments.push({
          ...baseApt,
          id: `dcb-apt-${i}-${j + 1}`,
          appointmentDate: billDate.toISOString().split('T')[0],
          employeeName: `Employee ${i}-${j + 1}`,
          employeeId: `EMP${i}${j.toString().padStart(2, '0')}`,
          corporate: `Corporate ${i % 10 + 1}`,
          corporateId: `corp-${i % 10 + 1}`
        });
      }
      
      // Calculate bill amount based on actual appointments
      const billAmount = dcAppointments.reduce((sum, apt) => sum + apt.serviceRate, 0);

      this.mockDCBills.push({
        id: `dcb-${i}`,
        dcBillNumber: `DCB/2024/${i.toString().padStart(4, '0')}`,
        diagnosticCenter: dc,
        diagnosticCenterId: `dc-${i % diagnosticCenters.length + 1}`,
        billDate: billDate.toISOString().split('T')[0],
        billAmount,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        uploadedBy: `DC Admin ${i % 3 + 1}`,
        uploadDate: uploadDate.toISOString(),
        fileName: fileNames[i % fileNames.length],
        fileSize: Math.floor(Math.random() * 1000000) + 100000,
        appointmentCount,
        serviceType,
        appointments: dcAppointments,
        remarks: i % 4 === 0 ? 'Pending verification' : undefined
      });
    }
  }

  // Public methods for data access
  getAppointments(filters?: {
    startDate?: string;
    endDate?: string;
    corporateId?: string;
    serviceType?: string;
  }): MockAppointment[] {
    let filtered = [...this.mockAppointments];

    if (filters?.startDate) {
      filtered = filtered.filter(apt => apt.appointmentDate >= filters.startDate!);
    }
    if (filters?.endDate) {
      filtered = filtered.filter(apt => apt.appointmentDate <= filters.endDate!);
    }
    if (filters?.corporateId) {
      filtered = filtered.filter(apt => apt.corporateId === filters.corporateId);
    }
    if (filters?.serviceType) {
      filtered = filtered.filter(apt => apt.packageType === filters.serviceType);
    }

    return filtered;
  }

  getInvoices(filters?: {
    corporate?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): { invoices: MockInvoice[] } {
    let filtered = [...this.mockInvoices];

    if (filters?.corporate) {
      filtered = filtered.filter(inv => 
        inv.corporate.toLowerCase().includes(filters.corporate!.toLowerCase())
      );
    }
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(inv => inv.status === filters.status);
    }
    if (filters?.startDate) {
      filtered = filtered.filter(inv => inv.createdDate >= filters.startDate! + 'T00:00:00.000Z');
    }
    if (filters?.endDate) {
      filtered = filtered.filter(inv => inv.createdDate <= filters.endDate! + 'T23:59:59.999Z');
    }

    const invoices = filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    
    return { invoices };
  }

  getDCBills(filters?: {
    diagnosticCenter?: string;
    location?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): { dcBills: any[] } {
    let filtered = [...this.mockDCBills];

    if (filters?.diagnosticCenter) {
      filtered = filtered.filter(bill => 
        bill.diagnosticCenter.toLowerCase().includes(filters.diagnosticCenter!.toLowerCase())
      );
    }
    if (filters?.location) {
      filtered = filtered.filter(bill => 
        bill.diagnosticCenter.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(bill => bill.status === filters.status);
    }
    if (filters?.startDate) {
      filtered = filtered.filter(bill => bill.billDate >= filters.startDate!);
    }
    if (filters?.endDate) {
      filtered = filtered.filter(bill => bill.billDate <= filters.endDate!);
    }

    const dcBills = filtered.sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime())
      .map(bill => ({
        id: bill.id,
        docketNumber: bill.dcBillNumber,
        status: bill.status,
        diagnosticCenter: bill.diagnosticCenter,
        location: bill.diagnosticCenter.includes('Mumbai') ? 'Andheri' : 
                 bill.diagnosticCenter.includes('Pune') ? 'Koregaon Park' :
                 bill.diagnosticCenter.includes('Bangalore') ? 'Koramangala' :
                 bill.diagnosticCenter.includes('Chennai') ? 'Anna Nagar' :
                 bill.diagnosticCenter.includes('Hyderabad') ? 'Banjara Hills' :
                 bill.diagnosticCenter.includes('Delhi') ? 'Connaught Place' :
                 bill.diagnosticCenter.includes('Kolkata') ? 'Salt Lake' : 'Navrangpura',
        period: `${bill.billDate} - ${bill.billDate}`,
        appointmentCount: bill.appointmentCount,
        totalAmount: bill.billAmount,
        createdDate: bill.uploadDate,
        serviceType: bill.serviceType,
        appointments: bill.appointments,
        fileName: bill.fileName,
        uploadedBy: bill.uploadedBy,
        uploadDate: bill.uploadDate,
        remarks: bill.remarks
      }));

    return { dcBills };
  }

  getCorporates(): MockCorporate[] {
    return this.mockCorporates;
  }

  getEntities(corporateId?: string): MockEntity[] {
    if (corporateId) {
      return this.mockEntities.filter(entity => entity.corporateId === corporateId);
    }
    return this.mockEntities;
  }

  getLocations(entityId?: string, corporateId?: string): MockLocation[] {
    if (entityId) {
      return this.mockLocations.filter(location => location.entityId === entityId);
    }
    if (corporateId) {
      return this.mockLocations.filter(location => location.corporateId === corporateId);
    }
    return this.mockLocations;
  }

  getInvoiceById(id: string): MockInvoice | undefined {
    return this.mockInvoices.find(inv => inv.id === id);
  }

  getDCBillById(id: string): MockDCBill | undefined {
    return this.mockDCBills.find(bill => bill.id === id);
  }

  createInvoice(invoiceData: {
    corporate: string;
    corporateId: string;
    selectedPO?: { id: string; number: string; balance: number };
    appointmentIds: string[];
    subtotal: number;
    gstAmount: number;
    total: number;
    createdBy: string;
  }): MockInvoice {
    const newInvoice: MockInvoice = {
      id: `inv-${this.mockInvoices.length + 1}`,
      invoiceNumber: `INV/2024/${(this.mockInvoices.length + 1).toString().padStart(4, '0')}`,
      corporate: invoiceData.corporate,
      corporateId: invoiceData.corporateId,
      selectedPO: invoiceData.selectedPO,
      createdDate: new Date().toISOString(),
      appointments: invoiceData.appointmentIds.map(id => {
        const aptIndex = parseInt(id.split('-')[1]) - 1;
        return this.mockAppointments[aptIndex % this.mockAppointments.length];
      }),
      subtotal: invoiceData.subtotal,
      gstAmount: invoiceData.gstAmount,
      total: invoiceData.total,
      status: 'DRAFT',
      createdBy: invoiceData.createdBy
    };

    this.mockInvoices.push(newInvoice);
    return newInvoice;
  }
}

export const mockDataService = MockDataService.getInstance();
export type { MockAppointment, MockInvoice, MockDCBill, MockCorporate, MockEntity, MockLocation };