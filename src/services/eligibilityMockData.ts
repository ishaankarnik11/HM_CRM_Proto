export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  corporate: string;
  department: string;
  location: string;
  age: number;
  dateOfJoining: string;
  servicePeriod: string;
  eligibilityStatus: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  benefitGroup: string;
  opdWalletBalance: number;
  opdWalletAllocated: number;
  opdWalletUsed: number;
  lastAHCDate?: string;
  nextAHCDue?: string;
  email: string;
  phone: string;
  designation: string;
  // New fields for PRD compliance
  hrName?: string;
  hrEmail?: string;
  entity?: string;
  ahcBenefitStatus: 'Not Booked' | 'Booked' | 'Medical Done';
  passcodeStatus: 'Sent' | 'Delivered' | 'Bounced' | 'Not Sent';
  benefitSource: string; // Rule name or group name
  mobile: string; // Separate from phone for validation
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Child' | 'Parent';
  age: number;
  opdWalletAccess: boolean;
}

export interface BenefitGroup {
  id: string;
  name: string;
  description: string;
  ahcBenefits: string[];
  opdBenefits: {
    consultation: number;
    diagnostics: number;
    medicines: number;
    dental: number;
    vision: number;
  };
  opdWalletAllocation: number;
  familyCoverage: {
    spouseIncluded: boolean;
    childrenIncluded: boolean;
    parentIncluded: boolean;
    maxMembers: number;
  };
  validityPeriod: {
    startDate: string;
    endDate: string;
  };
  employeeCount: number;
  isActive: boolean;
}

export interface Corporate {
  id: string;
  name: string;
  code: string;
  employeeCount: number;
  totalOpdWallet: number;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface ProgramTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  year: number;
  quarter?: number;
  status: 'Current' | 'Past' | 'Future';
  isActive: boolean;
  description: string;
}

export interface OpdTransaction {
  id: string;
  employeeId: string;
  employeeName: string;
  corporate: string;
  transactionType: 'Allocation' | 'Usage' | 'Adjustment' | 'Carry Forward';
  serviceType: 'Consultation' | 'Diagnostics' | 'Pharmacy' | 'Dental' | 'Vision';
  amount: number;
  balance: number;
  description: string;
  date: string;
  providerName?: string;
  familyMember?: string;
}

export interface EligibilityRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  effectiveDateRange: {
    startDate: string;
    endDate: string;
  };
  lastModified: string;
  modifiedBy: string;
}

export interface RuleCondition {
  id: string;
  parameter: 'Age' | 'Service Period' | 'Department' | 'Location' | 'Designation' | 'Corporate';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_list';
  value: string | number | string[];
}

export interface RuleAction {
  id: string;
  type: 'Assign Benefit Group' | 'Set Wallet Amount' | 'Enable AHC' | 'Set Family Coverage';
  value: string | number | boolean;
}

export interface ActivityLog {
  id: string;
  employeeId: string;
  timestamp: string;
  user: string;
  actionType: 'Status Change' | 'Eligibility Update' | 'Benefit Assignment' | 'Passcode Generation' | 'Rule Application' | 'Data Modification';
  previousValue?: string;
  newValue?: string;
  description: string;
  ipAddress?: string;
  sessionId?: string;
}

// Mock Data Generators
const indianNames = [
  'Rajesh Verma', 'Kavya Mishra', 'Suresh Iyer', 'Anita Iyer', 'Priya Sharma',
  'Vikram Singh', 'Sneha Patel', 'Rahul Gupta', 'Deepika Reddy', 'Amit Kumar',
  'Pooja Jain', 'Sanjay Rao', 'Meera Nair', 'Arjun Chandra', 'Divya Agarwal',
  'Karan Malhotra', 'Ritu Kapoor', 'Akash Trivedi', 'Shreya Bansal', 'Rohit Mehta',
  'Neha Sinha', 'Varun Joshi', 'Swathi Krishnan', 'Manoj Pandey', 'Gayatri Desai',
  'Arun Bhat', 'Preeti Aggarwal', 'Harish Pillai', 'Lakshmi Raman', 'Nikhil Saxena'
];

const corporates: Corporate[] = [
  {
    id: 'corp-1',
    name: 'Energy Solutions Inc',
    code: 'ESI',
    employeeCount: 450,
    totalOpdWallet: 6750000,
    contactPerson: 'Mr. Rajesh Kumar',
    email: 'hr@energysolutions.com',
    phone: '+91-11-4567-8901',
    address: 'Sector 62, Noida, UP'
  },
  {
    id: 'corp-2', 
    name: 'Tech Innovations Corp',
    code: 'TIC',
    employeeCount: 280,
    totalOpdWallet: 4200000,
    contactPerson: 'Ms. Priya Sharma',
    email: 'hr@techinnovations.com',
    phone: '+91-80-2345-6789',
    address: 'Electronic City, Bangalore, KA'
  },
  {
    id: 'corp-3',
    name: 'Healthcare Plus Ltd',
    code: 'HPL',
    employeeCount: 320,
    totalOpdWallet: 5600000,
    contactPerson: 'Dr. Suresh Iyer',
    email: 'admin@healthcareplus.com',
    phone: '+91-22-9876-5432',
    address: 'Andheri East, Mumbai, MH'
  },
  {
    id: 'corp-4',
    name: 'Manufacturing Solutions',
    code: 'MS',
    employeeCount: 197,
    totalOpdWallet: 2955000,
    contactPerson: 'Mr. Vikram Singh',
    email: 'hr@mfgsolutions.com',
    phone: '+91-44-8765-4321',
    address: 'Ambattur, Chennai, TN'
  },
  {
    id: 'corp-5',
    name: 'Financial Services Inc',
    code: 'FSI',
    employeeCount: 215,
    totalOpdWallet: 4300000,
    contactPerson: 'Ms. Kavya Mishra',
    email: 'hr@finservices.com',
    phone: '+91-20-5432-1098',
    address: 'Hinjewadi, Pune, MH'
  },
  {
    id: 'corp-6',
    name: 'Raymond Limited',
    code: 'RAYMOND',
    employeeCount: 1250,
    totalOpdWallet: 18750000,
    contactPerson: 'Mr. Amit Kulkarni',
    email: 'hr@raymond.com',
    phone: '+91-22-6654-3000',
    address: 'Plot No. 417, Udyog Vihar Phase IV, Gurgaon, HR'
  },
  {
    id: 'corp-7',
    name: 'Aadhar Housing Finance Limited (AHFL)',
    code: 'AHFL',
    employeeCount: 850,
    totalOpdWallet: 12750000,
    contactPerson: 'Mr. Subhash Gupta',
    email: 'hr@aadharhfc.com',
    phone: '+91-22-4040-7000',
    address: 'Aadhar House, 4th Floor, Plot No. C-23, Bandra Kurla Complex, Mumbai, MH'
  }
];

const programTerms: ProgramTerm[] = [
  {
    id: 'term-1',
    name: 'FY 2024-25',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    year: 2024,
    status: 'Current',
    isActive: true,
    description: 'Current financial year program'
  },
  {
    id: 'term-2',
    name: 'FY 2023-24',
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    year: 2023,
    status: 'Past',
    isActive: false,
    description: 'Previous financial year program'
  },
  {
    id: 'term-3',
    name: 'FY 2022-23',
    startDate: '2022-04-01',
    endDate: '2023-03-31',
    year: 2022,
    status: 'Past',
    isActive: false,
    description: 'Historical financial year program'
  },
  {
    id: 'term-4',
    name: 'Q3 2024',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    year: 2024,
    quarter: 3,
    status: 'Current',
    isActive: true,
    description: 'Current quarter program'
  },
  {
    id: 'term-5',
    name: 'Q2 2024',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    year: 2024,
    quarter: 2,
    status: 'Past',
    isActive: false,
    description: 'Previous quarter program'
  },
  {
    id: 'term-6',
    name: 'FY 2025-26',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    year: 2025,
    status: 'Future',
    isActive: false,
    description: 'Upcoming financial year program'
  }
];

const benefitGroups: BenefitGroup[] = [
  {
    id: 'bg-1',
    name: 'Executive',
    description: 'Premium benefits for senior management',
    ahcBenefits: ['Executive', 'Premium', 'Comprehensive', 'Wellness'],
    opdBenefits: {
      consultation: 2000,
      diagnostics: 5000,
      medicines: 1500,
      dental: 1000,
      vision: 800
    },
    opdWalletAllocation: 25000,
    familyCoverage: {
      spouseIncluded: true,
      childrenIncluded: true,
      parentIncluded: true,
      maxMembers: 6
    },
    validityPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    employeeCount: 89,
    isActive: true
  },
  {
    id: 'bg-2',
    name: 'Premium',
    description: 'Enhanced benefits for middle management',
    ahcBenefits: ['Premium', 'Standard', 'Additional Tests'],
    opdBenefits: {
      consultation: 1500,
      diagnostics: 4000,
      medicines: 1200,
      dental: 800,
      vision: 600
    },
    opdWalletAllocation: 20000,
    familyCoverage: {
      spouseIncluded: true,
      childrenIncluded: true,
      parentIncluded: false,
      maxMembers: 4
    },
    validityPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    employeeCount: 234,
    isActive: true
  },
  {
    id: 'bg-3',
    name: 'Standard',
    description: 'Standard benefits for regular employees',
    ahcBenefits: ['Standard', 'Basic'],
    opdBenefits: {
      consultation: 1000,
      diagnostics: 3000,
      medicines: 800,
      dental: 500,
      vision: 400
    },
    opdWalletAllocation: 15000,
    familyCoverage: {
      spouseIncluded: true,
      childrenIncluded: true,
      parentIncluded: false,
      maxMembers: 4
    },
    validityPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    employeeCount: 612,
    isActive: true
  },
  {
    id: 'bg-4',
    name: 'Basic',
    description: 'Essential benefits for entry-level employees',
    ahcBenefits: ['Basic'],
    opdBenefits: {
      consultation: 500,
      diagnostics: 2000,
      medicines: 600,
      dental: 300,
      vision: 200
    },
    opdWalletAllocation: 10000,
    familyCoverage: {
      spouseIncluded: false,
      childrenIncluded: true,
      parentIncluded: false,
      maxMembers: 2
    },
    validityPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    employeeCount: 312,
    isActive: true
  },
  {
    id: 'bg-5',
    name: 'Not Eligible',
    description: 'Employees not eligible for benefits based on corporate rules',
    ahcBenefits: [],
    opdBenefits: {
      consultation: 0,
      diagnostics: 0,
      medicines: 0,
      dental: 0,
      vision: 0
    },
    opdWalletAllocation: 0,
    familyCoverage: {
      spouseIncluded: false,
      childrenIncluded: false,
      parentIncluded: false,
      maxMembers: 0
    },
    validityPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    employeeCount: 145,
    isActive: true
  },
  {
    id: 'bg-6',
    name: 'Restricted',
    description: 'Location-restricted employees requiring special approval',
    ahcBenefits: ['Standard'],
    opdBenefits: {
      consultation: 1000,
      diagnostics: 3000,
      medicines: 800,
      dental: 500,
      vision: 400
    },
    opdWalletAllocation: 15000,
    familyCoverage: {
      spouseIncluded: true,
      childrenIncluded: true,
      parentIncluded: false,
      maxMembers: 4
    },
    validityPeriod: {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    employeeCount: 78,
    isActive: true
  }
];

const departments = ['HR', 'IT', 'Finance', 'Operations', 'Sales', 'Marketing', 'Legal', 'Admin', 'R&D', 'Quality'];
const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida', 'Kochi', 'Visakhapatnam', 'Coimbatore', 'Mysore', 'Aurangabad', 'Nashik'];
const designations = ['Manager', 'Senior Manager', 'Analyst', 'Senior Analyst', 'Executive', 'Associate', 'Director', 'VP', 'AVP', 'Team Lead'];

// Generate nextAHCDue date with strategic distribution
const generateNextAHCDate = (index: number): string => {
  const today = new Date();
  
  // Create a good mix of employees:
  // - 30% eligible today or overdue (nextAHCDue <= today)
  // - 40% eligible soon (1-30 days from today)  
  // - 30% eligible later (31-180 days from today)
  
  const category = index % 10;
  let daysFromToday: number;
  
  if (category < 3) {
    // 30% - Eligible today or overdue (0 to -60 days)
    daysFromToday = Math.floor(Math.random() * 61) * -1; // 0 to -60 days
  } else if (category < 7) {
    // 40% - Eligible soon (1 to 30 days)
    daysFromToday = Math.floor(Math.random() * 30) + 1; // 1 to 30 days
  } else {
    // 30% - Eligible later (31 to 180 days)
    daysFromToday = Math.floor(Math.random() * 150) + 31; // 31 to 180 days
  }
  
  const nextAHCDate = new Date(today.getTime() + daysFromToday * 24 * 60 * 60 * 1000);
  return nextAHCDate.toISOString().split('T')[0];
};

// Generate random employee data
export const generateEmployees = (count: number = 1247): Employee[] => {
  const employees: Employee[] = [];
  
  // First create specific employees for Raymond and AHFL to showcase the rules
  // Raymond employees (200 employees)
  for (let i = 0; i < 200; i++) {
    const corporate = corporates.find(c => c.name === 'Raymond Limited')!;
    const name = indianNames[Math.floor(Math.random() * indianNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    // Mix of locations including some in non-restricted areas
    const raymondLocations = ['Gurgaon', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Aurangabad'];
    const location = raymondLocations[Math.floor(Math.random() * raymondLocations.length)];
    
    // Strategic age distribution to test rules
    let age: number;
    let benefitGroup: BenefitGroup;
    let servicePeriod: number;
    
    if (i < 40) {
      // 20% under 30 (not eligible)
      age = 22 + Math.floor(Math.random() * 8); // 22-29
      benefitGroup = benefitGroups.find(bg => bg.name === 'Not Eligible')!;
      servicePeriod = Math.floor(Math.random() * 7) + 1; // 1-7 years
    } else if (i < 120) {
      // 40% between 30-45 (biennial)
      age = 30 + Math.floor(Math.random() * 16); // 30-45
      benefitGroup = benefitGroups.find(bg => bg.name === 'Standard')!;
      servicePeriod = Math.floor(Math.random() * 15) + 2; // 2-16 years
    } else if (i < 180) {
      // 30% above 45 (annual)
      age = 46 + Math.floor(Math.random() * 14); // 46-59
      benefitGroup = benefitGroups.find(bg => bg.name === 'Premium')!;
      servicePeriod = Math.floor(Math.random() * 20) + 5; // 5-24 years
    } else {
      // 10% new joiners (not eligible due to service period)
      age = 24 + Math.floor(Math.random() * 20); // 24-43
      benefitGroup = benefitGroups.find(bg => bg.name === 'Not Eligible')!;
      servicePeriod = Math.random() * 0.8; // Less than 1 year
    }
    
    const designation = i < 10 ? 'VP' : i < 20 ? 'Director' : designations[Math.floor(Math.random() * designations.length)];
    const joiningDate = new Date(Date.now() - servicePeriod * 365.25 * 24 * 60 * 60 * 1000);
    
    const walletUsed = Math.floor(Math.random() * benefitGroup.opdWalletAllocation * 0.6);
    const walletBalance = benefitGroup.opdWalletAllocation - walletUsed;
    
    const eligibilityStatuses: Employee['eligibilityStatus'][] = ['Active', 'Active', 'Active', 'Active', 'Inactive'];
    const status = eligibilityStatuses[Math.floor(Math.random() * eligibilityStatuses.length)];
    
    const ahcStatuses: Employee['ahcBenefitStatus'][] = ['Not Booked', 'Not Booked', 'Booked', 'Medical Done'];
    const ahcStatus = ahcStatuses[Math.floor(Math.random() * ahcStatuses.length)];
    
    const passcodeStatuses: Employee['passcodeStatus'][] = ['Sent', 'Delivered', 'Not Sent'];
    const passcodeStatus = passcodeStatuses[Math.floor(Math.random() * passcodeStatuses.length)];
    
    const mobileNumber = `${Math.floor(Math.random() * 900000000) + 100000000}`;
    
    employees.push({
      id: `emp-ray-${i + 1}`,
      employeeId: `${corporate.code}${String(i + 1000).padStart(4, '0')}`,
      name,
      corporate: corporate.name,
      department,
      location,
      age,
      dateOfJoining: joiningDate.toISOString().split('T')[0],
      servicePeriod: `${servicePeriod.toFixed(1)} years`,
      eligibilityStatus: status,
      benefitGroup: benefitGroup.name,
      opdWalletBalance: walletBalance,
      opdWalletAllocated: benefitGroup.opdWalletAllocation,
      opdWalletUsed: walletUsed,
      lastAHCDate: status === 'Active' && benefitGroup.name !== 'Not Eligible' ? new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      nextAHCDue: status === 'Active' && benefitGroup.name !== 'Not Eligible' ? generateNextAHCDate(i) : undefined,
      email: `${name.toLowerCase().replace(' ', '.')}@raymond.com`,
      phone: `+91-${mobileNumber}`,
      designation,
      hrName: 'Amit Kulkarni',
      hrEmail: 'amit.kulkarni@raymond.com',
      entity: 'Raymond Head Office',
      ahcBenefitStatus: benefitGroup.name === 'Not Eligible' ? 'Not Booked' : ahcStatus,
      passcodeStatus,
      benefitSource: 'Raymond Corporate Rule',
      mobile: mobileNumber
    });
  }
  
  // AHFL employees (150 employees)
  for (let i = 0; i < 150; i++) {
    const corporate = corporates.find(c => c.name === 'Aadhar Housing Finance Limited (AHFL)')!;
    const name = indianNames[Math.floor(Math.random() * indianNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    // Mix of locations including restricted states
    const ahflLocations = ['Mumbai', 'Pune', 'Chennai', 'Bangalore', 'Hyderabad', 'Delhi', 'Kochi', 'Visakhapatnam'];
    const location = ahflLocations[Math.floor(Math.random() * ahflLocations.length)];
    
    // Strategic age distribution to test rules
    let age: number;
    let benefitGroup: BenefitGroup;
    const servicePeriod = Math.floor(Math.random() * 15) + 1; // 1-15 years
    
    // Check if location is restricted
    const restrictedStates = ['Maharashtra', 'Andhra Pradesh', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Kerala'];
    const isRestricted = restrictedStates.some(state => 
      (location === 'Mumbai' && state === 'Maharashtra') ||
      (location === 'Pune' && state === 'Maharashtra') ||
      (location === 'Chennai' && state === 'Tamil Nadu') ||
      (location === 'Bangalore' && state === 'Karnataka') ||
      (location === 'Hyderabad' && state === 'Telangana') ||
      (location === 'Kochi' && state === 'Kerala') ||
      (location === 'Visakhapatnam' && state === 'Andhra Pradesh')
    );
    
    if (isRestricted && i < 30) {
      // 20% in restricted locations
      age = 25 + Math.floor(Math.random() * 30); // 25-54
      benefitGroup = benefitGroups.find(bg => bg.name === 'Restricted')!;
    } else if (i < 75) {
      // 30% under 40 (biennial)
      age = 25 + Math.floor(Math.random() * 15); // 25-39
      benefitGroup = benefitGroups.find(bg => bg.name === 'Standard')!;
    } else if (i < 135) {
      // 40% above 40 (annual)
      age = 40 + Math.floor(Math.random() * 15); // 40-54
      benefitGroup = benefitGroups.find(bg => bg.name === 'Premium')!;
    } else {
      // 10% senior management
      age = 35 + Math.floor(Math.random() * 20); // 35-54
      benefitGroup = benefitGroups.find(bg => bg.name === 'Executive')!;
    }
    
    let designation: string;
    if (i >= 135) {
      // Senior management
      const seniorDesignations = ['VP', 'Director', 'AVP', 'General Manager', 'DGM'];
      designation = seniorDesignations[Math.floor(Math.random() * seniorDesignations.length)];
    } else {
      designation = designations[Math.floor(Math.random() * designations.length)];
    }
    
    const joiningDate = new Date(Date.now() - servicePeriod * 365.25 * 24 * 60 * 60 * 1000);
    
    const walletUsed = Math.floor(Math.random() * benefitGroup.opdWalletAllocation * 0.6);
    const walletBalance = benefitGroup.opdWalletAllocation - walletUsed;
    
    const eligibilityStatuses: Employee['eligibilityStatus'][] = ['Active', 'Active', 'Active', 'Inactive'];
    const status = eligibilityStatuses[Math.floor(Math.random() * eligibilityStatuses.length)];
    
    const ahcStatuses: Employee['ahcBenefitStatus'][] = ['Not Booked', 'Not Booked', 'Booked', 'Medical Done'];
    const ahcStatus = ahcStatuses[Math.floor(Math.random() * ahcStatuses.length)];
    
    const passcodeStatuses: Employee['passcodeStatus'][] = ['Sent', 'Delivered', 'Not Sent'];
    const passcodeStatus = passcodeStatuses[Math.floor(Math.random() * passcodeStatuses.length)];
    
    const mobileNumber = `${Math.floor(Math.random() * 900000000) + 100000000}`;
    
    employees.push({
      id: `emp-ahfl-${i + 1}`,
      employeeId: `${corporate.code}${String(i + 2000).padStart(4, '0')}`,
      name,
      corporate: corporate.name,
      department,
      location,
      age,
      dateOfJoining: joiningDate.toISOString().split('T')[0],
      servicePeriod: `${servicePeriod} years`,
      eligibilityStatus: status,
      benefitGroup: benefitGroup.name,
      opdWalletBalance: walletBalance,
      opdWalletAllocated: benefitGroup.opdWalletAllocation,
      opdWalletUsed: walletUsed,
      lastAHCDate: status === 'Active' && benefitGroup.name !== 'Restricted' ? new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      nextAHCDue: status === 'Active' && benefitGroup.name !== 'Restricted' ? generateNextAHCDate(i) : undefined,
      email: `${name.toLowerCase().replace(' ', '.')}@aadharhfc.com`,
      phone: `+91-${mobileNumber}`,
      designation,
      hrName: 'Subhash Gupta',
      hrEmail: 'subhash.gupta@aadharhfc.com',
      entity: 'AHFL Main Office',
      ahcBenefitStatus: benefitGroup.name === 'Restricted' ? 'Not Booked' : ahcStatus,
      passcodeStatus,
      benefitSource: 'AHFL Corporate Rule',
      mobile: mobileNumber
    });
  }
  
  // Generate remaining employees for other companies
  for (let i = 350; i < count; i++) {
    const corporate = corporates[Math.floor(Math.random() * (corporates.length - 2))]; // Exclude Raymond and AHFL
    const benefitGroup = benefitGroups[Math.floor(Math.random() * 4)]; // Exclude Not Eligible and Restricted
    const name = indianNames[Math.floor(Math.random() * indianNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const designation = designations[Math.floor(Math.random() * designations.length)];
    
    const joiningDate = new Date(2015 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    const age = 22 + Math.floor(Math.random() * 38);
    const servicePeriod = Math.floor((Date.now() - joiningDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    const walletUsed = Math.floor(Math.random() * benefitGroup.opdWalletAllocation * 0.6);
    const walletBalance = benefitGroup.opdWalletAllocation - walletUsed;
    
    const eligibilityStatuses: Employee['eligibilityStatus'][] = ['Active', 'Active', 'Active', 'Active', 'Inactive', 'Pending', 'Suspended'];
    const status = eligibilityStatuses[Math.floor(Math.random() * eligibilityStatuses.length)];
    
    const ahcStatuses: Employee['ahcBenefitStatus'][] = ['Not Booked', 'Not Booked', 'Not Booked', 'Booked', 'Medical Done'];
    const ahcStatus = ahcStatuses[Math.floor(Math.random() * ahcStatuses.length)];
    
    const passcodeStatuses: Employee['passcodeStatus'][] = ['Sent', 'Delivered', 'Bounced', 'Not Sent'];
    const passcodeStatus = passcodeStatuses[Math.floor(Math.random() * passcodeStatuses.length)];
    
    const entities = ['Main Office', 'Branch Office', 'Regional Office', 'Subsidiary'];
    const entity = entities[Math.floor(Math.random() * entities.length)];
    
    const hrNames = ['Rajesh Kumar', 'Priya Sharma', 'Suresh Iyer', 'Kavya Mishra', 'Vikram Singh'];
    const hrName = hrNames[Math.floor(Math.random() * hrNames.length)];
    
    const mobileNumber = `${Math.floor(Math.random() * 900000000) + 100000000}`;
    
    employees.push({
      id: `emp-${i + 1}`,
      employeeId: `${corporate.code}${String(i + 1000).padStart(4, '0')}`,
      name,
      corporate: corporate.name,
      department,
      location,
      age,
      dateOfJoining: joiningDate.toISOString().split('T')[0],
      servicePeriod: `${servicePeriod} years`,
      eligibilityStatus: status,
      benefitGroup: benefitGroup.name,
      opdWalletBalance: walletBalance,
      opdWalletAllocated: benefitGroup.opdWalletAllocation,
      opdWalletUsed: walletUsed,
      lastAHCDate: status === 'Active' ? new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      nextAHCDue: status === 'Active' ? generateNextAHCDate(i) : undefined,
      email: `${name.toLowerCase().replace(' ', '.')}@${corporate.code.toLowerCase()}.com`,
      phone: `+91-${mobileNumber}`,
      designation,
      // New fields
      hrName,
      hrEmail: `${hrName.toLowerCase().replace(' ', '.')}@${corporate.code.toLowerCase()}.com`,
      entity,
      ahcBenefitStatus: ahcStatus,
      passcodeStatus,
      benefitSource: Math.random() > 0.5 ? benefitGroup.name : 'Corporate Rule',
      mobile: mobileNumber
    });
  }
  
  return employees;
};

// Generate OPD transactions
export const generateOpdTransactions = (employees: Employee[], count: number = 500): OpdTransaction[] => {
  const transactions: OpdTransaction[] = [];
  const serviceTypes: OpdTransaction['serviceType'][] = ['Consultation', 'Diagnostics', 'Pharmacy', 'Dental', 'Vision'];
  const transactionTypes: OpdTransaction['transactionType'][] = ['Allocation', 'Usage', 'Adjustment', 'Carry Forward'];
  const providers = ['Apollo Hospital', 'Max Healthcare', 'Fortis Hospital', 'Medanta', 'AIIMS', 'Local Clinic', 'City Hospital'];
  
  for (let i = 0; i < count; i++) {
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    
    let amount: number;
    let description: string;
    
    switch (serviceType) {
      case 'Consultation':
        amount = Math.floor(Math.random() * 1500) + 500;
        description = `${serviceType} at ${provider}`;
        break;
      case 'Diagnostics':
        amount = Math.floor(Math.random() * 4200) + 800;
        description = `Medical tests at ${provider}`;
        break;
      case 'Pharmacy':
        amount = Math.floor(Math.random() * 1300) + 200;
        description = `Medicine purchase at ${provider}`;
        break;
      case 'Dental':
        amount = Math.floor(Math.random() * 800) + 300;
        description = `Dental treatment at ${provider}`;
        break;
      case 'Vision':
        amount = Math.floor(Math.random() * 600) + 200;
        description = `Eye care at ${provider}`;
        break;
    }
    
    if (transactionType === 'Allocation') {
      amount = employee.opdWalletAllocated;
      description = 'Annual OPD wallet allocation';
    }
    
    const balance = employee.opdWalletBalance - (transactionType === 'Usage' ? amount : 0);
    const date = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
    
    transactions.push({
      id: `txn-${i + 1}`,
      employeeId: employee.id,
      employeeName: employee.name,
      corporate: employee.corporate,
      transactionType,
      serviceType,
      amount,
      balance: Math.max(balance, 0),
      description,
      date: date.toISOString().split('T')[0],
      providerName: transactionType === 'Usage' ? provider : undefined,
      familyMember: Math.random() > 0.8 ? 'Spouse' : undefined
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate activity logs for an employee
export const generateActivityLogs = (employeeId: string, count: number = 15): ActivityLog[] => {
  const activities: ActivityLog[] = [];
  const users = ['Admin User', 'HR Manager', 'System Admin', 'Priya Sharma', 'Rajesh Kumar', 'Corporate Admin'];
  const actionTypes: ActivityLog['actionType'][] = [
    'Status Change', 'Eligibility Update', 'Benefit Assignment', 
    'Passcode Generation', 'Rule Application', 'Data Modification'
  ];
  
  const generateDescription = (actionType: ActivityLog['actionType'], prevValue?: string, newValue?: string): string => {
    switch (actionType) {
      case 'Status Change':
        return `Employee status changed from ${prevValue || 'Pending'} to ${newValue || 'Active'}`;
      case 'Eligibility Update':
        return `Employee eligibility criteria updated based on ${newValue || 'service period changes'}`;
      case 'Benefit Assignment':
        return `Benefit group assigned: ${newValue || 'Standard'} (previously: ${prevValue || 'Basic'})`;
      case 'Passcode Generation':
        return `6-digit passcode generated and sent to registered mobile number`;
      case 'Rule Application':
        return `Corporate rule "${newValue || 'Experienced Employee Premium Benefits'}" applied to employee`;
      case 'Data Modification':
        return `Employee ${newValue || 'contact information'} updated in system`;
      default:
        return 'System activity performed';
    }
  };

  for (let i = 0; i < count; i++) {
    const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 90); // Last 90 days
    const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 24 * 60 * 60 * 1000);
    
    let previousValue: string | undefined;
    let newValue: string | undefined;
    
    switch (actionType) {
      case 'Status Change':
        previousValue = Math.random() > 0.5 ? 'Pending' : 'Inactive';
        newValue = Math.random() > 0.3 ? 'Active' : 'Suspended';
        break;
      case 'Benefit Assignment':
        previousValue = ['Basic', 'Standard'][Math.floor(Math.random() * 2)];
        newValue = ['Standard', 'Premium', 'Executive'][Math.floor(Math.random() * 3)];
        break;
      case 'Rule Application':
        newValue = [
          'Senior Management Executive Benefits',
          'Experienced Employee Premium Benefits', 
          'New Joinee Basic Benefits',
          'Raymond - Under 30 Years Not Eligible',
          'Raymond - 30-45 Years Biennial Eligibility',
          'Raymond - Above 45 Years Annual Eligibility',
          'Raymond - New Joiners Waiting Period',
          'AHFL - Under 40 Years Biennial Eligibility',
          'AHFL - Above 40 Years Annual Eligibility',
          'AHFL - Senior Management Approval Required',
          'AHFL - Location Restrictions'
        ][Math.floor(Math.random() * 11)];
        break;
      case 'Data Modification':
        newValue = ['contact information', 'address details', 'emergency contacts', 'designation'][Math.floor(Math.random() * 4)];
        break;
      case 'Eligibility Update':
        newValue = ['service period changes', 'department transfer', 'promotion'][Math.floor(Math.random() * 3)];
        break;
    }

    activities.push({
      id: `activity-${employeeId}-${i + 1}`,
      employeeId,
      timestamp: timestamp.toISOString(),
      user,
      actionType,
      previousValue,
      newValue,
      description: generateDescription(actionType, previousValue, newValue),
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      sessionId: `sess-${Math.random().toString(36).substr(2, 9)}`
    });
  }

  // Sort by timestamp (newest first)
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate eligibility rules
export const generateEligibilityRules = (): EligibilityRule[] => {
  return [
    // Raymond Rules
    {
      id: 'rule-4',
      name: 'Raymond - Under 30 Years Not Eligible',
      description: 'Employees below 30 years are not eligible for AHC benefits',
      isActive: true,
      priority: 10,
      conditions: [
        {
          id: 'cond-4a',
          parameter: 'Corporate',
          operator: 'equals',
          value: 'Raymond Limited'
        },
        {
          id: 'cond-4b',
          parameter: 'Age',
          operator: 'less_than',
          value: 30
        }
      ],
      actions: [
        {
          id: 'act-4',
          type: 'Assign Benefit Group',
          value: 'Not Eligible'
        }
      ],
      effectiveDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      lastModified: '2024-07-15',
      modifiedBy: 'Raymond HR Team'
    },
    {
      id: 'rule-5',
      name: 'Raymond - 30-45 Years Biennial Eligibility',
      description: 'Employees aged 30-45 years eligible once in 2 years from last benefit date',
      isActive: true,
      priority: 11,
      conditions: [
        {
          id: 'cond-5a',
          parameter: 'Corporate',
          operator: 'equals',
          value: 'Raymond Limited'
        },
        {
          id: 'cond-5b',
          parameter: 'Age',
          operator: 'greater_than',
          value: 29
        },
        {
          id: 'cond-5c',
          parameter: 'Age',
          operator: 'less_than',
          value: 46
        }
      ],
      actions: [
        {
          id: 'act-5',
          type: 'Assign Benefit Group',
          value: 'Standard'
        }
      ],
      effectiveDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      lastModified: '2024-07-15',
      modifiedBy: 'Raymond HR Team'
    },
    {
      id: 'rule-6',
      name: 'Raymond - Above 45 Years Annual Eligibility',
      description: 'Employees aged 45+ years eligible once every year from last benefit date',
      isActive: true,
      priority: 12,
      conditions: [
        {
          id: 'cond-6a',
          parameter: 'Corporate',
          operator: 'equals',
          value: 'Raymond Limited'
        },
        {
          id: 'cond-6b',
          parameter: 'Age',
          operator: 'greater_than',
          value: 44
        }
      ],
      actions: [
        {
          id: 'act-6',
          type: 'Assign Benefit Group',
          value: 'Premium'
        }
      ],
      effectiveDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      lastModified: '2024-07-15',
      modifiedBy: 'Raymond HR Team'
    },
    {
      id: 'rule-7',
      name: 'Raymond - New Joiners Waiting Period',
      description: 'New joiners must complete 1 year service before AHC eligibility',
      isActive: true,
      priority: 13,
      conditions: [
        {
          id: 'cond-7a',
          parameter: 'Corporate',
          operator: 'equals',
          value: 'Raymond Limited'
        },
        {
          id: 'cond-7b',
          parameter: 'Service Period',
          operator: 'less_than',
          value: 1
        }
      ],
      actions: [
        {
          id: 'act-7',
          type: 'Assign Benefit Group',
          value: 'Not Eligible'
        }
      ],
      effectiveDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      lastModified: '2024-07-15',
      modifiedBy: 'Raymond HR Team'
    },
    // AHFL Rules
    {
      id: 'rule-8',
      name: 'AHFL - Under 40 Years Biennial Eligibility',
      description: 'Employees below 40 years eligible once every 2 calendar years',
      isActive: true,
      priority: 20,
      conditions: [
        {
          id: 'cond-8a',
          parameter: 'Corporate',
          operator: 'equals',
          value: 'Aadhar Housing Finance Limited (AHFL)'
        },
        {
          id: 'cond-8b',
          parameter: 'Age',
          operator: 'less_than',
          value: 40
        }
      ],
      actions: [
        {
          id: 'act-8',
          type: 'Assign Benefit Group',
          value: 'Standard'
        }
      ],
      effectiveDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      lastModified: '2024-07-20',
      modifiedBy: 'AHFL HR Team'
    },
    {
      id: 'rule-9',
      name: 'AHFL - Above 40 Years Annual Eligibility',
      description: 'Employees above 40 years eligible once every calendar year with 6-month gap',
      isActive: true,
      priority: 21,
      conditions: [
        {
          id: 'cond-9a',
          parameter: 'Corporate',
          operator: 'equals',
          value: 'Aadhar Housing Finance Limited (AHFL)'
        },
        {
          id: 'cond-9b',
          parameter: 'Age',
          operator: 'greater_than',
          value: 39
        }
      ],
      actions: [
        {
          id: 'act-9',
          type: 'Assign Benefit Group',
          value: 'Premium'
        }
      ],
      effectiveDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      lastModified: '2024-07-20',
      modifiedBy: 'AHFL HR Team'
    },
    {
      id: 'rule-10',
      name: 'AHFL - Senior Management Approval Required',
      description: 'Senior Management requires prior approval from Subhash (HR)',
      isActive: true,
      priority: 22,
      conditions: [
        {
          id: 'cond-10a',
          parameter: 'Corporate',
          operator: 'equals',
          value: 'Aadhar Housing Finance Limited (AHFL)'
        },
        {
          id: 'cond-10b',
          parameter: 'Designation',
          operator: 'in_list',
          value: ['VP', 'Director', 'AVP', 'General Manager', 'DGM']
        }
      ],
      actions: [
        {
          id: 'act-10',
          type: 'Assign Benefit Group',
          value: 'Executive'
        }
      ],
      effectiveDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      lastModified: '2024-07-20',
      modifiedBy: 'AHFL HR Team'
    },
    {
      id: 'rule-11',
      name: 'AHFL - Location Restrictions',
      description: 'Appointment booking not permitted in restricted states',
      isActive: true,
      priority: 23,
      conditions: [
        {
          id: 'cond-11a',
          parameter: 'Corporate',
          operator: 'equals',
          value: 'Aadhar Housing Finance Limited (AHFL)'
        },
        {
          id: 'cond-11b',
          parameter: 'Location',
          operator: 'in_list',
          value: ['Maharashtra', 'Andhra Pradesh', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Kerala']
        }
      ],
      actions: [
        {
          id: 'act-11',
          type: 'Assign Benefit Group',
          value: 'Restricted'
        }
      ],
      effectiveDateRange: {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      lastModified: '2024-07-20',
      modifiedBy: 'AHFL HR Team'
    }
  ];
};

// Export all mock data
export const mockData = {
  corporates,
  programTerms,
  benefitGroups,
  employees: generateEmployees(),
  opdTransactions: [] as OpdTransaction[],
  eligibilityRules: generateEligibilityRules()
};

// Initialize transactions after employees are generated
mockData.opdTransactions = generateOpdTransactions(mockData.employees);

export default mockData;