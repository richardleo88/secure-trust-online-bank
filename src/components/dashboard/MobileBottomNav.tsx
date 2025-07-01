
import { Button } from "@/components/ui/button";
import { Send, ArrowLeftRight, Receipt, Menu } from "lucide-react";

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

// Custom Home icon component to match the image
const HomeIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

// Custom Transfer icon component to match the image (dollar sign with lines)
const TransferIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
    <path d="M12 18V6"/>
    <path d="M6 12h12"/>
  </svg>
);

const MobileBottomNav = ({ activeSection, setActiveSection }: MobileBottomNavProps) => {
  const navItems = [
    { id: "overview", icon: HomeIcon, label: "Accounts" },
    { id: "wire-transfer", icon: TransferIcon, label: "Transfer" },
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
    <div className="fixed bottom-0 left-0 right-0 bg-sky-200/30 backdrop-blur-md border-t border-sky-300/20 shadow-2xl md:hidden z-40 safe-area-pb">
      <div className="flex items-center justify-around py-4 px-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="lg"
            className={`flex flex-col items-center gap-2 h-auto py-3 px-3 min-w-0 flex-1 rounded-xl transition-all duration-300 ${
              activeSection === item.id || 
              (item.id === "wire-transfer" && ["wire-transfer", "ach-transfer", "western-union"].includes(activeSection)) ||
              (item.id === "local-transfer" && activeSection === "local-transfer") ||
              (item.id === "deposit" && activeSection === "deposit") ||
              (item.id === "menu" && activeSection === "profile")
                ? 'text-banking-navy bg-white/40 shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-slate-700 hover:text-banking-navy hover:bg-white/20'
            }`}
            onClick={() => handleNavClick(item)}
          >
            <item.icon className="h-6 w-6 flex-shrink-0" />
            <span className="text-sm font-medium leading-tight truncate text-center">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
