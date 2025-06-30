
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import TransactionLogs from "@/components/admin/TransactionLogs";
import FraudMonitoring from "@/components/admin/FraudMonitoring";
import KYCVerification from "@/components/admin/KYCVerification";
import WebsiteCMS from "@/components/admin/WebsiteCMS";
import Analytics from "@/components/admin/Analytics";
import SupportTickets from "@/components/admin/SupportTickets";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertTriangle } from "lucide-react";
import UserRequestsManagement from "@/components/admin/UserRequestsManagement";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-red-700 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            You don't have administrator privileges to access this area.
          </p>
          <Button onClick={() => window.history.back()} className="w-full sm:w-auto">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm sm:text-base">Role: SUPER ADMIN</p>
              </div>
            </div>
            <Analytics />
          </div>
        );
      case "users":
        return <UserManagement adminRole="super_admin" />;
      case "requests":
        return <UserRequestsManagement adminRole="super_admin" />;
      case "kyc":
        return <KYCVerification adminRole="super_admin" />;
      case "transactions":
        return <TransactionLogs adminRole="super_admin" />;
      case "fraud":
        return <FraudMonitoring adminRole="super_admin" />;
      case "cms":
        return <WebsiteCMS adminRole="super_admin" />;
      case "support":
        return <SupportTickets adminRole="super_admin" />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AdminSidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            adminRole="super_admin"
          />
          
          <main className="flex-1 flex flex-col min-w-0">
            <AdminHeader 
              onSidebarToggle={() => setSidebarOpen(true)}
              adminRole="super_admin"
            />
            
            <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
