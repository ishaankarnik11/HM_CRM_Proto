// Mock data service for production-like demo
import { auditLogService } from './auditLog';

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
  zohoReference?: string;
}

interface MockDCBill {
  id: string;
  dcBillNumber: string;
  diagnosticCenter: string;
  diagnosticCenterId: string;
  billDate: string;
  billAmount: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'REJECTED' | 'DISPUTED';
  uploadedBy: string;
  uploadDate: string;
  fileName: string;
  zohoReference?: string;
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

interface MockEmployee {
  emp_id: string;
  name: string;
  email: string;
  mobile: string;
  ahc_benefit_status: "Active" | "Inactive";
  benefit_source: string;
  next_ahc_date: string | null;
  last_ahc_date: string | null;
  designation: string;
  location: string;
  passcode_status: string;
  employee_status: "Active" | "Inactive" | "Terminated";
  corporateId: string;
}

interface MockEmployeeAppointment {
  appointment_id: string;
  is_dependent: boolean;
  dependent_name: string | null;
  designation_at_appointment: string;
  requested_date: string;
  appointment_date: string;
  medical_done_date: string;
  corporate_plan_details: string;
  additional_tests: { name: string; amount: number }[];
  center: { name: string; location: string };
  dc_rate: number;
  invoice: {
    number: string | null;
    status: "Draft" | "Submitted" | "Approved" | null;
    zoho_id: string | null;
  };
  dc_bill: {
    docket_id: string | null;
    status: "Draft" | "Submitted" | "Approved" | null;
    zoho_id: string | null;
  };
  employee_id: string;
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
  private mockEmployees: MockEmployee[] = [];
  private mockEmployeeAppointments: MockEmployeeAppointment[] = [];

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
    this.generateMockEmployees();
    this.generateMockEmployeeAppointments();
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
      'Ashok Tiwari', 'Neha Agarwal', 'Manoj Sharma', 'Anjali Reddy', 'Ravi Khurana', 'Poornima Rao',
      'Sachin Tendulkar', 'Madhuri Dixit', 'Shah Rukh Khan', 'Deepika Padukone', 'Aamir Khan',
      'Kareena Kapoor', 'Salman Khan', 'Aishwarya Rai', 'Hrithik Roshan', 'Katrina Kaif',
      'Akshay Kumar', 'Priyanka Chopra', 'Ranbir Kapoor', 'Alia Bhatt', 'Varun Dhawan',
      'Shraddha Kapoor', 'Tiger Shroff', 'Jacqueline Fernandez', 'John Abraham', 'Sonakshi Sinha',
      'Sidharth Malhotra', 'Kiara Advani', 'Kartik Aaryan', 'Sara Ali Khan', 'Janhvi Kapoor',
      'Ananya Panday', 'Tara Sutaria', 'Bhumi Pednekar', 'Rajkummar Rao', 'Ayushmann Khurrana'
    ];

    const packageTypes: ('AHC' | 'PEC' | 'OPD')[] = ['AHC', 'PEC', 'OPD'];
    const serviceTypes = ['Annual Health Checkup', 'Pre-Employment Checkup', 'General Consultation'];
    const rates = { AHC: [2500, 3000, 3500, 4000, 4500, 5000], PEC: [1500, 1800, 2000, 2200, 2400, 2800], OPD: [600, 800, 1000, 1200, 1400] };

    // Generate more appointments per corporate to ensure adequate test data
    for (let i = 1; i <= 1200; i++) {
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
    
    for (let i = 1; i <= 200; i++) {
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
        selectedPO: {
          id: `po-${corporate.id}-${i}`,
          number: `PO/2024/${corporate.id.toUpperCase()}-${i.toString().padStart(3, '0')}`,
          balance: total + Math.floor(Math.random() * 100000) + 50000
        },
        createdDate: createdDate.toISOString(),
        appointments: invoiceAppointments,
        subtotal,
        gstAmount,
        total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdBy: `User ${i % 5 + 1}`,
        zohoReference: i % 2 === 0 ? this.generateDemoZohoReference('INV', i) : undefined
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

    const statuses: ('DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'REJECTED' | 'DISPUTED')[] = ['DRAFT', 'SUBMITTED', 'APPROVED', 'PAID', 'REJECTED', 'DISPUTED'];
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
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      this.mockDCBills.push({
        id: `dcb-${i}`,
        dcBillNumber: `DCB/2024/${i.toString().padStart(4, '0')}`,
        diagnosticCenter: dc,
        diagnosticCenterId: `dc-${i % diagnosticCenters.length + 1}`,
        billDate: billDate.toISOString().split('T')[0],
        billAmount,
        status,
        uploadedBy: `DC Admin ${i % 3 + 1}`,
        uploadDate: uploadDate.toISOString(),
        fileName: fileNames[i % fileNames.length],
        fileSize: Math.floor(Math.random() * 1000000) + 100000,
        appointmentCount,
        serviceType,
        appointments: dcAppointments,
        remarks: i % 4 === 0 ? 'Pending verification' : undefined,
        zohoReference: ((status === 'SUBMITTED' || status === 'APPROVED' || status === 'PAID') && i % 2 === 0) 
                      ? this.generateDemoZohoReference('DCB', i) : undefined
      });
    }
  }

  // Zoho Reference validation and management
  validateZohoReferenceUniqueness(zohoReference: string, entityType: 'invoice' | 'dcbill', entityId: string): { isValid: boolean; conflictingEntity?: { type: 'Invoice' | 'DC Bill'; number: string } } {
    if (!zohoReference || zohoReference.trim() === '') {
      return { isValid: true };
    }

    const trimmedReference = zohoReference.trim();

    // Check invoices
    const conflictingInvoice = this.mockInvoices.find(invoice => 
      invoice.zohoReference === trimmedReference && invoice.id !== entityId
    );

    if (conflictingInvoice) {
      return {
        isValid: false,
        conflictingEntity: {
          type: 'Invoice',
          number: conflictingInvoice.invoiceNumber
        }
      };
    }

    // Check DC bills
    const conflictingDCBill = this.mockDCBills.find(dcBill => 
      dcBill.zohoReference === trimmedReference && dcBill.id !== entityId
    );

    if (conflictingDCBill) {
      return {
        isValid: false,
        conflictingEntity: {
          type: 'DC Bill',
          number: conflictingDCBill.dcBillNumber
        }
      };
    }

    return { isValid: true };
  }

  updateInvoiceZohoReference(invoiceId: string, zohoReference: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      // Add a small delay to simulate API call
      setTimeout(() => {
        const validation = this.validateZohoReferenceUniqueness(zohoReference, 'invoice', invoiceId);
        
        if (!validation.isValid) {
          resolve({
            success: false,
            error: `This Zoho reference number is already linked to ${validation.conflictingEntity?.type} ${validation.conflictingEntity?.number}`
          });
          return;
        }

        const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);
        if (invoice) {
          const oldReference = invoice.zohoReference;
          invoice.zohoReference = zohoReference.trim() || undefined;
          
          // Log activity
          auditLogService.logActivity(
            'INVOICE_ZOHO_REFERENCE_UPDATED',
            'INVOICE',
            invoice.id,
            invoice.invoiceNumber,
            oldReference 
              ? `Updated Zoho reference from "${oldReference}" to "${zohoReference.trim() || '(empty)'}"` 
              : `Added Zoho reference "${zohoReference.trim()}"`,
            {
              oldValue: oldReference || null,
              newValue: zohoReference.trim() || null,
              corporate: invoice.corporate
            }
          );
          
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Invoice not found' });
        }
      }, 500);
    });
  }

  updateDCBillZohoReference(dcBillId: string, zohoReference: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      // Add a small delay to simulate API call
      setTimeout(() => {
        const validation = this.validateZohoReferenceUniqueness(zohoReference, 'dcbill', dcBillId);
        
        if (!validation.isValid) {
          resolve({
            success: false,
            error: `This Zoho reference number is already linked to ${validation.conflictingEntity?.type} ${validation.conflictingEntity?.number}`
          });
          return;
        }

        const dcBill = this.mockDCBills.find(bill => bill.id === dcBillId);
        if (dcBill) {
          const oldReference = dcBill.zohoReference;
          dcBill.zohoReference = zohoReference.trim() || undefined;
          
          // Log activity
          auditLogService.logActivity(
            'DOCKET_ZOHO_REFERENCE_UPDATED',
            'DC_BILL',
            dcBill.id,
            dcBill.docketNumber,
            oldReference 
              ? `Updated Zoho reference from "${oldReference}" to "${zohoReference.trim() || '(empty)'}"` 
              : `Added Zoho reference "${zohoReference.trim()}"`,
            {
              oldValue: oldReference || null,
              newValue: zohoReference.trim() || null,
              diagnosticCenter: dcBill.diagnosticCenter,
              location: dcBill.location,
              status: dcBill.status
            }
          );
          
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'DC Bill not found' });
        }
      }, 500);
    });
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

  private generateMockEmployees() {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Kavya', 'Rohit', 'Anita', 'Suresh', 'Meera',
                       'Arjun', 'Deepika', 'Ravi', 'Nisha', 'Kiran', 'Pooja', 'Manoj', 'Shreya', 'Ajay', 'Shalini'];
    const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Agarwal', 'Jain', 'Yadav', 'Reddy'];
    const designations = ['Software Engineer', 'Manager', 'Senior Analyst', 'Team Lead', 'HR Executive', 'Accountant', 
                         'Sales Executive', 'Operations Manager', 'Quality Analyst', 'Business Analyst'];
    const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
    const benefitSources = ['Corporate Policy', 'Employee Benefit Scheme', 'Group Insurance', 'Health Card'];
    const passcodeStatuses = ['Active', 'Inactive', 'Pending', 'Expired'];

    this.mockCorporates.forEach(corporate => {
      const employeeCount = Math.floor(Math.random() * 150) + 50; // 50-200 employees per corporate
      
      for (let i = 0; i < employeeCount; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;
        
        const employee: MockEmployee = {
          emp_id: `${corporate.id.toUpperCase()}-EMP-${(i + 1).toString().padStart(4, '0')}`,
          name: fullName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${corporate.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          mobile: `+91 ${Math.floor(Math.random() * 900000000) + 100000000}`,
          ahc_benefit_status: Math.random() > 0.2 ? "Active" : "Inactive",
          benefit_source: benefitSources[Math.floor(Math.random() * benefitSources.length)],
          next_ahc_date: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
          last_ahc_date: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
          designation: designations[Math.floor(Math.random() * designations.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          passcode_status: passcodeStatuses[Math.floor(Math.random() * passcodeStatuses.length)],
          employee_status: Math.random() > 0.1 ? (Math.random() > 0.05 ? "Active" : "Inactive") : "Terminated",
          corporateId: corporate.id
        };
        
        this.mockEmployees.push(employee);
      }
    });
  }

  private generateMockEmployeeAppointments() {
    const centers = [
      { name: 'Apollo Diagnostics', location: 'Mumbai Central' },
      { name: 'Thyrocare', location: 'Andheri' },
      { name: 'SRL Diagnostics', location: 'Bandra' },
      { name: 'Dr. Lal Path Labs', location: 'Delhi' },
      { name: 'Metropolis Healthcare', location: 'Pune' },
      { name: 'Quest Diagnostics', location: 'Bangalore' }
    ];

    const corporatePlans = [
      'AHFL - Male below 35', 'AHFL - Female below 35', 'AHFL - Male 35-50', 'AHFL - Female 35-50',
      'Executive Health Package', 'Basic Health Checkup', 'Comprehensive Health Screen', 'Premium Health Package'
    ];

    const additionalTests = [
      { name: 'Vitamin D Test', amount: 800 },
      { name: 'Thyroid Profile', amount: 600 },
      { name: 'Lipid Profile', amount: 400 },
      { name: 'HbA1c Test', amount: 350 },
      { name: 'Liver Function Test', amount: 500 },
      { name: 'Kidney Function Test', amount: 450 }
    ];

    this.mockEmployees.forEach(employee => {
      // Generate 1-5 appointments per employee
      const appointmentCount = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < appointmentCount; i++) {
        const appointmentDate = new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000);
        const requestedDate = new Date(appointmentDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        const medicalDoneDate = new Date(appointmentDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
        
        const hasInvoice = Math.random() > 0.2; // Higher chance for demo
        const hasDCBill = Math.random() > 0.3; // Higher chance for demo
        const isDependent = Math.random() > 0.7;
        
        // Create more predictable Zoho IDs for better demo experience
        const year = appointmentDate.getFullYear();
        const month = (appointmentDate.getMonth() + 1).toString().padStart(2, '0');
        const empShort = employee.emp_id.slice(-3); // Last 3 chars of emp_id
        const seqNum = (i + 1).toString().padStart(2, '0');
        
        const appointment: MockEmployeeAppointment = {
          appointment_id: `APT-${employee.emp_id}-${(i + 1).toString().padStart(3, '0')}`,
          is_dependent: isDependent,
          dependent_name: isDependent ? `${employee.name} Child` : null,
          designation_at_appointment: employee.designation,
          requested_date: requestedDate.toISOString().split('T')[0],
          appointment_date: appointmentDate.toISOString().split('T')[0],
          medical_done_date: medicalDoneDate.toISOString().split('T')[0],
          corporate_plan_details: corporatePlans[Math.floor(Math.random() * corporatePlans.length)],
          additional_tests: Math.random() > 0.6 ? 
            [additionalTests[Math.floor(Math.random() * additionalTests.length)]] : [],
          center: centers[Math.floor(Math.random() * centers.length)],
          dc_rate: Math.floor(Math.random() * 3000) + 1500, // 1500-4500
          invoice: hasInvoice ? {
            number: `INV-${year}-${month}-${empShort}${seqNum}`,
            status: ['Draft', 'Submitted', 'Approved'][Math.floor(Math.random() * 3)] as any,
            zoho_id: `ZOHO-INV-${year}${month}-${empShort}${seqNum}-${Math.floor(Math.random() * 900) + 100}`
          } : { number: null, status: null, zoho_id: null },
          dc_bill: hasDCBill ? {
            docket_id: `DCB-${year}-${month}-${empShort}${seqNum}`,
            status: ['Draft', 'Submitted', 'Approved'][Math.floor(Math.random() * 3)] as any,
            zoho_id: `ZOHO-DCB-${year}${month}-${empShort}${seqNum}-${Math.floor(Math.random() * 900) + 100}`
          } : { docket_id: null, status: null, zoho_id: null },
          employee_id: employee.emp_id
        };
        
        this.mockEmployeeAppointments.push(appointment);
      }
    });
    
    // Add some specific demo-friendly Zoho IDs for easier showcasing
    this.addDemoZohoReferences();
  }

  private generateDemoZohoReference(type: 'INV' | 'DCB', index: number): string {
    const demoPatterns = [
      `ZOHO-${type}-DEMO-${index.toString().padStart(3, '0')}`,
      `ZOHO-${type}-SAMPLE-${index}`,
      `ZOHO-${type}-TEST-${index}`,
      `ZOHO-${type}-SHOWCASE-${index}`,
      `ZOHO-${type}-PILOT-${index}`
    ];
    
    // Only add 2024 pattern for every 10th item to reduce volume
    if (index % 10 === 0) {
      return `ZOHO-${type}-2024-${index.toString().padStart(4, '0')}`;
    }
    
    // Use different patterns based on index to create variety
    const patternIndex = index % demoPatterns.length;
    return demoPatterns[patternIndex];
  }

  private addDemoZohoReferences() {
    // Create some easy-to-search demo Zoho references
    const demoZohoIds = [
      'ZOHO-DEMO-001', 'ZOHO-DEMO-002', 'ZOHO-DEMO-003',
      'ZOHO-TEST-100', 'ZOHO-TEST-200', 'ZOHO-TEST-300',
      'ZOHO-SAMPLE-A1', 'ZOHO-SAMPLE-B2', 'ZOHO-SAMPLE-C3',
      'ZOHO-INV-2024-DEMO-001', 'ZOHO-DCB-2024-DEMO-002',
      'ZOHO-SHOWCASE-123', 'ZOHO-SHOWCASE-456', 'ZOHO-SHOWCASE-789'
    ];

    // Update some existing appointments with demo Zoho IDs
    const existingAppointments = this.mockEmployeeAppointments.filter(apt => 
      apt.invoice.zoho_id || apt.dc_bill.zoho_id
    );

    demoZohoIds.forEach((demoId, index) => {
      if (index < existingAppointments.length) {
        const appointment = existingAppointments[index];
        
        // Alternate between invoice and DC bill Zoho IDs
        if (index % 2 === 0 && appointment.invoice.zoho_id) {
          appointment.invoice.zoho_id = demoId;
        } else if (appointment.dc_bill.zoho_id) {
          appointment.dc_bill.zoho_id = demoId;
        }
      }
    });
  }

  getEmployees(corporateId: string, filters: any = {}, pagination: any = { page: 1, limit: 25 }) {
    let filteredEmployees = this.mockEmployees.filter(emp => emp.corporateId === corporateId);
    
    // Apply filters
    if (filters.employee_status && filters.employee_status.length > 0) {
      filteredEmployees = filteredEmployees.filter(emp => 
        filters.employee_status.includes(emp.employee_status)
      );
    }
    
    if (filters.ahc_benefit_status && filters.ahc_benefit_status.length > 0) {
      filteredEmployees = filteredEmployees.filter(emp => 
        filters.ahc_benefit_status.includes(emp.ahc_benefit_status)
      );
    }
    
    if (filters.location && filters.location.length > 0) {
      filteredEmployees = filteredEmployees.filter(emp => 
        filters.location.includes(emp.location)
      );
    }
    
    if (filters.designation && filters.designation.length > 0) {
      filteredEmployees = filteredEmployees.filter(emp => 
        filters.designation.includes(emp.designation)
      );
    }
    
    if (filters.search_text) {
      const searchText = filters.search_text.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.name.toLowerCase().includes(searchText) ||
        emp.email.toLowerCase().includes(searchText) ||
        emp.emp_id.toLowerCase().includes(searchText)
      );
    }

    if (filters.next_ahc_date_from) {
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.next_ahc_date && emp.next_ahc_date >= filters.next_ahc_date_from
      );
    }

    if (filters.next_ahc_date_to) {
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.next_ahc_date && emp.next_ahc_date <= filters.next_ahc_date_to
      );
    }

    if (filters.last_ahc_date_from) {
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.last_ahc_date && emp.last_ahc_date >= filters.last_ahc_date_from
      );
    }

    if (filters.last_ahc_date_to) {
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.last_ahc_date && emp.last_ahc_date <= filters.last_ahc_date_to
      );
    }
    
    const total = filteredEmployees.length;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pagination.limit);
    
    return {
      employees: paginatedEmployees,
      total_count: total,
      page: pagination.page,
      page_size: pagination.limit
    };
  }

  getEmployeeAppointments(employeeId: string, filters: any = {}) {
    let appointments = this.mockEmployeeAppointments.filter(apt => apt.employee_id === employeeId);
    
    // Apply filters
    if (filters.date_from) {
      appointments = appointments.filter(apt => apt.appointment_date >= filters.date_from);
    }
    
    if (filters.date_to) {
      appointments = appointments.filter(apt => apt.appointment_date <= filters.date_to);
    }
    
    if (filters.invoice_status && filters.invoice_status !== 'all') {
      if (filters.invoice_status === 'Not Created') {
        appointments = appointments.filter(apt => !apt.invoice.number);
      } else {
        appointments = appointments.filter(apt => apt.invoice.status === filters.invoice_status);
      }
    }
    
    if (filters.dc_bill_status && filters.dc_bill_status !== 'all') {
      if (filters.dc_bill_status === 'Not Created') {
        appointments = appointments.filter(apt => !apt.dc_bill.docket_id);
      } else {
        appointments = appointments.filter(apt => apt.dc_bill.status === filters.dc_bill_status);
      }
    }
    
    if (filters.appointment_type && filters.appointment_type !== 'all') {
      if (filters.appointment_type === 'self') {
        appointments = appointments.filter(apt => !apt.is_dependent);
      } else if (filters.appointment_type === 'dependent') {
        appointments = appointments.filter(apt => apt.is_dependent);
      }
    }
    
    if (filters.zoho_id_search) {
      const zohoSearch = filters.zoho_id_search.toLowerCase();
      appointments = appointments.filter(apt => 
        (apt.invoice.zoho_id && apt.invoice.zoho_id.toLowerCase().includes(zohoSearch)) ||
        (apt.dc_bill.zoho_id && apt.dc_bill.zoho_id.toLowerCase().includes(zohoSearch))
      );
    }
    
    return {
      appointments,
      total_count: appointments.length,
      total_amount: appointments.reduce((sum, apt) => sum + apt.dc_rate, 0)
    };
  }

  searchByZohoId(zohoId: string, limit: number = 50) {
    if (!zohoId || zohoId.trim().length < 2) {
      return []; // Require at least 2 characters to prevent massive results
    }
    
    const zohoSearch = zohoId.toLowerCase().trim();
    const uniqueEmployeeIds = new Set<string>();
    const results: any[] = [];
    
    // Limit the search to prevent hanging
    let matchCount = 0;
    const maxMatches = limit;
    
    for (const apt of this.mockEmployeeAppointments) {
      if (matchCount >= maxMatches) break;
      
      const hasInvoiceMatch = apt.invoice.zoho_id && 
        apt.invoice.zoho_id.toLowerCase().includes(zohoSearch);
      const hasDCBillMatch = apt.dc_bill.zoho_id && 
        apt.dc_bill.zoho_id.toLowerCase().includes(zohoSearch);
        
      if (hasInvoiceMatch || hasDCBillMatch) {
        // Avoid duplicates - only add each employee once
        if (!uniqueEmployeeIds.has(apt.employee_id)) {
          const employee = this.mockEmployees.find(emp => emp.emp_id === apt.employee_id);
          if (employee) {
            uniqueEmployeeIds.add(apt.employee_id);
            results.push(employee);
            matchCount++;
          }
        }
      }
    }
    
    return results;
  }

  getZohoReferenceData(zohoId: string, limit: number = 25) {
    if (!zohoId || zohoId.trim().length < 2) {
      return [];
    }
    
    const zohoSearch = zohoId.toLowerCase().trim();
    const results: any[] = [];
    let matchCount = 0;
    
    for (const apt of this.mockEmployeeAppointments) {
      if (matchCount >= limit) break;
      
      const hasInvoiceMatch = apt.invoice.zoho_id && 
        apt.invoice.zoho_id.toLowerCase().includes(zohoSearch);
      const hasDCBillMatch = apt.dc_bill.zoho_id && 
        apt.dc_bill.zoho_id.toLowerCase().includes(zohoSearch);
        
      if (hasInvoiceMatch || hasDCBillMatch) {
        const employee = this.mockEmployees.find(emp => emp.emp_id === apt.employee_id);
        const corporate = this.mockCorporates.find(corp => corp.id === employee?.corporateId);
        
        results.push({
          employeeName: employee?.name || 'Unknown',
          employeeId: employee?.emp_id || 'Unknown',
          corporate: corporate?.name || 'Unknown',
          corporateId: corporate?.id || 'Unknown',
          date: apt.appointment_date,
          rate: apt.dc_rate,
          serviceType: apt.corporate_plan_details,
          zohoReference: hasInvoiceMatch ? apt.invoice.zoho_id : apt.dc_bill.zoho_id,
          referenceType: hasInvoiceMatch ? 'Invoice' : 'DC Bill'
        });
        matchCount++;
      }
    }
    
    return results;
  }

  updateInvoiceZohoReference(invoiceId: string, zohoReference: string) {
    const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      invoice.zohoReference = zohoReference;
      return { success: true, message: 'Zoho reference updated successfully' };
    }
    return { success: false, message: 'Invoice not found' };
  }

  updateDCBillZohoReference(dcBillId: string, zohoReference: string) {
    const dcBill = this.mockDCBills.find(bill => bill.id === dcBillId);
    if (dcBill) {
      dcBill.zohoReference = zohoReference;
      return { success: true, message: 'Zoho reference updated successfully' };
    }
    return { success: false, message: 'DC Bill not found' };
  }

  // Method to get sample Zoho references for demo purposes
  getSampleZohoReferences(): { invoice: string[]; dcBill: string[]; employee: string[] } {
    return {
      invoice: [
        'ZOHO-INV-DEMO-002', 'ZOHO-INV-2024-0004', 'ZOHO-INV-SAMPLE-6', 
        'ZOHO-INV-TEST-8', 'ZOHO-INV-SHOWCASE-10'
      ],
      dcBill: [
        'ZOHO-DCB-DEMO-002', 'ZOHO-DCB-2024-0004', 'ZOHO-DCB-SAMPLE-6',
        'ZOHO-DCB-TEST-8', 'ZOHO-DCB-SHOWCASE-10'
      ],
      employee: [
        'ZOHO-DEMO-001', 'ZOHO-TEST-100', 'ZOHO-SAMPLE-A1',
        'ZOHO-INV-2024-DEMO-001', 'ZOHO-SHOWCASE-123'
      ]
    };
  }
}

export const mockDataService = MockDataService.getInstance();
export type { MockAppointment, MockInvoice, MockDCBill, MockCorporate, MockEntity, MockLocation };