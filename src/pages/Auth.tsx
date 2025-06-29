
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
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleAdminAccess = async () => {
    setLoading(true);
    // Use proper email format (lowercase)
    const adminEmail = 'richard@gmail.com';
    const adminPassword = '123456789';

    try {
      console.log('Starting admin account setup process...');
      
      // First, try to sign up the admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: 'Richard Admin'
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      // If signup succeeds or user already exists, try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (signInError) {
        console.error('Admin sign in failed:', signInError);
        toast({
          title: "Admin Login Failed",
          description: signInError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Admin signed in successfully');

      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('Failed to get user data:', userError);
        setLoading(false);
        return;
      }

      // Create admin record in admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({
          user_id: userData.user.id,
          admin_role: 'super_admin',
          is_active: true
        }, {
          onConflict: 'user_id'
        });

      if (adminError) {
        console.error('Error creating admin user:', adminError);
      } else {
        console.log('Admin user record created/updated successfully');
      }

      // Ensure profile exists with proper data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          email: adminEmail,
          full_name: 'Richard Admin',
          balance: 50000.00,
          account_number: 'ADMIN-' + Math.random().toString(36).substr(2, 8).toUpperCase()
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
      } else {
        console.log('Admin profile created/updated successfully');
      }

      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard!",
      });
      
      // Navigate to admin dashboard
      navigate('/admin', { replace: true });

    } catch (error) {
      console.error('Admin setup error:', error);
      toast({
        title: "Admin Setup Failed",
        description: "Unable to create admin account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting user sign in...');
      const result = await signIn(email, password);
      
      if (!result.error) {
        console.log('User login successful, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
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

              {isAdminLogin ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="font-medium text-blue-800 mb-2">Administrator Access</p>
                    <p className="text-sm text-blue-700 mb-4">One-click access to admin dashboard with full privileges</p>
                    <Button
                      onClick={handleAdminAccess}
                      className="w-full banking-gradient text-white"
                      disabled={loading}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {loading ? 'Setting Up Admin Access...' : 'Access Admin Dashboard'}
                    </Button>
                  </div>
                </div>
              ) : (
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
                        placeholder="Enter your email"
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

                    <Button
                      type="submit"
                      className="w-full banking-gradient text-white"
                      disabled={loading}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {loading ? 'Processing...' : 'Access Dashboard'}
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
              )}

              <div className="mt-6 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure authentication with role-based access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isSignIn && !isAdminLogin && (
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
