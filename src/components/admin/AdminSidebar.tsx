
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { 
  Users, 
  FileCheck, 
  Activity, 
  Shield, 
  Globe, 
  HeadphonesIcon,
  BarChart3,
  X,
  Home
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  adminRole: string;
}

const AdminSidebar = ({ isOpen, onClose, activeSection, setActiveSection, adminRole }: AdminSidebarProps) => {
  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: Home, roles: ["support", "moderator", "admin", "super_admin"] },
    { id: "users", label: "User Management", icon: Users, roles: ["admin", "super_admin"] },
    { id: "kyc", label: "KYC Verification", icon: FileCheck, roles: ["moderator", "admin", "super_admin"] },
    { id: "transactions", label: "Transaction Logs", icon: Activity, roles: ["moderator", "admin", "super_admin"] },
    { id: "fraud", label: "Fraud Monitoring", icon: Shield, roles: ["moderator", "admin", "super_admin"] },
    { id: "cms", label: "Website CMS", icon: Globe, roles: ["moderator", "admin", "super_admin"] },
    { id: "support", label: "Support Tickets", icon: HeadphonesIcon, roles: ["support", "moderator", "admin", "super_admin"] },
  ];

  const hasAccess = (requiredRoles: string[]) => {
    return requiredRoles.includes(adminRole);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Role: {adminRole?.replace('_', ' ').toUpperCase()}
        </p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (!hasAccess(item.roles)) return null;
            
            return (
              <li key={item.id}>
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeSection === item.id 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveSection(item.id);
                    onClose();
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminSidebar;
