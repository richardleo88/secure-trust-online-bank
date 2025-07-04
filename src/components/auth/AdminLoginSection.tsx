
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLoginSection = () => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminAccess = async () => {
    setLoading(true);
    const adminEmail = 'richard@gmail.com';
    const adminPassword = 'AdminSecure2024!@#';

    try {
      console.log('Starting admin login process...');
      
      const result = await signIn(adminEmail, adminPassword);
      
      if (!result.error) {
        console.log('Admin login successful');
        
        toast({
          title: "Admin Access Granted! 🔐",
          description: "Welcome to the admin dashboard!",
        });
        
        navigate('/admin', { replace: true });
      } else {
        console.error('Admin login failed:', result.error);
        toast({
          title: "Admin Login Failed",
          description: result.error.message || "Unable to authenticate admin credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Admin Login Failed",
        description: "Unable to access admin account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="font-medium text-blue-800 mb-2">Administrator Access</p>
        <p className="text-sm text-blue-700 mb-4">Quick access to admin dashboard</p>
        <Button
          onClick={handleAdminAccess}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          disabled={loading}
        >
          <Lock className="h-4 w-4 mr-2" />
          {loading ? 'Accessing Admin Dashboard...' : 'Access Admin Dashboard'}
        </Button>
      </div>
    </div>
  );
};

export default AdminLoginSection;
