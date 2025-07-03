import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Mail, Lock, Sparkles } from 'lucide-react';

interface RegistrationSuccessProps {
  userData: {
    fullName: string;
    email: string;
    password: string;
    accountNumber: string;
    country: string;
    city: string;
    phone: string;
    streetAddress: string;
    apartmentUnit?: string;
    zipCode: string;
    documentType: string;
    documentFile?: string;
    profilePicture?: string;
    registrationDate: string;
  };
}

const RegistrationSuccess = ({ userData }: RegistrationSuccessProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger welcome animation
    setTimeout(() => setShowAnimation(true), 500);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Welcome Animation */}
        <div className={`text-center mb-8 transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute top-0 right-1/2 animate-ping" />
            <Sparkles className="h-4 w-4 text-blue-400 absolute top-10 left-1/3 animate-ping delay-200" />
            <Sparkles className="h-5 w-5 text-pink-400 absolute top-8 right-1/3 animate-ping delay-500" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome to UnionTrust Capital!</h1>
          <p className="text-xl text-muted-foreground">Your account has been successfully created</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Details */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription className="text-white/90">
                Your new banking account details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Account Number</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-2xl font-bold text-primary tracking-wider">{userData.accountNumber}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Account Holder</span>
                  <p className="font-semibold">{userData.fullName}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Registration Date</span>
                  <p className="font-semibold">{formatDate(userData.registrationDate)}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Account Type</span>
                  <p className="font-semibold">Personal Checking Account</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Initial Balance</span>
                  <p className="font-semibold text-green-600">$0.00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal & Contact Information */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-white/90">
                Your registered details with us
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Email</span>
                  <p className="font-semibold break-all">{userData.email}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Phone</span>
                  <p className="font-semibold">{userData.phone}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground block">Address</span>
                <p className="font-semibold">
                  {userData.streetAddress}
                  {userData.apartmentUnit && `, ${userData.apartmentUnit}`}
                  <br />
                  {userData.city}, {userData.country} {userData.zipCode}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">ID Document</span>
                  <p className="font-semibold capitalize">{userData.documentType.replace('_', ' ')}</p>
                  {userData.documentFile && (
                    <p className="text-xs text-muted-foreground">{userData.documentFile}</p>
                  )}
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Profile Picture</span>
                  <p className="font-semibold">{userData.profilePicture ? 'Uploaded' : 'Not provided'}</p>
                  {userData.profilePicture && (
                    <p className="text-xs text-muted-foreground">{userData.profilePicture}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sign In Credentials */}
        <Card className="shadow-xl border-0 mt-6">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Sign In Credentials
            </CardTitle>
            <CardDescription className="text-white/90">
              Use these credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Username/Email</span>
                  <p className="font-bold text-green-800">{userData.email}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Password</span>
                  <p className="font-bold text-green-800">••••••••••</p>
                  <p className="text-xs text-muted-foreground mt-1">Use the password you created during registration</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Security Note:</strong> Keep your login credentials safe and never share them with anyone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mt-8 text-center space-y-4">
          <h3 className="text-xl font-semibold text-primary">What's Next?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="font-medium">1. Sign In</span>
              <p className="text-muted-foreground">Use your credentials to access your dashboard</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="font-medium">2. Verify Identity</span>
              <p className="text-muted-foreground">Our team will review your documents</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="font-medium">3. Start Banking</span>
              <p className="text-muted-foreground">Make deposits and enjoy our services</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 text-lg"
            >
              Sign In to Your Account
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="ml-4"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;