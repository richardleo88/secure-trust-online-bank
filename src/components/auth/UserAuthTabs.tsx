
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const UserAuthTabs = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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

  const fillDemoCredentials = () => {
    setEmail('user@example.com');
    setPassword('user123');
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-sm text-blue-700 mb-2">Demo User Account</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fillDemoCredentials}
          className="text-blue-600 border-blue-200"
        >
          Fill Demo Credentials
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email') || 'Email'}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth.enterEmail') || 'Enter your email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password') || 'Password'}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t('auth.enterPassword') || 'Enter your password'}
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
          {loading ? (t('auth.processing') || 'Processing...') : (t('auth.accessDashboard') || 'Access Dashboard')}
        </Button>
      </form>
    </div>
  );
};

export default UserAuthTabs;
