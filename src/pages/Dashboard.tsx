
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import AccountOverview from "@/components/dashboard/AccountOverview";
import ActionsPanel from "@/components/dashboard/ActionsPanel";
import SecurityPanel from "@/components/dashboard/SecurityPanel";
import NotificationsCenter from "@/components/dashboard/NotificationsCenter";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import WireTransfer from "@/components/dashboard/WireTransfer";
import ACHTransfer from "@/components/dashboard/ACHTransfer";
import LocalTransfer from "@/components/dashboard/LocalTransfer";
import WesternUnion from "@/components/dashboard/WesternUnion";
import ATMCard from "@/components/dashboard/ATMCard";
import Profile from "@/components/dashboard/Profile";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import SecurityAuditPanel from "@/components/dashboard/SecurityAuditPanel";
import UserProfileHeader from "@/components/dashboard/UserProfileHeader";
import DepositSection from "@/components/dashboard/DepositSection";
import { Menu, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Dashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logActivity } = useAuth();

  // Log dashboard access
  useEffect(() => {
    if (user) {
      logActivity('dashboard_access', 'page', 'dashboard');
      console.log('User successfully accessed REAL banking dashboard with full features');
    }
  }, [user, logActivity]);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AccountOverview />;
      case "actions":
        return <ActionsPanel />;
      case "security":
        return <SecurityPanel />;
      case "security-audit":
        return <SecurityAuditPanel />;
      case "notifications":
        return <NotificationsCenter />;
      case "wire-transfer":
        return <WireTransfer />;
      case "ach-transfer":
        return <ACHTransfer />;
      case "local-transfer":
        return <LocalTransfer />;
      case "western-union":
        return <WesternUnion />;
      case "atm-card":
        return <ATMCard />;
      case "deposit":
        return <DepositSection />;
      case "profile":
        return <Profile />;
      case "history":
        return <TransactionHistory />;
      default:
        return <AccountOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <DashboardSidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
          
          <main className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(true)} 
                  className="md:hidden flex-shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-banking-navy text-base sm:text-lg font-bold truncate">
                      {t('dashboard.welcome')}, {user?.user_metadata?.full_name || 'User'}
                    </h1>
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <UserProfileHeader />
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 p-3 sm:p-4 pb-20 md:pb-4 overflow-auto">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeSection={activeSection} setActiveSection={setActiveSection} />
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
