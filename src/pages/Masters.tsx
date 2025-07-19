import { Building2, MapPin, DollarSign, FileText, Users, TestTube, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { Corporates } from './masterdata/Corporates';
import { DiagnosticCenters } from './masterdata/DiagnosticCenters';
import { Locations } from './masterdata/Locations';
import { Services } from './masterdata/Services';

export const Masters = () => {
  const [currentView, setCurrentView] = useState<string>('home');

  const masterDataCards = [
    {
      title: "Corporates",
      icon: Building2,
      description: "View corporate clients and their details",
      count: "150",
      color: "border-l-primary",
      iconColor: "text-primary",
      view: "corporates"
    },
    {
      title: "Diagnostic Centers",
      icon: MapPin,
      description: "Manage healthcare service providers",
      count: "125",
      color: "border-l-success",
      iconColor: "text-success",
      view: "diagnostic-centers"
    },
    {
      title: "Locations",
      icon: MapPin,
      description: "Service delivery locations",
      count: "200",
      color: "border-l-info",
      iconColor: "text-info",
      view: "locations"
    },
    {
      title: "Services & Packages",
      icon: DollarSign,
      description: "Health checkup packages and rates",
      count: "135",
      color: "border-l-warning",
      iconColor: "text-warning",
      view: "services"
    },
    {
      title: "Purchase Orders",
      icon: FileText,
      description: "Corporate purchase orders",
      count: "89 Active",
      color: "border-l-purple-500",
      iconColor: "text-purple-500",
      view: "purchase-orders"
    },
    {
      title: "HR Contacts",
      icon: Users,
      description: "Corporate HR personnel",
      count: "342",
      color: "border-l-pink-500",
      iconColor: "text-pink-500",
      view: "hr-contacts"
    },
    {
      title: "Additional Tests",
      icon: TestTube,
      description: "Supplementary medical tests",
      count: "156",
      color: "border-l-orange-500",
      iconColor: "text-orange-500",
      view: "additional-tests"
    },
    {
      title: "Company Information",
      icon: Settings,
      description: "MyHealthMeter company details",
      count: "1 Record",
      color: "border-l-gray-500",
      iconColor: "text-gray-500",
      view: "company-info"
    }
  ];

  const handleCardClick = (view: string) => {
    setCurrentView(view);
  };

  const handleViewDetails = (view: string) => {
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // Render specific views
  if (currentView === 'corporates') {
    return <Corporates onBack={handleBackToHome} />;
  }
  if (currentView === 'diagnostic-centers') {
    return <DiagnosticCenters onBack={handleBackToHome} />;
  }
  if (currentView === 'locations') {
    return <Locations onBack={handleBackToHome} />;
  }
  if (currentView === 'services') {
    return <Services onBack={handleBackToHome} />;
  }
  if (currentView === 'purchase-orders') {
    return (
      <div className="space-y-6">
        <h1 className="page-title">Purchase Orders</h1>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary">Purchase Orders screen coming soon...</p>
          <Button variant="outline" className="mt-4" onClick={handleBackToHome}>
            Back to Master Data
          </Button>
        </div>
      </div>
    );
  }
  if (currentView === 'hr-contacts') {
    return (
      <div className="space-y-6">
        <h1 className="page-title">HR Contacts</h1>
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary">HR Contacts screen coming soon...</p>
          <Button variant="outline" className="mt-4" onClick={handleBackToHome}>
            Back to Master Data
          </Button>
        </div>
      </div>
    );
  }
  if (currentView === 'additional-tests') {
    return (
      <div className="space-y-6">
        <h1 className="page-title">Additional Tests</h1>
        <div className="text-center py-12">
          <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary">Additional Tests screen coming soon...</p>
          <Button variant="outline" className="mt-4" onClick={handleBackToHome}>
            Back to Master Data
          </Button>
        </div>
      </div>
    );
  }
  if (currentView === 'company-info') {
    return (
      <div className="space-y-6">
        <h1 className="page-title">Company Information</h1>
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary">Company Information screen coming soon...</p>
          <Button variant="outline" className="mt-4" onClick={handleBackToHome}>
            Back to Master Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Master Data Management</h1>
          <p className="text-text-secondary">Manage system configuration and reference data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterDataCards.map((card, index) => (
          <Card 
            key={index} 
            className={`hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${card.color}`}
            onClick={() => handleCardClick(card.view)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-50`}>
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {card.description}
                    </CardDescription>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-text-primary">
                  {card.count}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(card.view);
                  }}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Navigation Guide</h3>
        <p className="text-sm text-text-secondary">
          Click on any card above to navigate to the respective master data screen. All screens provide read-only access to view and explore the data relationships.
        </p>
      </div>
    </div>
  );
};