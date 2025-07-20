import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eligibilityAPI } from '@/services/eligibilityAPI';
import { Employee, BenefitGroup, Corporate, EligibilityRule, ProgramTerm } from '@/services/eligibilityMockData';

// Query Keys
export const QUERY_KEYS = {
  corporates: ['corporates'],
  programTerms: ['programTerms'],
  currentTerm: ['programTerms', 'current'],
  employees: (filters: any) => ['employees', filters],
  employee: (id: string) => ['employees', id],
  benefitGroups: ['benefitGroups'],
  benefitGroup: (id: string) => ['benefitGroups', id],
  eligibilityRules: ['eligibilityRules'],
  eligibilityRule: (id: string) => ['eligibilityRules', id],
  corporateSummary: (corporateId: string) => ['corporate', 'summary', corporateId],
  opdWalletOverview: ['opdWallet', 'overview'],
  opdTransactions: (filters: any) => ['opdTransactions', filters],
  dashboardSummary: ['dashboard', 'summary']
};

// Corporate Queries
export const useCorporates = () => {
  return useQuery({
    queryKey: QUERY_KEYS.corporates,
    queryFn: eligibilityAPI.corporate.getCorporates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCorporateSummary = (corporateId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.corporateSummary(corporateId),
    queryFn: () => eligibilityAPI.corporate.getCorporateSummary(corporateId),
    enabled: !!corporateId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Program Terms Queries
export const useProgramTerms = () => {
  return useQuery({
    queryKey: QUERY_KEYS.programTerms,
    queryFn: eligibilityAPI.programTerm.getProgramTerms,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCurrentProgramTerm = () => {
  return useQuery({
    queryKey: QUERY_KEYS.currentTerm,
    queryFn: eligibilityAPI.programTerm.getCurrentTerm,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Employee Queries
export const useEmployees = (filters: {
  page?: number;
  limit?: number;
  search?: string;
  corporate?: string;
  status?: string;
  benefitGroup?: string;
  location?: string;
}) => {
  return useQuery({
    queryKey: QUERY_KEYS.employees(filters),
    queryFn: () => eligibilityAPI.employee.getEmployees(filters),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true,
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.employee(id),
    queryFn: () => eligibilityAPI.employee.getEmployee(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Benefit Groups Queries
export const useBenefitGroups = () => {
  return useQuery({
    queryKey: QUERY_KEYS.benefitGroups,
    queryFn: eligibilityAPI.benefitGroup.getBenefitGroups,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBenefitGroup = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.benefitGroup(id),
    queryFn: () => eligibilityAPI.benefitGroup.getBenefitGroup(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBenefitGroupEmployees = (id: string) => {
  return useQuery({
    queryKey: ['benefitGroups', id, 'employees'],
    queryFn: () => eligibilityAPI.benefitGroup.getBenefitGroupEmployees(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Eligibility Rules Queries
export const useEligibilityRules = () => {
  return useQuery({
    queryKey: QUERY_KEYS.eligibilityRules,
    queryFn: eligibilityAPI.eligibilityRules.getRules,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEligibilityRule = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.eligibilityRule(id),
    queryFn: () => eligibilityAPI.eligibilityRules.getRule(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// OPD Wallet Queries
export const useOpdWalletOverview = () => {
  return useQuery({
    queryKey: QUERY_KEYS.opdWalletOverview,
    queryFn: eligibilityAPI.opdWallet.getWalletOverview,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOpdTransactions = (filters: {
  page?: number;
  limit?: number;
  employeeId?: string;
  corporate?: string;
  transactionType?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: QUERY_KEYS.opdTransactions(filters),
    queryFn: () => eligibilityAPI.opdWallet.getTransactions(filters),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true,
  });
};

export const useEmployeeTransactions = (employeeId: string) => {
  return useQuery({
    queryKey: ['employees', employeeId, 'transactions'],
    queryFn: () => eligibilityAPI.opdWallet.getEmployeeTransactions(employeeId),
    enabled: !!employeeId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Dashboard Queries
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardSummary,
    queryFn: eligibilityAPI.dashboard.getDashboardSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutations
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Employee> }) =>
      eligibilityAPI.employee.updateEmployee(id, updates),
    onSuccess: (data, variables) => {
      // Update the specific employee in cache
      queryClient.setQueryData(QUERY_KEYS.employee(variables.id), data);
      
      // Invalidate employees list to refresh
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useBulkUpdateEmployees = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eligibilityAPI.employee.bulkUpdateEmployees,
    onSuccess: () => {
      // Invalidate all employee-related queries
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUploadEmployees = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eligibilityAPI.employee.uploadEmployees,
    onSuccess: () => {
      // Invalidate all employee-related queries
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['corporate'] });
    },
  });
};

export const useCreateBenefitGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eligibilityAPI.benefitGroup.createBenefitGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.benefitGroups });
    },
  });
};

export const useUpdateBenefitGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BenefitGroup> }) =>
      eligibilityAPI.benefitGroup.updateBenefitGroup(id, updates),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(QUERY_KEYS.benefitGroup(variables.id), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.benefitGroups });
    },
  });
};

export const useDeleteBenefitGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eligibilityAPI.benefitGroup.deleteBenefitGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.benefitGroups });
    },
  });
};

export const useCreateEligibilityRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eligibilityAPI.eligibilityRules.createRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.eligibilityRules });
    },
  });
};

export const useUpdateEligibilityRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EligibilityRule> }) =>
      eligibilityAPI.eligibilityRules.updateRule(id, updates),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(QUERY_KEYS.eligibilityRule(variables.id), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.eligibilityRules });
    },
  });
};

export const useDeleteEligibilityRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eligibilityAPI.eligibilityRules.deleteRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.eligibilityRules });
    },
  });
};

export const useTestEligibilityRule = () => {
  return useMutation({
    mutationFn: eligibilityAPI.eligibilityRules.testRule,
  });
};

export const useAllocateWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eligibilityAPI.opdWallet.allocateWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.opdWalletOverview });
      queryClient.invalidateQueries({ queryKey: ['opdTransactions'] });
    },
  });
};