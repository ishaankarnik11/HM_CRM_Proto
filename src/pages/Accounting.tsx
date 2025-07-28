import { Link } from 'react-router-dom';
import { FileText, Receipt, Settings, Users } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Receivables } from './Receivables';
import { DCBills } from './DCBills';
import { Masters } from './Masters';
import { Employees } from './Employees';

export const Accounting = () => {
  return (
    <div>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Accounting' }
      ]} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Accounting</h1>
        <div className="text-sm text-text-secondary">
          Total Invoices: <span className="font-semibold text-text-primary">156</span>
        </div>
      </div>

      <Tabs defaultValue="receivables" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="receivables" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Receivables
          </TabsTrigger>
          <TabsTrigger value="dc-bills" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            DC Bills & Dockets
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="masters" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Masters
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="receivables" className="mt-6">
          <Receivables />
        </TabsContent>
        
        <TabsContent value="dc-bills" className="mt-6">
          <DCBills />
        </TabsContent>
        
        <TabsContent value="employees" className="mt-6">
          <Employees />
        </TabsContent>
        
        <TabsContent value="masters" className="mt-6">
          <Masters />
        </TabsContent>
      </Tabs>
    </div>
  );
};