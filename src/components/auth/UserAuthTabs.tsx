
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const UserAuthTabs = () => {
  const { t } = useTranslation();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || '/dashboard';

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
          
          navigate(from, { replace: true });
        } else {
          toast({
            title: t('auth.loginFailed') || "Login Failed",
            description: result.error.message,
            variant: "destructive",
          });
        }
      } else {
        console.log('Attempting user sign up...');
        const result = await signUp(email, password, fullName);
        
        if (!result.error) {
          console.log('User signup successful');
          toast({
            title: t('auth.accountCreated') || "Account Created Successfully! 🎉",
            description: t('auth.checkEmail') || "Please check your email for confirmation and then sign in.",
          });
          setIsSignIn(true);
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

  return (
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
  );
};

export default UserAuthTabs;
