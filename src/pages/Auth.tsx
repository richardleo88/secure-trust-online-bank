
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BankRegistrationForm from '@/components/auth/BankRegistrationForm';

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting sign in...');
      const result = await signIn(email, password);
      
      if (!result.error) {
        // Check if user is admin after successful login
        if (isAdminLogin) {
          const { data: user } = await supabase.auth.getUser();
          if (user.user) {
            // Check if this is the specific admin email
            if (user.user.email === 'Richard@gmail.com') {
              // Ensure admin record exists
              const { data: adminData, error: adminCheckError } = await supabase
                .from('admin_users')
                .select('admin_role, is_active')
                .eq('user_id', user.user.id)
                .eq('is_active', true)
                .single();

              if (adminCheckError && adminCheckError.code === 'PGRST116') {
                // Admin record doesn't exist, create it
                const { error: createAdminError } = await supabase
                  .from('admin_users')
                  .insert({
                    user_id: user.user.id,
                    admin_role: 'super_admin',
                    is_active: true
                  });

                if (createAdminError) {
                  console.error('Error creating admin user:', createAdminError);
                  toast({
                    title: "Admin Setup Error",
                    description: "Failed to set up admin privileges. Please try again.",
                    variant: "destructive",
                  });
                  setLoading(false);
                  return;
                }
              }

              console.log('Admin login successful, redirecting to admin dashboard');
              navigate('/admin', { replace: true });
            } else {
              toast({
                title: "Access Denied",
                description: "You don't have administrator privileges.",
                variant: "destructive",
              });
              setLoading(false);
              return;
            }
          }
        } else {
          console.log('User login successful, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    setIsSignIn(true);
    toast({
      title: "Registration Complete!",
      description: "Your account has been created successfully. Please sign in to continue.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">UnionTrust Bank</h1>
          <p className="text-gray-600 mt-2">Professional Banking Services</p>
        </div>

        {!isSignIn ? (
          <BankRegistrationForm onSuccess={handleRegistrationSuccess} />
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to access your secure banking dashboard
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-4 flex gap-2">
                <Button
                  type="button"
                  variant={!isAdminLogin ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsAdminLogin(false)}
                >
                  User Login
                </Button>
                <Button
                  type="button"
                  variant={isAdminLogin ? "default" : "outline"}
                  className="flex-1 flex items-center gap-2"
                  onClick={() => setIsAdminLogin(true)}
                >
                  <UserCheck className="h-4 w-4" />
                  Admin Login
                </Button>
              </div>

              <Tabs value={isSignIn ? 'signin' : 'signup'} onValueChange={(value) => setIsSignIn(value === 'signin')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Create Account</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={isAdminLogin ? "Admin email address" : "Enter your email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isAdminLogin && (
                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                      <p className="font-medium">Admin Access</p>
                      <p>Enter your administrator credentials to access the admin dashboard</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full banking-gradient text-white"
                    disabled={loading}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {loading ? 'Processing...' : isAdminLogin ? 'Access Admin Dashboard' : 'Access Dashboard'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button 
                    variant="link" 
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => navigate('/')}
                  >
                    ← Back to Home
                  </Button>
                </div>
              </Tabs>

              <div className="mt-6 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure authentication with role-based access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isSignIn && (
          <div className="text-center mt-6">
            <Button
              variant="link"
              onClick={() => setIsSignIn(false)}
              className="text-blue-600 hover:underline"
            >
              Don't have an account? Create one now
            </Button>
          </div>
        )}

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="mt-2">
            Need help? Contact support at{' '}
            <a href="mailto:support@uniontrust.com" className="text-blue-600 hover:underline">
              support@uniontrust.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
