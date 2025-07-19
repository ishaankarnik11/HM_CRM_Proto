import { useState } from 'react';
import { DollarSign, Search, Download, Eye, Filter, Package, ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

interface Service {
  id: string;
  code: string;
  name: string;
  serviceType: 'AHC' | 'PEC' | 'OPD' | 'Additional Tests';
  packageCategory: 'Standard' | 'Premium' | 'Executive';
  baseRate: number;
  gstRate: number;
  hsnCode: string;
}

interface ServicesProps {
  onBack?: () => void;
}

export const Services = ({ onBack }: ServicesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [packageCategoryFilter, setPackageCategoryFilter] = useState('all');

  // Mock data - in real implementation, this would come from API
  const generateServices = (): Service[] => {
    const serviceNames = {
      'AHC': [
        'Annual Health Checkup - Basic', 'Annual Health Checkup - Standard', 'Annual Health Checkup - Premium',
        'Annual Health Checkup - Executive', 'Comprehensive Health Screening', 'Executive Health Package',
        'Senior Citizen Health Checkup', 'Women\'s Health Package', 'Men\'s Health Package',
        'Corporate Health Screening', 'Preventive Health Checkup', 'Full Body Checkup',
        'Master Health Checkup', 'Wellness Health Package', 'VIP Health Screening'
      ],
      'PEC': [
        'Pre-Employment Checkup - Basic', 'Pre-Employment Checkup - Standard', 'Pre-Employment Checkup - Premium',
        'Pre-Employment Medical - Industry', 'Pre-Employment Medical - IT', 'Pre-Employment Medical - Manufacturing',
        'Pre-Employment Medical - Healthcare', 'Pre-Employment Medical - Banking', 'Pre-Employment Medical - Retail',
        'Pre-Employment Medical - Government', 'Pre-Employment Medical - Aviation', 'Pre-Employment Medical - Marine',
        'Pre-Employment Medical - Mining', 'Pre-Employment Medical - Construction', 'Pre-Employment Medical - Food Industry'
      ],
      'OPD': [
        'General Consultation', 'Specialist Consultation', 'Follow-up Consultation', 'Second Opinion',
        'Telemedicine Consultation', 'Emergency Consultation', 'Pediatric Consultation', 'Geriatric Consultation',
        'Cardiac Consultation', 'Orthopedic Consultation', 'Neurological Consultation', 'Dermatology Consultation',
        'Gynecology Consultation', 'ENT Consultation', 'Ophthalmology Consultation'
      ],
      'Additional Tests': [
        'Cardiac Stress Test', 'Advanced Blood Panel', 'Liver Function Test', 'Kidney Function Test',
        'Thyroid Function Test', 'Diabetes Panel', 'Lipid Profile', 'Vitamin D Test', 'Vitamin B12 Test',
        'Iron Studies', 'Tumor Markers', 'Hormone Panel', 'Allergy Testing', 'Bone Density Test',
        'CT Scan', 'MRI Scan', 'Ultrasound', 'X-Ray', 'ECG', 'ECHO', 'Pulmonary Function Test',
        'Endoscopy', 'Colonoscopy', 'Mammography', 'Pap Smear', 'PSA Test', 'HbA1c Test',
        'Creatinine Test', 'Uric Acid Test', 'ESR Test', 'CRP Test', 'Hepatitis Panel',
        'HIV Test', 'VDRL Test', 'Pregnancy Test', 'Urine Analysis', 'Stool Analysis'
      ]
    };

    const packageCategories = ['Standard', 'Premium', 'Executive'];
    const gstRates = [5, 12, 18, 28];
    const hsnCodes = ['998721', '998722', '998723', '998724', '998725', '998726', '998727', '998728', '998729', '998730'];

    const baseRates = {
      'AHC': { 'Standard': [2500, 3000, 3500, 4000], 'Premium': [4500, 5000, 5500, 6000], 'Executive': [7500, 8000, 8500, 9000] },
      'PEC': { 'Standard': [1800, 2000, 2200, 2400], 'Premium': [2800, 3000, 3200, 3500], 'Executive': [4000, 4500, 5000, 5500] },
      'OPD': { 'Standard': [800, 1000, 1200, 1500], 'Premium': [1500, 1800, 2000, 2500], 'Executive': [2500, 3000, 3500, 4000] },
      'Additional Tests': { 'Standard': [500, 800, 1200, 1500], 'Premium': [1500, 2000, 2500, 3000], 'Executive': [3000, 3500, 4000, 4500] }
    };

    const services: Service[] = [];
    let counter = 1;

    // Generate services for each type
    Object.keys(serviceNames).forEach(serviceType => {
      const names = serviceNames[serviceType as keyof typeof serviceNames];
      names.forEach(name => {
        packageCategories.forEach(packageCategory => {
          const rates = baseRates[serviceType as keyof typeof baseRates][packageCategory as keyof typeof baseRates['AHC']];
          const baseRate = rates[Math.floor(Math.random() * rates.length)];
          const gstRate = gstRates[Math.floor(Math.random() * gstRates.length)];
          const hsnCode = hsnCodes[Math.floor(Math.random() * hsnCodes.length)];
          
          const typeCode = serviceType === 'Additional Tests' ? 'ADD' : serviceType;
          
          services.push({
            id: counter.toString(),
            code: `${typeCode}${counter.toString().padStart(3, '0')}`,
            name: name + (packageCategory !== 'Standard' ? ` - ${packageCategory}` : ''),
            serviceType: serviceType as 'AHC' | 'PEC' | 'OPD' | 'Additional Tests',
            packageCategory: packageCategory as 'Standard' | 'Premium' | 'Executive',
            baseRate: baseRate,
            gstRate: gstRate,
            hsnCode: hsnCode
          });
          
          counter++;
        });
      });
    });

    return services;
  };

  const services = generateServices();

  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm === '' || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesServiceType = serviceTypeFilter === 'all' || service.serviceType === serviceTypeFilter;
    const matchesPackageCategory = packageCategoryFilter === 'all' || service.packageCategory === packageCategoryFilter;
    
    return matchesSearch && matchesServiceType && matchesPackageCategory;
  });

  const getServiceTypeBadge = (serviceType: string) => {
    const colors = {
      'AHC': 'bg-blue-100 text-blue-700 border-blue-300',
      'PEC': 'bg-green-100 text-green-700 border-green-300',
      'OPD': 'bg-orange-100 text-orange-700 border-orange-300',
      'Additional Tests': 'bg-purple-100 text-purple-700 border-purple-300'
    };
    
    return (
      <Badge className={colors[serviceType as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300'}>
        {serviceType}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        <Breadcrumb items={[
          { label: 'Master Data', href: '/accounting' },
          { label: 'Services & Packages' }
        ]} />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Health Services & Packages</h1>
          <p className="text-text-secondary">Total Services: {services.length}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Service Type
              </label>
              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="AHC">AHC</SelectItem>
                  <SelectItem value="PEC">PEC</SelectItem>
                  <SelectItem value="OPD">OPD</SelectItem>
                  <SelectItem value="Additional Tests">Additional Tests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Package Category
              </label>
              <Select value={packageCategoryFilter} onValueChange={setPackageCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Packages ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Service Code</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Service Name</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Service Type</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Package Category</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Base Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">GST Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">HSN/SAC Code</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="py-3 px-4 text-sm text-text-primary font-medium">
                      {service.code}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary font-medium text-primary cursor-pointer hover:underline">
                      {service.name}
                    </td>
                    <td className="py-3 px-4">
                      {getServiceTypeBadge(service.serviceType)}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {service.packageCategory}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary font-medium">
                      {formatCurrency(service.baseRate)}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {service.gstRate}%
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {service.hsnCode}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-text-secondary">No services found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-secondary">
          Showing {filteredServices.length} of {services.length} results
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};