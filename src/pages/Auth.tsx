
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import BankRegistrationForm from '@/components/auth/BankRegistrationForm';
import AuthHeader from '@/components/auth/AuthHeader';
import AdminLoginSection from '@/components/auth/AdminLoginSection';
import UserAuthTabs from '@/components/auth/UserAuthTabs';
import LoginToggleButtons from '@/components/auth/LoginToggleButtons';

const Auth = () => {
  const { t } = useTranslation();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegistrationSuccess = () => {
    setIsSignIn(true);
    toast({
      title: t('auth.registrationComplete') || "Registration Complete! 🎉",
      description: t('auth.registrationSuccessDesc') || "Your account has been created successfully. Please check your email to verify your account.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <AuthHeader />

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
              <LoginToggleButtons 
                isAdminLogin={isAdminLogin} 
                onToggle={setIsAdminLogin} 
              />

              {isAdminLogin ? (
                <AdminLoginSection />
              ) : (
                <UserAuthTabs />
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
