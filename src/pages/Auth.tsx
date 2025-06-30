
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import BankRegistrationForm from '@/components/auth/BankRegistrationForm';

const Auth = () => {
  const { t } = useTranslation();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const { signIn, signUp, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleAdminAccess = async () => {
    setLoading(true);
    const adminEmail = 'richard@gmail.com';
    const adminPassword = '123456789';

    try {
      console.log('Starting admin login process...');
      
      const result = await signIn(adminEmail, adminPassword);
      
      if (!result.error) {
        console.log('Admin login successful');
        
        toast({
          title: t('auth.adminAccessGranted') || "Admin Access Granted! 🔐",
          description: t('auth.welcomeAdmin') || "Welcome to the admin dashboard!",
        });
        
        // Navigate to admin dashboard immediately
        navigate('/admin', { replace: true });
      } else {
        console.error('Admin login failed:', result.error);
        toast({
          title: t('auth.adminLoginFailed') || "Admin Login Failed",
          description: result.error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: t('auth.adminLoginFailed') || "Admin Login Failed",
        description: t('auth.adminLoginErrorDesc') || "Unable to access admin account. Please try again.",
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
      if (isSignIn) {
        console.log('Attempting user sign in...');
        const result = await signIn(email, password);
        
        if (!result.error) {
          console.log('User login successful');
          
          toast({
            title: t('auth.welcomeBack') || "Welcome Back! 🎉",
            description: t('auth.loginSuccess') || "You have successfully signed in.",
          });
          
          // Navigate based on user type
          navigate(from, { replace: true });
        } else {
          toast({
            title: t('auth.loginFailed') || "Login Failed",
            description: result.error.message,
            variant: "destructive",
          });
        }
      } else {
        // Handle sign up
        console.log('Attempting user sign up...');
        const result = await signUp(email, password, fullName);
        
        if (!result.error) {
          console.log('User signup successful');
          toast({
            title: t('auth.accountCreated') || "Account Created Successfully! 🎉",
            description: t('auth.checkEmail') || "Please check your email for confirmation and then sign in.",
          });
          // Switch to sign in tab
          setIsSignIn(true);
          // Clear form
          setEmail('');
          setPassword('');
          setFullName('');
        } else {
          toast({
            title: t('auth.signupFailed') || "Sign Up Failed",
            description: result.error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: t('auth.error') || "Error",
        description: t('auth.unexpectedError') || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    setIsSignIn(true);
    toast({
      title: t('auth.registrationComplete') || "Registration Complete! 🎉",
      description: t('auth.registrationSuccessDesc') || "Your account has been created successfully. Check your email for account details, then sign in to continue.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('auth.bankName')}</h1>
          <p className="text-gray-600 mt-2">{t('auth.professionalBanking')}</p>
        </div>

        {!isSignIn ? (
          <BankRegistrationForm onSuccess={handleRegistrationSuccess} />
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {t('auth.welcome')}
              </CardTitle>
              <CardDescription className="text-center">
                {t('auth.signInSubtitle')}
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
                  {t('auth.userLogin')}
                </Button>
                <Button
                  type="button"
                  variant={isAdminLogin ? "default" : "outline"}
                  className="flex-1 flex items-center gap-2"
                  onClick={() => setIsAdminLogin(true)}
                >
                  <UserCheck className="h-4 w-4" />
                  {t('auth.adminLogin')}
                </Button>
              </div>

              {isAdminLogin ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="font-medium text-blue-800 mb-2">{t('auth.administratorAccess')}</p>
                    <p className="text-sm text-blue-700 mb-4">{t('auth.oneClickAccess')}</p>
                    <Button
                      onClick={handleAdminAccess}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      disabled={loading}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {loading ? t('auth.accessingAdminDashboard') : t('auth.accessAdminDashboard')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Tabs value={isSignIn ? 'signin' : 'signup'} onValueChange={(value) => setIsSignIn(value === 'signin')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
                    <TabsTrigger value="signup">{t('auth.createAccount')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('auth.email')}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('auth.enterEmail')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">{t('auth.password')}</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.enterPassword')}
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
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        disabled={loading}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {loading ? t('auth.processing') : t('auth.accessDashboard')}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder={t('auth.enterFullName')}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">{t('auth.email')}</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder={t('auth.enterEmail')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">{t('auth.password')}</Label>
                        <div className="relative">
                          <Input
                            id="signupPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.createPassword')}
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
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        disabled={loading}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {loading ? t('auth.processing') : t('auth.createAccount')}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}

              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => navigate('/')}
                >
                  {t('auth.backToHome')}
                </Button>
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
              {t('auth.dontHaveAccount')} {t('auth.createOneNow')}
            </Button>
          </div>
        )}

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>{t('auth.agreeToTerms')}</p>
          <p className="mt-2">
            {t('auth.needHelp')} {' '}
            <a href="mailto:support@uniontrust.com" className="text-blue-600 hover:underline">
              {t('auth.supportEmail')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
