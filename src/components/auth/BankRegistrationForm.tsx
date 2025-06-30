
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankRegistrationFormProps {
  onSuccess: () => void;
}

const BankRegistrationForm = ({ onSuccess }: BankRegistrationFormProps) => {
  const { toast } = useToast();

  const handleGetStarted = () => {
    toast({
      title: "Registration Not Available",
      description: "This is a demo app. Please use the demo credentials to sign in.",
      variant: "destructive",
    });
    onSuccess();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl text-blue-600">Demo Banking App</CardTitle>
        <CardDescription>
          This is a demonstration of UnionTrust Bank's features. Use the demo credentials to explore the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-6 rounded-lg space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-4">Demo Credentials</h3>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <p className="font-medium">Admin Account</p>
                <p className="text-sm text-gray-600">Email: admin@bank.com</p>
                <p className="text-sm text-gray-600">Password: admin123</p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <p className="font-medium">User Account</p>
                <p className="text-sm text-gray-600">Email: user@example.com</p>
                <p className="text-sm text-gray-600">Password: user123</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Use these credentials to explore the full banking experience.
          </p>
          <Button
            onClick={handleGetStarted}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Get Started with Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankRegistrationForm;
