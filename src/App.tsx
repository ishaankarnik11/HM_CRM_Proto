import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ErrorProvider } from "./contexts/ErrorContext";
import Index from "./pages/Index";
import { Accounting } from "./pages/Accounting";
import { Receivables } from "./pages/Receivables";
import { DCBills } from "./pages/DCBills";
import { Employees } from "./pages/Employees";
import Eligibility from "./pages/Eligibility";
import EligibilityReports from "./pages/eligibility/EligibilityReports";
import { Breadcrumb } from "./components/Breadcrumb";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Standalone page wrappers for direct navigation
const ReceivablesPage = () => (
  <div>
    <Breadcrumb items={[
      { label: 'Home', href: '/' },
      { label: 'Accounting', href: '/accounting' },
      { label: 'Receivables' }
    ]} />
    <div className="flex justify-between items-center mb-6">
      <h1 className="page-title">Receivables</h1>
    </div>
    <Receivables />
  </div>
);

const DCBillsPage = () => (
  <div>
    <Breadcrumb items={[
      { label: 'Home', href: '/' },
      { label: 'Accounting', href: '/accounting' },
      { label: 'DC Bills & Dockets' }
    ]} />
    <div className="flex justify-between items-center mb-6">
      <h1 className="page-title">DC Bills & Dockets</h1>
    </div>
    <DCBills />
  </div>
);

const EmployeesPage = () => (
  <div>
    <Breadcrumb items={[
      { label: 'Home', href: '/' },
      { label: 'Accounting', href: '/accounting' },
      { label: 'Employees' }
    ]} />
    <div className="flex justify-between items-center mb-6">
      <h1 className="page-title">Employees</h1>
    </div>
    <Employees />
  </div>
);

const EligibilityReportsPage = () => (
  <div>
    <Breadcrumb items={[
      { label: 'Home', href: '/' },
      { label: 'Eligibility', href: '/eligibility' },
      { label: 'Reports & Analytics' }
    ]} />
    <EligibilityReports />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/accounting/receivables" element={<ReceivablesPage />} />
            <Route path="/accounting/dc-bills" element={<DCBillsPage />} />
            <Route path="/accounting/employees" element={<EmployeesPage />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/eligibility/reports" element={<EligibilityReportsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorProvider>
  </QueryClientProvider>
);

export default App;
