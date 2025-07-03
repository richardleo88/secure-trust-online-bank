import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Upload, UserPlus, MapPin, FileText, Camera } from 'lucide-react';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  streetAddress: string;
  apartmentUnit: string;
  zipCode: string;
  documentType: string;
  termsAccepted: boolean;
}

interface ComprehensiveSignUpFormProps {
  onSuccess: (userData: any) => void;
}

const countries = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', dialCode: '+52' },
];

const cities: Record<string, string[]> = {
  US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
  CA: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Edmonton'],
  GB: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool'],
  AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
  DE: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart'],
  FR: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes'],
  JP: ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Kobe'],
  IN: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'],
  BR: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte'],
  MX: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León'],
};

const ComprehensiveSignUpForm = ({ onSuccess }: ComprehensiveSignUpFormProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SignUpFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  
  const documentInputRef = useRef<HTMLInputElement>(null);
  const profilePictureRef = useRef<HTMLInputElement>(null);
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const watchedFields = watch();
  const totalSteps = 4;

  // Calculate progress based on filled fields
  const calculateProgress = () => {
    const requiredFields = [
      'firstName', 'lastName', 'country', 'city', 'phone', 'email', 
      'password', 'confirmPassword', 'streetAddress', 'zipCode'
    ];
    const filledFields = requiredFields.filter(field => watchedFields[field as keyof SignUpFormData]);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  // Update progress when fields change
  useState(() => {
    setProgress(calculateProgress());
  });

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!data.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setProgress(100);

    try {
      // Generate account number
      const accountNumber = 'ACC' + Date.now().toString().slice(-8);
      
      const fullName = `${data.firstName} ${data.lastName}`;
      const result = await signUp(data.email, data.password, fullName);
      
      if (!result.error) {
        // Prepare user data for success page
        const userData = {
          ...data,
          fullName,
          accountNumber,
          documentFile: documentFile?.name,
          profilePicture: profilePicture?.name,
          registrationDate: new Date().toISOString(),
        };
        
        setTimeout(() => {
          onSuccess(userData);
        }, 1000);
      } else {
        toast({
          title: "Registration Failed",
          description: result.error.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setValue('country', value);
    setValue('city', ''); // Reset city when country changes
    
    // Auto-fill phone country code
    const country = countries.find(c => c.code === value);
    if (country && !watchedFields.phone) {
      setValue('phone', country.dialCode + ' ');
    }
  };

  const handleFileUpload = (type: 'document' | 'profile', file: File | null) => {
    if (type === 'document') {
      setDocumentFile(file);
    } else {
      setProfilePicture(file);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary mb-2">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Let's start with your basic details</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName', { required: true })}
                  placeholder="John"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName', { required: true })}
                  placeholder="Doe"
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select onValueChange={handleCountryChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select 
                onValueChange={(value) => setValue('city', value)}
                disabled={!selectedCountry}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={selectedCountry ? "Select your city" : "Select country first"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedCountry && cities[selectedCountry]?.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...register('phone', { required: true })}
                placeholder="+1 (555) 000-0000"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">Country code included automatically</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: true })}
                placeholder="john.doe@example.com"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">We'll never spam you - promise!</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                Home Details
              </h3>
              <p className="text-sm text-muted-foreground">Tell us where you live</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address *</Label>
              <Input
                id="streetAddress"
                {...register('streetAddress', { required: true })}
                placeholder="123 Main Street"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartmentUnit">Apartment/Unit</Label>
              <Input
                id="apartmentUnit"
                {...register('apartmentUnit')}
                placeholder="Apt 4B, Suite 100, etc."
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
              <Input
                id="zipCode"
                {...register('zipCode', { required: true })}
                placeholder="12345"
                className="h-12"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password', { required: true, minLength: 6 })}
                  placeholder="Create a strong password"
                  className="h-12 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword', { required: true })}
                  placeholder="Confirm your password"
                  className="h-12 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary mb-2 flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                Identification
              </h3>
              <p className="text-sm text-muted-foreground">Upload your identification documents</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type *</Label>
              <Select onValueChange={(value) => setValue('documentType', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Upload Document *</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  ref={documentInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleFileUpload('document', e.target.files?.[0] || null)}
                />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {documentFile ? documentFile.name : 'Click to upload your document'}
                </p>
                <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 10MB)</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  onClick={() => documentInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePicture">Profile Picture</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  ref={profilePictureRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleFileUpload('profile', e.target.files?.[0] || null)}
                />
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {profilePicture ? profilePicture.name : 'Let your smile light up the screen'}
                </p>
                <p className="text-xs text-muted-foreground">JPG or PNG (max 5MB)</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  onClick={() => profilePictureRef.current?.click()}
                >
                  Choose Photo
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary mb-2">Final Touches</h3>
              <p className="text-sm text-muted-foreground">Review and confirm your registration</p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                {...register('termsAccepted', { required: true })}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{' '}
                <Button variant="link" className="p-0 h-auto text-primary underline">
                  Terms & Conditions
                </Button>
                {' '}and{' '}
                <Button variant="link" className="p-0 h-auto text-primary underline">
                  Privacy Policy
                </Button>
              </Label>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Registration Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Name:</strong> {watchedFields.firstName} {watchedFields.lastName}</p>
                <p><strong>Email:</strong> {watchedFields.email}</p>
                <p><strong>Country:</strong> {countries.find(c => c.code === watchedFields.country)?.name}</p>
                <p><strong>City:</strong> {watchedFields.city}</p>
                <p><strong>Document:</strong> {documentFile?.name || 'Not uploaded'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Join thousands of satisfied customers
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {progress}% complete
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={loading}
                >
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="ml-auto"
                  disabled={loading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white animate-pulse"
                  disabled={loading}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveSignUpForm;