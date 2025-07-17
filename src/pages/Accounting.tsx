import { Link } from 'react-router-dom';
import { FileText, Receipt } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

export const Accounting = () => {
  return (
    <div>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Accounting' }
      ]} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="page-title">Accounting</h1>
        <div className="text-sm text-text-secondary">
          Total Invoices: <span className="font-semibold text-text-primary">1,245</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receivables Card */}
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="section-header">Receivables</h2>
              <p className="secondary-text">Generate pro-forma invoices for completed health checkups</p>
            </div>
          </div>
          
          <p className="body-text text-text-secondary mb-6">
            Create invoices for Medical Done appointments to send to corporate clients
          </p>
          
          <Link
            to="/accounting/receivables"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Manage Receivables
          </Link>
        </div>

        {/* DC Bills Card */}
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="section-header">DC Bills & Dockets</h2>
              <p className="secondary-text">Reconcile diagnostic center bills and create payment dockets</p>
            </div>
          </div>
          
          <p className="body-text text-text-secondary mb-6">
            Upload DC bills and create payment dockets for completed services
          </p>
          
          <Link
            to="/accounting/dc-bills"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Manage DC Bills
          </Link>
        </div>
      </div>
    </div>
  );
};