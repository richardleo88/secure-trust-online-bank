
import { Button } from "@/components/ui/button";
import { Home, Send, CreditCard, User } from "lucide-react";

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MobileBottomNav = ({ activeSection, setActiveSection }: MobileBottomNavProps) => {
  const navItems = [
    { id: "overview", icon: Home, label: "Home" },
    { id: "actions", icon: Send, label: "Transfer" },
    { id: "atm", icon: CreditCard, label: "ATM" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              activeSection === item.id ? 'text-banking-navy bg-blue-50' : 'text-gray-600'
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
