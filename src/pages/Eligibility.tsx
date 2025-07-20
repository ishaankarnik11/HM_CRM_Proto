import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import CorporateEligibilityView from "./eligibility/CorporateEligibilityView";
import { Building, Users, Shield, TrendingUp, TrendingDown, Calendar, Clock, AlertTriangle } from "lucide-react";
import { useCorporates, useProgramTerms, useCorporateSummary } from "@/hooks/useEligibilityQueries";
import { Corporate, ProgramTerm } from "@/services/eligibilityMockData";

const Eligibility = () => {
  const [selectedCorporate, setSelectedCorporate] = useState("");
  const [selectedProgramTerm, setSelectedProgramTerm] = useState("");

  // React Query hooks
  const { data: corporates = [], isLoading: corporatesLoading } = useCorporates();
  const { data: programTerms = [], isLoading: programTermsLoading } = useProgramTerms();
  
  // Get selected corporate ID for summary query
  const selectedCorporateObj = corporates.find(corp => corp.name === selectedCorporate);
  const { data: corporateSummary, isLoading: summaryLoading } = useCorporateSummary(
    selectedCorporateObj?.id || ''
  );

  // Set default selections when data loads
  useEffect(() => {
    if (corporates.length > 0 && !selectedCorporate) {
      setSelectedCorporate(corporates[0].name);
    }
  }, [corporates, selectedCorporate]);

  useEffect(() => {
    if (programTerms.length > 0 && !selectedProgramTerm) {
      const currentTerm = programTerms.find(term => term.status === 'Current');
      if (currentTerm) {
        setSelectedProgramTerm(currentTerm.id);
      }
    }
  }, [programTerms, selectedProgramTerm]);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Eligibility' }
      ]} />
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="page-title">Eligibility Management</h1>
        
        {/* Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          {/* Corporate Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            <label className="text-sm font-medium whitespace-nowrap">Corporate:</label>
            <Select value={selectedCorporate} onValueChange={setSelectedCorporate}>
              <SelectTrigger className="w-full sm:min-w-48">
                <SelectValue placeholder="Choose corporate..." />
              </SelectTrigger>
              <SelectContent>
                {corporates.map((corporate) => (
                  <SelectItem key={corporate.id} value={corporate.name}>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{corporate.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {corporate.employeeCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Program Term Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            <label className="text-sm font-medium whitespace-nowrap">Program:</label>
            <Select value={selectedProgramTerm} onValueChange={setSelectedProgramTerm}>
              <SelectTrigger className="w-full sm:min-w-44">
                <SelectValue placeholder="Choose term..." />
              </SelectTrigger>
              <SelectContent>
                {programTerms.map((term) => {
                  const getTermIcon = () => {
                    switch (term.status) {
                      case 'Current': return <Calendar className="h-4 w-4 text-green-600" />;
                      case 'Past': return <Clock className="h-4 w-4 text-gray-500" />;
                      case 'Future': return <AlertTriangle className="h-4 w-4 text-blue-600" />;
                      default: return <Calendar className="h-4 w-4" />;
                    }
                  };
                  
                  const getTermBadgeColor = () => {
                    switch (term.status) {
                      case 'Current': return 'bg-green-100 text-green-800';
                      case 'Past': return 'bg-gray-100 text-gray-600';
                      case 'Future': return 'bg-blue-100 text-blue-800';
                      default: return 'bg-gray-100 text-gray-600';
                    }
                  };

                  return (
                    <SelectItem key={term.id} value={term.id}>
                      <div className="flex items-center gap-2">
                        {getTermIcon()}
                        <span>{term.name}</span>
                        <Badge variant="secondary" className={`ml-2 ${getTermBadgeColor()}`}>
                          {term.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Past Term Warning Banner */}
      {selectedProgramTerm && programTerms.find(t => t.id === selectedProgramTerm)?.status === 'Past' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-800">Viewing Past Program Term</h3>
                <p className="text-sm text-orange-700">
                  You are viewing historical data for {programTerms.find(t => t.id === selectedProgramTerm)?.name}. 
                  Data modifications are read-only. Upload and rule changes are not permitted for past terms.
                </p>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Historical Data
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Term Warning Banner */}
      {selectedProgramTerm && programTerms.find(t => t.id === selectedProgramTerm)?.status === 'Future' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800">Future Program Term</h3>
                <p className="text-sm text-blue-700">
                  You are viewing a future program term for {programTerms.find(t => t.id === selectedProgramTerm)?.name}. 
                  Configuration changes will take effect when the term becomes active.
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Upcoming Term
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Corporate Summary Cards */}
      {corporateSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{corporateSummary.employeeCount}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+12</span>
                <span className="ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Employees
              </CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{corporateSummary.activeEmployees}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{corporateSummary.activeEmployees - corporateSummary.employeeCount + 15}</span>
                <span className="ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total OPD Wallet
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(corporateSummary.totalWalletAllocated / 100000).toFixed(1)}L</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Allocated: ₹{(corporateSummary.totalWalletAllocated / 100000).toFixed(1)}L</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Wallet Utilization
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{corporateSummary.walletUtilization}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Used: ₹{(corporateSummary.totalWalletUsed / 100000).toFixed(1)}L</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Corporate Eligibility Management */}
      <CorporateEligibilityView 
        selectedCorporate={selectedCorporate} 
        selectedProgramTerm={selectedProgramTerm}
        programTerms={programTerms}
      />
    </div>
  );
};

export default Eligibility;