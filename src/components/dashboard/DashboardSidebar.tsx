
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Home, 
  Send, 
  CreditCard, 
  History, 
  Settings, 
  User, 
  MapPin,
  Banknote,
  Shield,
  Bell
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const DashboardSidebar = ({ isOpen, onClose, activeSection, setActiveSection }: DashboardSidebarProps) => {
  const [transferMenuOpen, setTransferMenuOpen] = useState(false);

  const menuItems = [
    { id: "overview", icon: Home, label: "Dashboard", section: "overview" },
    { id: "wire-transfer", icon: Send, label: "Wire Transfer", parent: "transfer" },
    { id: "local-transfer", icon: MapPin, label: "Local Transfer", parent: "transfer" },
    { id: "western-union", icon: Banknote, label: "Western Union", parent: "transfer" },
    { id: "atm-card", icon: CreditCard, label: "ATM Card", section: "atm" },
    { id: "history", icon: History, label: "Transaction History", section: "history" },
    { id: "settings", icon: Settings, label: "Settings", section: "settings" },
    { id: "profile", icon: User, label: "Profile", section: "profile" },
  ];

  const handleMenuClick = (item: any) => {
    if (item.parent === "transfer") {
      setTransferMenuOpen(!transferMenuOpen);
    } else if (item.section) {
      setActiveSection(item.section);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:shadow-none md:border-r
      `}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 banking-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-banking-navy">UnionTrust</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Button
                variant={activeSection === item.section ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleMenuClick(item)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
              
              {item.parent === "transfer" && transferMenuOpen && (
                <div className="ml-6 mt-2 space-y-1">
                  <div className="text-sm text-banking-slate p-2">
                    Available in all USA states
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t mt-4">
            <Button
              variant={activeSection === "security" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("security")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </Button>
            <Button
              variant={activeSection === "notifications" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("notifications")}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
