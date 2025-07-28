import { Building2, Users, MapPin, Stethoscope, UserCheck, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Corporates } from './masterdata/Corporates';
import { Entities } from './masterdata/Entities';
import { Locations } from './masterdata/Locations';
import { Services } from './masterdata/Services';
import { HRContacts } from './masterdata/HRContacts';

export const Masters = () => {
  return (
    <div>
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <strong>Master data is view-only.</strong> Changes must be made in the source system.
        </div>
      </div>

      <Tabs defaultValue="corporates" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="corporates" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="entities" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Entities
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Service Types
          </TabsTrigger>
          <TabsTrigger value="hr-contacts" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            HR Contacts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="corporates" className="mt-6">
          <Corporates />
        </TabsContent>
        
        <TabsContent value="entities" className="mt-6">
          <Entities />
        </TabsContent>
        
        <TabsContent value="locations" className="mt-6">
          <Locations />
        </TabsContent>
        
        <TabsContent value="services" className="mt-6">
          <Services />
        </TabsContent>
        
        <TabsContent value="hr-contacts" className="mt-6">
          <HRContacts />
        </TabsContent>
      </Tabs>
    </div>
  );
};