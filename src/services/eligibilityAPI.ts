import mockData, { Employee, BenefitGroup, Corporate, OpdTransaction, EligibilityRule, ProgramTerm, ActivityLog, generateActivityLogs } from './eligibilityMockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Employee API endpoints
export const employeeAPI = {
  // Get all employees with pagination and filters
  getEmployees: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    corporate?: string;
    status?: string;
    benefitGroup?: string;
    location?: string;
  } = {}) => {
    await delay(800);
    
    const { page = 1, limit = 50, search, corporate, status, benefitGroup, location } = params;
    let filteredEmployees = [...mockData.employees];
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.name.toLowerCase().includes(searchLower) ||
        emp.employeeId.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (corporate) {
      filteredEmployees = filteredEmployees.filter(emp => emp.corporate === corporate);
    }
    
    if (status) {
      filteredEmployees = filteredEmployees.filter(emp => emp.eligibilityStatus === status);
    }
    
    if (benefitGroup) {
      filteredEmployees = filteredEmployees.filter(emp => emp.benefitGroup === benefitGroup);
    }
    
    if (location) {
      filteredEmployees = filteredEmployees.filter(emp => emp.location === location);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
    
    return {
      data: paginatedEmployees,
      pagination: {
        page,
        limit,
        total: filteredEmployees.length,
        totalPages: Math.ceil(filteredEmployees.length / limit)
      }
    };
  },

  // Get single employee by ID
  getEmployee: async (id: string): Promise<Employee | null> => {
    await delay(500);
    return mockData.employees.find(emp => emp.id === id) || null;
  },

  // Update employee
  updateEmployee: async (id: string, updates: Partial<Employee>): Promise<Employee> => {
    await delay(600);
    const employeeIndex = mockData.employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
      throw new Error('Employee not found');
    }
    
    mockData.employees[employeeIndex] = { ...mockData.employees[employeeIndex], ...updates };
    return mockData.employees[employeeIndex];
  },

  // Bulk update employees
  bulkUpdateEmployees: async (updates: { ids: string[]; changes: Partial<Employee> }): Promise<{ success: number; failed: number }> => {
    await delay(1200);
    let success = 0;
    let failed = 0;
    
    updates.ids.forEach(id => {
      const employeeIndex = mockData.employees.findIndex(emp => emp.id === id);
      if (employeeIndex !== -1) {
        mockData.employees[employeeIndex] = { ...mockData.employees[employeeIndex], ...updates.changes };
        success++;
      } else {
        failed++;
      }
    });
    
    return { success, failed };
  },

  // Add employees from validated data
  addEmployees: async (employees: Omit<Employee, 'id'>[]): Promise<{ success: number; failed: number; addedEmployees: Employee[] }> => {
    await delay(1500);
    
    const addedEmployees: Employee[] = [];
    let success = 0;
    let failed = 0;

    employees.forEach((empData, index) => {
      try {
        // Check if employee ID already exists
        const existingEmployee = mockData.employees.find(emp => emp.employeeId === empData.employeeId);
        if (existingEmployee) {
          failed++;
          return;
        }

        // Create new employee with generated ID
        const newEmployee: Employee = {
          ...empData,
          id: `emp-${Date.now()}-${index}`,
          eligibilityStatus: 'Active'
        };

        // Add to mock data
        mockData.employees.push(newEmployee);
        addedEmployees.push(newEmployee);
        success++;
      } catch (error) {
        failed++;
      }
    });

    return { success, failed, addedEmployees };
  },

  // Remove employees
  removeEmployees: async (employeeIds: string[]): Promise<{ success: number; failed: number }> => {
    await delay(1200);
    
    let success = 0;
    let failed = 0;

    employeeIds.forEach(empId => {
      const empIndex = mockData.employees.findIndex(emp => emp.employeeId === empId || emp.email === empId);
      if (empIndex !== -1) {
        // Soft delete - set status to Inactive
        mockData.employees[empIndex].eligibilityStatus = 'Inactive';
        success++;
      } else {
        failed++;
      }
    });

    return { success, failed };
  },

  // Update employees
  updateEmployees: async (updates: Array<{ employeeId: string; updates: Partial<Employee> }>): Promise<{ success: number; failed: number }> => {
    await delay(1300);
    
    let success = 0;
    let failed = 0;

    updates.forEach(({ employeeId, updates: empUpdates }) => {
      const empIndex = mockData.employees.findIndex(emp => emp.employeeId === employeeId || emp.email === employeeId);
      if (empIndex !== -1) {
        mockData.employees[empIndex] = { ...mockData.employees[empIndex], ...empUpdates };
        success++;
      } else {
        failed++;
      }
    });

    return { success, failed };
  },

  // Upload employees (simulate file upload)
  uploadEmployees: async (file: File): Promise<{ success: number; failed: number; errors: string[] }> => {
    await delay(2000);
    
    // Simulate file processing
    const mockResult = {
      success: Math.floor(Math.random() * 50) + 20,
      failed: Math.floor(Math.random() * 5),
      errors: [
        'Row 15: Invalid email format',
        'Row 23: Missing required field: Department',
        'Row 31: Duplicate employee ID'
      ]
    };
    
    return mockResult;
  },

  // Get activity logs for an employee
  getActivityLogs: async (employeeId: string): Promise<ActivityLog[]> => {
    await delay(600);
    
    // Generate activity logs for this employee
    return generateActivityLogs(employeeId, 15);
  },

  // Send passcode to employee
  sendPasscode: async (employeeId: string): Promise<{ success: boolean; message: string }> => {
    await delay(1000);
    
    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        message: 'Passcode sent successfully to registered mobile number'
      };
    } else {
      return {
        success: false,
        message: 'Failed to send passcode. Please check mobile number and try again.'
      };
    }
  }
};

// Benefit Groups API endpoints
export const benefitGroupAPI = {
  // Get all benefit groups
  getBenefitGroups: async (): Promise<BenefitGroup[]> => {
    await delay(600);
    return mockData.benefitGroups;
  },

  // Get single benefit group
  getBenefitGroup: async (id: string): Promise<BenefitGroup | null> => {
    await delay(500);
    return mockData.benefitGroups.find(bg => bg.id === id) || null;
  },

  // Create benefit group
  createBenefitGroup: async (benefitGroup: Omit<BenefitGroup, 'id' | 'employeeCount'>): Promise<BenefitGroup> => {
    await delay(800);
    const newBenefitGroup: BenefitGroup = {
      ...benefitGroup,
      id: `bg-${Date.now()}`,
      employeeCount: 0
    };
    
    mockData.benefitGroups.push(newBenefitGroup);
    return newBenefitGroup;
  },

  // Update benefit group
  updateBenefitGroup: async (id: string, updates: Partial<BenefitGroup>): Promise<BenefitGroup> => {
    await delay(700);
    const index = mockData.benefitGroups.findIndex(bg => bg.id === id);
    if (index === -1) {
      throw new Error('Benefit group not found');
    }
    
    mockData.benefitGroups[index] = { ...mockData.benefitGroups[index], ...updates };
    return mockData.benefitGroups[index];
  },

  // Delete benefit group
  deleteBenefitGroup: async (id: string): Promise<boolean> => {
    await delay(600);
    const index = mockData.benefitGroups.findIndex(bg => bg.id === id);
    if (index === -1) {
      throw new Error('Benefit group not found');
    }
    
    mockData.benefitGroups.splice(index, 1);
    return true;
  },

  // Get employees in benefit group
  getBenefitGroupEmployees: async (id: string): Promise<Employee[]> => {
    await delay(700);
    const benefitGroup = mockData.benefitGroups.find(bg => bg.id === id);
    if (!benefitGroup) {
      throw new Error('Benefit group not found');
    }
    
    return mockData.employees.filter(emp => emp.benefitGroup === benefitGroup.name);
  }
};

// OPD Wallet API endpoints
export const opdWalletAPI = {
  // Get wallet overview
  getWalletOverview: async () => {
    await delay(600);
    
    const totalAllocated = mockData.employees.reduce((sum, emp) => sum + emp.opdWalletAllocated, 0);
    const totalUsed = mockData.employees.reduce((sum, emp) => sum + emp.opdWalletUsed, 0);
    const totalBalance = mockData.employees.reduce((sum, emp) => sum + emp.opdWalletBalance, 0);
    
    return {
      totalAllocated,
      totalUsed,
      totalBalance,
      activeWallets: mockData.employees.filter(emp => emp.eligibilityStatus === 'Active').length,
      avgUtilization: Math.round((totalUsed / totalAllocated) * 100)
    };
  },

  // Get employee wallet transactions
  getEmployeeTransactions: async (employeeId: string): Promise<OpdTransaction[]> => {
    await delay(500);
    
    // Get existing transactions or generate more for a fuller view
    let transactions = mockData.opdTransactions.filter(txn => txn.employeeId === employeeId);
    
    // If no transactions exist, generate some mock transactions for this employee
    if (transactions.length === 0) {
      const employee = mockData.employees.find(emp => emp.id === employeeId);
      if (employee) {
        // Generate 8-12 transactions for this employee
        const transactionCount = Math.floor(Math.random() * 5) + 8;
        const serviceTypes: OpdTransaction['serviceType'][] = ['Consultation', 'Diagnostics', 'Pharmacy', 'Dental', 'Vision'];
        const transactionTypes: OpdTransaction['transactionType'][] = ['Allocation', 'Usage', 'Adjustment'];
        const providers = ['Apollo Hospital', 'Max Healthcare', 'Fortis Hospital', 'Medanta', 'AIIMS', 'Local Clinic', 'City Hospital'];
        
        for (let i = 0; i < transactionCount; i++) {
          const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
          const transactionType = i === 0 ? 'Allocation' : (Math.random() > 0.2 ? 'Usage' : 'Adjustment');
          const provider = providers[Math.floor(Math.random() * providers.length)];
          const daysAgo = Math.floor(Math.random() * 180); // Last 6 months
          
          let amount: number;
          let description: string;
          
          if (transactionType === 'Allocation') {
            amount = employee.opdWalletAllocated;
            description = 'Annual OPD wallet allocation';
          } else if (transactionType === 'Adjustment') {
            amount = Math.floor(Math.random() * 2000) + 500;
            description = 'Wallet adjustment - Previous claim reimbursement';
          } else {
            switch (serviceType) {
              case 'Consultation':
                amount = Math.floor(Math.random() * 1500) + 500;
                description = `Consultation at ${provider}`;
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
              default:
                amount = 500;
                description = `Healthcare service at ${provider}`;
            }
          }
          
          // Calculate running balance
          const previousTransactions = transactions.slice(0, i);
          let balance = employee.opdWalletAllocated;
          previousTransactions.forEach(txn => {
            if (txn.transactionType === 'Usage') {
              balance -= txn.amount;
            } else if (txn.transactionType === 'Adjustment') {
              balance += txn.amount;
            }
          });
          
          if (transactionType === 'Usage') {
            balance -= amount;
          } else if (transactionType === 'Adjustment') {
            balance += amount;
          }
          
          transactions.push({
            id: `txn-${employeeId}-${i + 1}`,
            employeeId: employee.id,
            employeeName: employee.name,
            corporate: employee.corporate,
            transactionType,
            serviceType,
            amount,
            balance: Math.max(balance, 0),
            description,
            date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            providerName: transactionType === 'Usage' ? provider : undefined,
            familyMember: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Spouse' : 'Child') : undefined
          });
        }
        
        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    }
    
    return transactions;
  },

  // Get employee wallet summary
  getEmployeeWalletSummary: async (employeeId: string): Promise<{
    allocated: number;
    used: number;
    balance: number;
    lastTransaction?: string;
    totalTransactions: number;
  }> => {
    await delay(400);
    
    const employee = mockData.employees.find(emp => emp.id === employeeId);
    const transactions = await opdWalletAPI.getEmployeeTransactions(employeeId);
    
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    const lastTransaction = transactions.length > 0 ? transactions[0].date : undefined;
    
    return {
      allocated: employee.opdWalletAllocated,
      used: employee.opdWalletUsed,
      balance: employee.opdWalletBalance,
      lastTransaction,
      totalTransactions: transactions.length
    };
  },

  // Get all transactions with filters
  getTransactions: async (params: {
    page?: number;
    limit?: number;
    employeeId?: string;
    corporate?: string;
    transactionType?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}) => {
    await delay(700);
    
    const { page = 1, limit = 50, employeeId, corporate, transactionType, dateFrom, dateTo } = params;
    let filteredTransactions = [...mockData.opdTransactions];
    
    if (employeeId) {
      filteredTransactions = filteredTransactions.filter(txn => txn.employeeId === employeeId);
    }
    
    if (corporate) {
      filteredTransactions = filteredTransactions.filter(txn => txn.corporate === corporate);
    }
    
    if (transactionType) {
      filteredTransactions = filteredTransactions.filter(txn => txn.transactionType === transactionType);
    }
    
    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(txn => txn.date >= dateFrom);
    }
    
    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(txn => txn.date <= dateTo);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    return {
      data: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      }
    };
  },

  // Allocate wallet amount
  allocateWallet: async (allocations: { employeeIds: string[]; amount: number }): Promise<{ success: number; failed: number }> => {
    await delay(1000);
    let success = 0;
    let failed = 0;
    
    allocations.employeeIds.forEach(id => {
      const employee = mockData.employees.find(emp => emp.id === id);
      if (employee) {
        employee.opdWalletAllocated = allocations.amount;
        employee.opdWalletBalance = allocations.amount - employee.opdWalletUsed;
        success++;
      } else {
        failed++;
      }
    });
    
    return { success, failed };
  }
};

// Eligibility Rules API endpoints
export const eligibilityRulesAPI = {
  // Get all rules
  getRules: async (): Promise<EligibilityRule[]> => {
    await delay(600);
    return mockData.eligibilityRules;
  },

  // Get single rule
  getRule: async (id: string): Promise<EligibilityRule | null> => {
    await delay(500);
    return mockData.eligibilityRules.find(rule => rule.id === id) || null;
  },

  // Create rule
  createRule: async (rule: Omit<EligibilityRule, 'id' | 'lastModified' | 'modifiedBy'>): Promise<EligibilityRule> => {
    await delay(800);
    const newRule: EligibilityRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: 'Current User'
    };
    
    mockData.eligibilityRules.push(newRule);
    return newRule;
  },

  // Update rule
  updateRule: async (id: string, updates: Partial<EligibilityRule>): Promise<EligibilityRule> => {
    await delay(700);
    const index = mockData.eligibilityRules.findIndex(rule => rule.id === id);
    if (index === -1) {
      throw new Error('Rule not found');
    }
    
    mockData.eligibilityRules[index] = {
      ...mockData.eligibilityRules[index],
      ...updates,
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: 'Current User'
    };
    
    return mockData.eligibilityRules[index];
  },

  // Delete rule
  deleteRule: async (id: string): Promise<boolean> => {
    await delay(600);
    const index = mockData.eligibilityRules.findIndex(rule => rule.id === id);
    if (index === -1) {
      throw new Error('Rule not found');
    }
    
    mockData.eligibilityRules.splice(index, 1);
    return true;
  },

  // Test rule against employees
  testRule: async (rule: Omit<EligibilityRule, 'id' | 'lastModified' | 'modifiedBy'>): Promise<{ matchedEmployees: Employee[]; totalMatched: number }> => {
    await delay(1000);
    
    // Simulate rule testing logic with actual criteria evaluation
    const matchedEmployees = mockData.employees.filter(employee => {
      return rule.conditions.every(condition => {
        switch (condition.parameter) {
          case 'Age':
            const age = employee.age;
            switch (condition.operator) {
              case 'greater_than': return age > Number(condition.value);
              case 'less_than': return age < Number(condition.value);
              case 'equals': return age === Number(condition.value);
              case 'not_equals': return age !== Number(condition.value);
              default: return false;
            }
          case 'Service Period':
            const servicePeriod = parseInt(employee.servicePeriod.split(' ')[0]);
            switch (condition.operator) {
              case 'greater_than': return servicePeriod > Number(condition.value);
              case 'less_than': return servicePeriod < Number(condition.value);
              case 'equals': return servicePeriod === Number(condition.value);
              case 'not_equals': return servicePeriod !== Number(condition.value);
              default: return false;
            }
          case 'Department':
            if (condition.operator === 'in_list' && Array.isArray(condition.value)) {
              return condition.value.includes(employee.department);
            }
            switch (condition.operator) {
              case 'equals': return employee.department === condition.value;
              case 'not_equals': return employee.department !== condition.value;
              case 'contains': return employee.department.toLowerCase().includes(String(condition.value).toLowerCase());
              default: return false;
            }
          case 'Location':
            if (condition.operator === 'in_list' && Array.isArray(condition.value)) {
              return condition.value.includes(employee.location);
            }
            switch (condition.operator) {
              case 'equals': return employee.location === condition.value;
              case 'not_equals': return employee.location !== condition.value;
              case 'contains': return employee.location.toLowerCase().includes(String(condition.value).toLowerCase());
              default: return false;
            }
          case 'Designation':
            if (condition.operator === 'in_list' && Array.isArray(condition.value)) {
              return condition.value.includes(employee.designation);
            }
            switch (condition.operator) {
              case 'equals': return employee.designation === condition.value;
              case 'not_equals': return employee.designation !== condition.value;
              case 'contains': return employee.designation.toLowerCase().includes(String(condition.value).toLowerCase());
              default: return false;
            }
          case 'Corporate':
            switch (condition.operator) {
              case 'equals': return employee.corporate === condition.value;
              case 'not_equals': return employee.corporate !== condition.value;
              case 'contains': return employee.corporate.toLowerCase().includes(String(condition.value).toLowerCase());
              default: return false;
            }
          default:
            return false;
        }
      });
    });
    
    return {
      matchedEmployees,
      totalMatched: matchedEmployees.length
    };
  },

  // Evaluate rule and apply actions
  evaluateRule: async (ruleId: string): Promise<{ 
    success: boolean; 
    matchedEmployees: number; 
    appliedActions: number; 
    errors: string[] 
  }> => {
    await delay(1500);
    
    const rule = mockData.eligibilityRules.find(r => r.id === ruleId);
    if (!rule) {
      throw new Error('Rule not found');
    }

    if (!rule.isActive) {
      throw new Error('Cannot evaluate inactive rule');
    }

    // Test the rule first
    const testResult = await eligibilityRulesAPI.testRule(rule);
    
    // Simulate applying actions to matched employees
    let appliedActions = 0;
    const errors: string[] = [];
    
    testResult.matchedEmployees.forEach((employee, index) => {
      rule.actions.forEach(action => {
        try {
          switch (action.type) {
            case 'Assign Benefit Group':
              // Find employee in mockData and update
              const empIndex = mockData.employees.findIndex(e => e.id === employee.id);
              if (empIndex !== -1) {
                mockData.employees[empIndex].benefitGroup = action.value as string;
                appliedActions++;
              }
              break;
            case 'Set Wallet Amount':
              const empIndexWallet = mockData.employees.findIndex(e => e.id === employee.id);
              if (empIndexWallet !== -1) {
                const newAmount = Number(action.value);
                mockData.employees[empIndexWallet].opdWalletAllocated = newAmount;
                mockData.employees[empIndexWallet].opdWalletBalance = newAmount - mockData.employees[empIndexWallet].opdWalletUsed;
                appliedActions++;
              }
              break;
            // Additional action types can be implemented here
            default:
              appliedActions++;
          }
        } catch (error) {
          errors.push(`Failed to apply action ${action.type} to employee ${employee.employeeId}: ${error}`);
        }
      });
    });

    // Update rule's last modified timestamp
    const ruleIndex = mockData.eligibilityRules.findIndex(r => r.id === ruleId);
    if (ruleIndex !== -1) {
      mockData.eligibilityRules[ruleIndex].lastModified = new Date().toISOString().split('T')[0];
    }

    return {
      success: errors.length === 0,
      matchedEmployees: testResult.totalMatched,
      appliedActions,
      errors
    };
  },

  // Bulk archive rules
  bulkArchiveRules: async (ruleIds: string[]): Promise<{ success: number; failed: number; errors: string[] }> => {
    await delay(800);
    
    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    
    ruleIds.forEach(ruleId => {
      const ruleIndex = mockData.eligibilityRules.findIndex(r => r.id === ruleId);
      if (ruleIndex !== -1) {
        mockData.eligibilityRules[ruleIndex].isActive = false;
        mockData.eligibilityRules[ruleIndex].lastModified = new Date().toISOString().split('T')[0];
        mockData.eligibilityRules[ruleIndex].modifiedBy = 'Current User';
        success++;
      } else {
        failed++;
        errors.push(`Rule with ID ${ruleId} not found`);
      }
    });
    
    return { success, failed, errors };
  },

  // Get affected employee count for a rule
  getAffectedEmployeeCount: async (ruleId: string): Promise<number> => {
    await delay(300);
    
    const rule = mockData.eligibilityRules.find(r => r.id === ruleId);
    if (!rule) {
      return 0;
    }
    
    const testResult = await eligibilityRulesAPI.testRule(rule);
    return testResult.totalMatched;
  }
};

// Program Terms API endpoints
export const programTermAPI = {
  // Get all program terms
  getProgramTerms: async (): Promise<ProgramTerm[]> => {
    await delay(400);
    return mockData.programTerms;
  },

  // Get current program term
  getCurrentTerm: async (): Promise<ProgramTerm> => {
    await delay(300);
    return mockData.programTerms.find(term => term.status === 'Current') || mockData.programTerms[0];
  },

  // Get program term by ID
  getProgramTerm: async (id: string): Promise<ProgramTerm | null> => {
    await delay(300);
    return mockData.programTerms.find(term => term.id === id) || null;
  }
};

// Corporate API endpoints
export const corporateAPI = {
  // Get all corporates
  getCorporates: async (): Promise<Corporate[]> => {
    await delay(500);
    return mockData.corporates;
  },

  // Get corporate summary
  getCorporateSummary: async (corporateId: string) => {
    await delay(600);
    const corporate = mockData.corporates.find(corp => corp.id === corporateId);
    if (!corporate) {
      throw new Error('Corporate not found');
    }
    
    const employees = mockData.employees.filter(emp => emp.corporate === corporate.name);
    const activeEmployees = employees.filter(emp => emp.eligibilityStatus === 'Active');
    const totalWalletAllocated = employees.reduce((sum, emp) => sum + emp.opdWalletAllocated, 0);
    const totalWalletUsed = employees.reduce((sum, emp) => sum + emp.opdWalletUsed, 0);
    
    return {
      corporate,
      employeeCount: employees.length,
      activeEmployees: activeEmployees.length,
      totalWalletAllocated,
      totalWalletUsed,
      walletUtilization: Math.round((totalWalletUsed / totalWalletAllocated) * 100)
    };
  }
};

// Reports API endpoints
export const reportsAPI = {
  // Generate eligibility status report
  generateEligibilityReport: async (params: {
    corporate?: string;
    dateFrom?: string;
    dateTo?: string;
    format: 'pdf' | 'excel' | 'csv';
  }) => {
    await delay(2000);
    
    // Simulate report generation
    return {
      reportId: `report-${Date.now()}`,
      downloadUrl: `/api/reports/download/report-${Date.now()}.${params.format}`,
      generatedAt: new Date().toISOString(),
      recordCount: Math.floor(Math.random() * 1000) + 500
    };
  },

  // Get report templates
  getReportTemplates: async () => {
    await delay(400);
    return [
      { id: 'template-1', name: 'Eligibility Status Report', description: 'Complete employee eligibility status' },
      { id: 'template-2', name: 'OPD Wallet Utilization', description: 'OPD wallet usage and balance report' },
      { id: 'template-3', name: 'Employee Benefits Summary', description: 'Summary of benefits by employee' },
      { id: 'template-4', name: 'Corporate Analytics', description: 'Corporate-wise eligibility analytics' },
      { id: 'template-5', name: 'Audit Trail Report', description: 'Complete audit trail of changes' }
    ];
  },

  // Generate any report template
  generateReport: async (templateId: string, params: {
    corporate?: string;
    dateFrom?: string;
    dateTo?: string;
    format: 'pdf' | 'excel' | 'csv';
    benefitGroup?: string;
    department?: string;
    [key: string]: any;
  }) => {
    await delay(Math.random() * 3000 + 2000); // 2-5 seconds
    
    // Simulate different success rates
    const successRate = 0.9;
    if (Math.random() > successRate) {
      throw new Error('Report generation failed');
    }
    
    return {
      reportId: `report-${Date.now()}`,
      downloadUrl: `/api/reports/download/${templateId}-${Date.now()}.${params.format}`,
      generatedAt: new Date().toISOString(),
      recordCount: Math.floor(Math.random() * 1000) + 500,
      fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      status: 'completed'
    };
  },

  // Download report
  downloadReport: async (reportId: string) => {
    await delay(500);
    // In real implementation, this would return a blob or file URL
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent('Sample report content for ' + reportId)}`;
    link.download = `report-${reportId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  },

  // Share report via email
  shareReport: async (reportId: string, emails: string[], message?: string) => {
    await delay(1000);
    console.log(`Sharing report ${reportId} with emails:`, emails, 'Message:', message);
    return {
      success: true,
      emailsSent: emails.length,
      timestamp: new Date().toISOString()
    };
  },

  // Schedule report generation
  scheduleReport: async (templateId: string, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    emails: string[];
    parameters: Record<string, any>;
  }) => {
    await delay(800);
    return {
      scheduleId: `schedule-${Date.now()}`,
      templateId,
      schedule,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isActive: true
    };
  },

  // Get scheduled reports
  getScheduledReports: async () => {
    await delay(600);
    return [
      {
        id: 'schedule-001',
        templateName: 'Daily Eligibility Status',
        frequency: 'daily',
        time: '09:00',
        nextRun: '2024-01-16T09:00:00Z',
        isActive: true,
        emails: ['admin@company.com'],
        lastRun: '2024-01-15T09:00:00Z',
        status: 'success'
      },
      {
        id: 'schedule-002',
        templateName: 'Weekly OPD Utilization',
        frequency: 'weekly',
        time: '18:00',
        nextRun: '2024-01-21T18:00:00Z',
        isActive: true,
        emails: ['finance@company.com', 'hr@company.com'],
        lastRun: '2024-01-14T18:00:00Z',
        status: 'success'
      }
    ];
  }
};

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard summary
  getDashboardSummary: async () => {
    await delay(800);
    
    const totalEmployees = mockData.employees.length;
    const activeEligibilities = mockData.employees.filter(emp => emp.eligibilityStatus === 'Active').length;
    const pendingValidations = mockData.employees.filter(emp => emp.eligibilityStatus === 'Pending').length;
    const totalOpdWallet = mockData.employees.reduce((sum, emp) => sum + emp.opdWalletBalance, 0);
    
    return {
      totalEmployees,
      activeEligibilities,
      pendingValidations,
      totalOpdWallet,
      eligibilityStatusDistribution: {
        Active: activeEligibilities,
        Inactive: mockData.employees.filter(emp => emp.eligibilityStatus === 'Inactive').length,
        Pending: pendingValidations,
        Suspended: mockData.employees.filter(emp => emp.eligibilityStatus === 'Suspended').length
      },
      opdWalletByCorporate: mockData.corporates.map(corp => ({
        corporate: corp.name,
        totalWallet: mockData.employees
          .filter(emp => emp.corporate === corp.name)
          .reduce((sum, emp) => sum + emp.opdWalletBalance, 0)
      }))
    };
  }
};

export const eligibilityAPI = {
  employee: employeeAPI,
  benefitGroup: benefitGroupAPI,
  opdWallet: opdWalletAPI,
  eligibilityRules: eligibilityRulesAPI,
  corporate: corporateAPI,
  programTerm: programTermAPI,
  reports: reportsAPI,
  dashboard: dashboardAPI
};