
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (!result.error) {
        toast({
          title: "Admin Login Successful! 🔐",
          description: "Welcome to the admin dashboard!",
        });
        
        navigate('/admin', { replace: true });
      } else {
        toast({
          title: "Admin Login Failed",
          description: result.error.message || "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Admin Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('richard@gmail.com');
    setPassword('123456789');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Union Trust Bank Administration</p>
        </div>

        <Card className="shadow-xl border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Sign In
            </CardTitle>
            <CardDescription className="text-red-100 text-center">
              Restricted access for authorized personnel only
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-red-50 p-4 rounded-lg text-center mb-6 border border-red-200">
              <p className="text-sm text-red-700 mb-2 font-medium">Demo Admin Account</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fillAdminCredentials}
                className="text-red-600 border-red-300 hover:bg-red-100"
              >
                Fill Admin Credentials
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-gray-700 font-medium">
                  Admin Email Address
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@uniontrust.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-gray-700 font-medium">
                  Admin Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 font-medium"
                disabled={loading}
              >
                <Shield className="h-4 w-4 mr-2" />
                {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Button
                variant="link"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Home
              </Button>
              <Button
                variant="link"
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:text-blue-800"
              >
                Regular User Login
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-red-200">
            <p className="font-medium text-red-800 mb-2">⚠️ Authorized Access Only</p>
            <p>This portal is restricted to authorized bank personnel.</p>
            <p className="mt-2">Demo: richard@gmail.com / 123456789</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
