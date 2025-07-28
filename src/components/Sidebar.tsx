import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  User, 
  FileText, 
  Calculator, 
  BarChart,
  Settings,
  Shield
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Appointment Tracker', href: '/appointments', icon: Calendar },
  { name: 'Eligibility', href: '/eligibility', icon: Shield },
  { name: 'Accounting', href: '/accounting', icon: Calculator },
  { name: 'Reports', href: '/reports', icon: BarChart },
  { name: 'Onsite Onboarding', href: '/onsite', icon: Users },
  { name: 'Offline Onboarding', href: '/offline', icon: User },
  { name: 'OPD Claims', href: '/opd-claims', icon: FileText },
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="fixed w-64 bg-sidebar border-r border-border h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href === '/accounting' && location.pathname.startsWith('/accounting')) ||
                          (item.href === '/eligibility' && location.pathname.startsWith('/eligibility'));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
        
        {/* Settings at bottom */}
        <div className="pt-8">
          <Link
            to="/settings"
            className={`nav-item ${location.pathname === '/settings' ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </div>
      </nav>
    </div>
  );
};