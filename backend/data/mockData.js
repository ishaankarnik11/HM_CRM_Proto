// Converted mock data from frontend TypeScript to Node.js
// This file exports the mock data for the backend API

// Import and convert the TypeScript mock data
const fs = require('fs');
const path = require('path');

// Since we can't directly import TS files, we'll recreate the essential data structures
// Based on your eligibilityMockData.ts file

const corporates = [
  {
    id: 'corp-1',
    name: 'Tech Innovators Pvt Ltd',
    code: 'TECH',
    employeeCount: 450,
    totalOpdWallet: 6750000,
    contactPerson: 'Mr. Rajesh Kumar',
    email: 'hr@techinnovators.com',
    phone: '+91-80-4567-8901',
    address: 'Electronic City, Bangalore, KA'
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

const benefitGroups = [
  {
    id: 'bg-1',
    name: 'Executive',
    description: 'Premium benefits for senior management',
    ahcBenefits: ['Executive', 'Premium', 'Standard', 'Comprehensive'],
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
      parentsIncluded: true,
      inLawsIncluded: false
    }
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
      parentsIncluded: false,
      inLawsIncluded: false
    }
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
      parentsIncluded: false,
      inLawsIncluded: false
    }
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
      parentsIncluded: false,
      inLawsIncluded: false
    }
  }
];

// Generate sample employees data
const generateEmployees = (count = 500) => {
  const employees = [];
  const indianNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Gupta', 'Vikas Patel',
    'Kavita Joshi', 'Rohit Verma', 'Sneha Reddy', 'Arjun Nair', 'Pooja Iyer'
  ];
  
  const departments = ['HR', 'Finance', 'IT', 'Operations', 'Sales', 'Marketing'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];
  
  for (let i = 0; i < count; i++) {
    const corporate = corporates[Math.floor(Math.random() * corporates.length)];
    const benefitGroup = benefitGroups[Math.floor(Math.random() * benefitGroups.length)];
    const name = indianNames[Math.floor(Math.random() * indianNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const age = 25 + Math.floor(Math.random() * 35); // 25-59 years
    const servicePeriod = Math.floor(Math.random() * 15) + 1; // 1-15 years
    const joiningDate = new Date(Date.now() - servicePeriod * 365.25 * 24 * 60 * 60 * 1000);
    
    const walletUsed = Math.floor(Math.random() * benefitGroup.opdWalletAllocation * 0.6);
    const walletBalance = benefitGroup.opdWalletAllocation - walletUsed;
    
    employees.push({
      id: `emp-${i + 1}`,
      employeeId: `${corporate.code}${String(i + 1).padStart(4, '0')}`,
      name: `${name} ${i + 1}`,
      email: `${name.toLowerCase().replace(' ', '.')}.${i + 1}@${corporate.code.toLowerCase()}.com`,
      mobile: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      corporateId: corporate.id,
      corporateName: corporate.name,
      department,
      designation: `${department} Executive`,
      location,
      age,
      joiningDate: joiningDate.toISOString().split('T')[0],
      servicePeriod,
      benefitGroup: benefitGroup.name,
      ahcBenefitStatus: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
      eligibilityStatus: ['Active', 'Inactive', 'Pending', 'Suspended'][Math.floor(Math.random() * 4)],
      nextAHCDue: new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastAHCDate: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      passcodeStatus: ['Sent', 'Not Sent', 'Expired'][Math.floor(Math.random() * 3)],
      benefitSource: 'Corporate Rule',
      opdWalletBalance: walletBalance,
      opdWalletAllocated: benefitGroup.opdWalletAllocation,
      opdWalletUsed: walletUsed
    });
  }
  
  return employees;
};

// Sample eligibility rules
const eligibilityRules = [
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
  }
];

// Generate sample OPD transactions
const generateOpdTransactions = (employees) => {
  const transactions = [];
  const serviceTypes = ['Consultation', 'Diagnostics', 'Pharmacy', 'Dental', 'Vision'];
  const providers = ['Apollo Hospital', 'Fortis Healthcare', 'Max Healthcare', 'Medanta'];
  
  employees.forEach(employee => {
    if (employee.opdWalletAllocated > 0) {
      const transactionCount = Math.floor(Math.random() * 10) + 1;
      
      for (let i = 0; i < transactionCount; i++) {
        const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        const provider = providers[Math.floor(Math.random() * providers.length)];
        const amount = Math.floor(Math.random() * 2000) + 200;
        
        transactions.push({
          id: `txn-${employee.id}-${i + 1}`,
          employeeId: employee.id,
          date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: Math.random() > 0.8 ? 'Allocation' : 'Expense',
          serviceType,
          provider,
          amount,
          description: `${serviceType} at ${provider}`,
          status: ['Approved', 'Pending', 'Rejected'][Math.floor(Math.random() * 3)],
          familyMember: ['Self', 'Spouse', 'Child'][Math.floor(Math.random() * 3)],
          balance: employee.opdWalletBalance
        });
      }
    }
  });
  
  return transactions;
};

// Generate sample employee activities
const generateEmployeeActivities = (employees) => {
  const activities = [];
  const activityTypes = ['Benefit Update', 'Rule Application', 'Data Modification', 'Eligibility Update'];
  
  employees.forEach(employee => {
    const activityCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < activityCount; i++) {
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      activities.push({
        id: `activity-${employee.id}-${i + 1}`,
        employeeId: employee.id,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        type: activityType,
        description: `${activityType} performed for ${employee.name}`,
        performedBy: 'System Admin',
        details: {
          previousValue: 'N/A',
          newValue: 'Updated',
          reason: 'Corporate rule evaluation'
        }
      });
    }
  });
  
  return activities;
};

// Generate all data
const employees = generateEmployees(500);
const opdTransactions = generateOpdTransactions(employees);
const employeeActivities = generateEmployeeActivities(employees);

module.exports = {
  corporates,
  benefitGroups,
  employees,
  eligibilityRules,
  opdTransactions,
  employeeActivities
};