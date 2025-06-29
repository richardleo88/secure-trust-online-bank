
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertTriangle } from "lucide-react";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('admin_role, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
          toast({
            title: "Error",
            description: "Failed to verify admin access",
            variant: "destructive",
          });
        }

        if (data) {
          setAdminRole(data.admin_role);
        }
      } catch (error) {
        console.error('Admin check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!adminRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have administrator privileges to access this area.
          </p>
          <Button onClick={() => window.history.back()}>
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
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Role: {adminRole?.replace('_', ' ').toUpperCase()}</p>
              </div>
            </div>
            <Analytics />
          </div>
        );
      case "users":
        return <UserManagement adminRole={adminRole} />;
      case "kyc":
        return <KYCVerification adminRole={adminRole} />;
      case "transactions":
        return <TransactionLogs adminRole={adminRole} />;
      case "fraud":
        return <FraudMonitoring adminRole={adminRole} />;
      case "cms":
        return <WebsiteCMS adminRole={adminRole} />;
      case "support":
        return <SupportTickets adminRole={adminRole} />;
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
            adminRole={adminRole}
          />
          
          <main className="flex-1 flex flex-col">
            <AdminHeader 
              onSidebarToggle={() => setSidebarOpen(true)}
              adminRole={adminRole}
            />
            
            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
