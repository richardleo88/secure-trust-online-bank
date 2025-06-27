
import { useState } from "react";
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
import { Menu } from "lucide-react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AccountOverview />;
      case "actions":
        return <ActionsPanel />;
      case "security":
        return <SecurityPanel />;
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
      case "atm":
        return <ATMCard />;
      case "profile":
        return <Profile />;
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
          
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-banking-navy">Welcome back, John</h1>
                  <p className="text-banking-slate text-sm">Manage your finances with confidence</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 banking-gradient rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">J</span>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 p-4 pb-20 md:pb-4">
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
