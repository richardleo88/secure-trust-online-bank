
import { Button } from "@/components/ui/button";
import { Send, ArrowLeftRight, Receipt, Menu } from "lucide-react";

interface MobileBottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onMenuClick?: () => void;
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

const MobileBottomNav = ({ activeSection, setActiveSection, onMenuClick }: MobileBottomNavProps) => {
  const navItems = [
    { id: "overview", icon: HomeIcon, label: "Accounts" },
    { id: "wire-transfer", icon: TransferIcon, label: "Transfer" },
    { id: "local-transfer", icon: ArrowLeftRight, label: "Zelle®" },
    { id: "deposit", icon: Receipt, label: "Deposit" },
    { id: "menu", icon: Menu, label: "Menu" },
  ];

  const handleNavClick = (item: any) => {
    if (item.id === "menu") {
      // Call the onMenuClick callback to open sidebar
      if (onMenuClick) {
        onMenuClick();
      }
    } else {
      setActiveSection(item.id);
    }
  };

  const isActive = (itemId: string) => {
    return activeSection === itemId || 
           (itemId === "wire-transfer" && ["wire-transfer", "ach-transfer", "western-union"].includes(activeSection)) ||
           (itemId === "local-transfer" && activeSection === "local-transfer") ||
           (itemId === "deposit" && activeSection === "deposit");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 backdrop-blur-md border-t border-sky-300/20 shadow-2xl md:hidden z-40 safe-area-pb">
      <div className="flex items-center justify-around py-4 px-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="lg"
            className={`flex flex-col items-center gap-2 h-auto py-4 px-4 min-w-0 flex-1 rounded-2xl transition-all duration-300 relative ${
              isActive(item.id)
                ? 'bg-white/90 shadow-xl backdrop-blur-lg border border-white/50 text-slate-700 scale-105' 
                : 'text-slate-600 hover:text-slate-700 hover:bg-white/30 hover:scale-102'
            }`}
            onClick={() => handleNavClick(item)}
          >
            {/* Premium selection background effect */}
            {isActive(item.id) && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 rounded-2xl blur-sm"></div>
            )}
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <item.icon className={`h-6 w-6 flex-shrink-0 ${isActive(item.id) ? 'text-slate-700' : 'text-slate-600'}`} />
              <span className={`text-xs font-semibold leading-tight truncate text-center ${isActive(item.id) ? 'text-slate-700' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
