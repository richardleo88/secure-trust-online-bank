
import { Button } from "@/components/ui/button";
import { Home, Send, CreditCard, User } from "lucide-react";

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MobileBottomNav = ({ activeSection, setActiveSection }: MobileBottomNavProps) => {
  const navItems = [
    { id: "overview", icon: Home, label: "Home" },
    { id: "wire-transfer", icon: Send, label: "Transfer" },
    { id: "atm", icon: CreditCard, label: "ATM" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-40 safe-area-pb">
      <div className="flex items-center justify-around py-1 px-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 min-w-0 flex-1 ${
              activeSection === item.id || 
              (item.id === "wire-transfer" && ["wire-transfer", "ach-transfer", "local-transfer", "western-union"].includes(activeSection))
                ? 'text-banking-navy bg-blue-50' : 'text-gray-600'
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs leading-tight truncate">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
