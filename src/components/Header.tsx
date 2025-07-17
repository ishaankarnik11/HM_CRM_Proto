import { ChevronDown } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6 relative z-40">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <span className="text-lg font-semibold text-text-primary">myHealthMeter</span>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">V</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-text-primary">VISHAL</div>
            <div className="text-xs text-text-secondary">SuperAdmin</div>
          </div>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </div>
      </div>
    </header>
  );
};