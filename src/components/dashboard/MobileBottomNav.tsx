
import { Button } from "@/components/ui/button";
import { Home, Send, ArrowLeftRight, Receipt, Menu } from "lucide-react";

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MobileBottomNav = ({ activeSection, setActiveSection }: MobileBottomNavProps) => {
  const navItems = [
    { id: "overview", icon: Home, label: "Accounts" },
    { id: "wire-transfer", icon: Send, label: "Transfer" },
    { id: "local-transfer", icon: ArrowLeftRight, label: "Zelle®" },
    { id: "deposit", icon: Receipt, label: "Deposit" },
    { id: "menu", icon: Menu, label: "Menu" },
  ];

  const handleNavClick = (item: any) => {
    if (item.id === "menu") {
      // For now, navigate to profile section when Menu is clicked
      setActiveSection("profile");
    } else {
      setActiveSection(item.id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-40 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-0 flex-1 ${
              activeSection === item.id || 
              (item.id === "wire-transfer" && ["wire-transfer", "ach-transfer", "western-union"].includes(activeSection)) ||
              (item.id === "local-transfer" && activeSection === "local-transfer") ||
              (item.id === "deposit" && activeSection === "deposit") ||
              (item.id === "menu" && activeSection === "profile")
                ? 'text-banking-navy bg-blue-50' : 'text-gray-600'
            }`}
            onClick={() => handleNavClick(item)}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs leading-tight truncate text-center">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
