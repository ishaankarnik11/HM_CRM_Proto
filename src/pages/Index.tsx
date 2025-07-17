import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, Calculator } from 'lucide-react';

const Index = () => {
  return (
    <div>
      <h1 className="page-title mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="section-header">3,169</h3>
              <p className="secondary-text">Total Appointments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="section-header">2,847</h3>
              <p className="secondary-text">Medical Done</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="section-header">322</h3>
              <p className="secondary-text">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="section-header">1,245</h3>
              <p className="secondary-text">Invoices Generated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="section-header mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/appointments"
              className="flex items-center p-3 rounded-lg hover:bg-table-row-hover transition-colors"
            >
              <Calendar className="w-5 h-5 text-primary mr-3" />
              <span className="body-text">Appointment Tracker</span>
            </Link>
            <Link
              to="/accounting"
              className="flex items-center p-3 rounded-lg hover:bg-table-row-hover transition-colors"
            >
              <Calculator className="w-5 h-5 text-primary mr-3" />
              <span className="body-text">Accounting Module</span>
            </Link>
            <Link
              to="/opd-claims"
              className="flex items-center p-3 rounded-lg hover:bg-table-row-hover transition-colors"
            >
              <FileText className="w-5 h-5 text-primary mr-3" />
              <span className="body-text">OPD Claims</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="section-header mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2">
              <span className="text-text-secondary">Invoice INV-2024-07-001 generated</span>
              <span className="text-xs text-text-muted">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-text-secondary">DC Bill submitted for Apollo Diagnostics</span>
              <span className="text-xs text-text-muted">4 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-text-secondary">15 appointments completed today</span>
              <span className="text-xs text-text-muted">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
