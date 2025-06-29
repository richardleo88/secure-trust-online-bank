
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignIn) {
        result = await signIn(email, password);
        // Navigate to dashboard immediately after successful sign in
        if (!result.error) {
          navigate('/dashboard', { replace: true });
        }
      } else {
        result = await signUp(email, password, fullName);
        // For sign up, user will need to confirm email first
        // The success toast is already shown in the signUp function
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">UnionTrust Bank</h1>
          <p className="text-gray-600 mt-2">Secure Banking Platform</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignIn 
                ? 'Sign in to access your secure banking dashboard' 
                : 'Join UnionTrust Bank for secure banking services'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={isSignIn ? 'signin' : 'signup'} onValueChange={(value) => setIsSignIn(value === 'signin')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <TabsContent value="signup" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isSignIn}
                    />
                  </div>
                </TabsContent>

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
                  {!isSignIn && (
                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full banking-gradient text-white"
                  disabled={loading}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? 'Processing...' : isSignIn ? 'Sign In Securely' : 'Create Account'}
                </Button>
              </form>

              {isSignIn && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="link" 
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => navigate('/')}
                  >
                    ← Back to Home
                  </Button>
                </div>
              )}
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Bank-level security with 256-bit encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy.
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
