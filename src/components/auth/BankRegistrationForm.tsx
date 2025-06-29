
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, User, Briefcase, Shield, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BankRegistrationFormProps {
  onSuccess: () => void;
}

const BankRegistrationForm = ({ onSuccess }: BankRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    ssn: '',
    phone: '',
    secondaryPhone: '',
    motherMaidenName: '',
    
    // Address Information
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    stateOfBirth: '',
    citizenshipStatus: '',
    
    // Employment Information
    employmentStatus: '',
    employerName: '',
    annualIncome: '',
    
    // Document Information
    documentType: '',
    documentNumber: '',
    documentExpiryDate: '',
  });
  
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File, bucket: string, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (!profilePicture) {
      toast({
        title: "Profile Picture Required",
        description: "Please upload a profile picture",
        variant: "destructive",
      });
      return false;
    }

    if (!documentFile) {
      toast({
        title: "Document Required",
        description: "Please upload a valid ID document",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Create user account
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim()
      );

      if (signUpError) {
        toast({
          title: "Registration Failed",
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      // Get the user after signup
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Upload files
        let profilePictureUrl = null;
        let documentUrl = null;

        if (profilePicture) {
          profilePictureUrl = await handleFileUpload(profilePicture, 'profile-pictures', user.id);
        }

        if (documentFile) {
          documentUrl = await handleFileUpload(documentFile, 'documents', user.id);
        }

        // Update profile with comprehensive data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            middle_name: formData.middleName,
            phone: formData.phone,
            secondary_phone: formData.secondaryPhone,
            date_of_birth: formData.dateOfBirth,
            ssn_last_four: formData.ssn.slice(-4),
            address: {
              street: formData.streetAddress,
              city: formData.city,
              state: formData.state,
              zip: formData.zipCode
            },
            state_of_birth: formData.stateOfBirth,
            citizenship_status: formData.citizenshipStatus,
            mother_maiden_name: formData.motherMaidenName,
            employment_status: formData.employmentStatus,
            employer_name: formData.employerName,
            annual_income: parseFloat(formData.annualIncome),
            document_type: formData.documentType,
            document_number: formData.documentNumber,
            document_expiry_date: formData.documentExpiryDate,
            document_url: documentUrl,
            profile_picture_url: profilePictureUrl,
            verification_status: 'pending'
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
        }

        toast({
          title: "Registration Successful!",
          description: "Your account has been created and is pending verification. You can now sign in.",
        });

        onSuccess();
      }
    } catch (error: any) {
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

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName}
            onChange={(e) => handleInputChange('middleName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Primary Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="secondaryPhone">Secondary Phone</Label>
          <Input
            id="secondaryPhone"
            type="tel"
            value={formData.secondaryPhone}
            onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ssn">Social Security Number *</Label>
          <Input
            id="ssn"
            type="password"
            placeholder="XXX-XX-XXXX"
            value={formData.ssn}
            onChange={(e) => handleInputChange('ssn', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="motherMaidenName">Mother's Maiden Name *</Label>
          <Input
            id="motherMaidenName"
            value={formData.motherMaidenName}
            onChange={(e) => handleInputChange('motherMaidenName', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Address & Citizenship</h3>
      </div>
      
      <div>
        <Label htmlFor="streetAddress">Street Address *</Label>
        <Input
          id="streetAddress"
          value={formData.streetAddress}
          onChange={(e) => handleInputChange('streetAddress', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AL">Alabama</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              {/* Add more states as needed */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stateOfBirth">State of Birth *</Label>
          <Select value={formData.stateOfBirth} onValueChange={(value) => handleInputChange('stateOfBirth', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AL">Alabama</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="citizenshipStatus">Citizenship Status *</Label>
          <Select value={formData.citizenshipStatus} onValueChange={(value) => handleInputChange('citizenshipStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us_citizen">US Citizen</SelectItem>
              <SelectItem value="permanent_resident">Permanent Resident</SelectItem>
              <SelectItem value="visa_holder">Visa Holder</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Employment Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employmentStatus">Employment Status *</Label>
          <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self_employed">Self Employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="employerName">Employer Name</Label>
          <Input
            id="employerName"
            value={formData.employerName}
            onChange={(e) => handleInputChange('employerName', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="annualIncome">Annual Income *</Label>
        <Input
          id="annualIncome"
          type="number"
          value={formData.annualIncome}
          onChange={(e) => handleInputChange('annualIncome', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Document Verification</h3>
      </div>
      
      <div>
        <Label htmlFor="documentType">ID Document Type *</Label>
        <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="drivers_license">Driver's License</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="national_id">National ID Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="documentNumber">Document Number *</Label>
          <Input
            id="documentNumber"
            value={formData.documentNumber}
            onChange={(e) => handleInputChange('documentNumber', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="documentExpiryDate">Expiry Date *</Label>
          <Input
            id="documentExpiryDate"
            type="date"
            value={formData.documentExpiryDate}
            onChange={(e) => handleInputChange('documentExpiryDate', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label>Profile Picture *</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
            className="hidden"
            id="profile-picture"
          />
          <label htmlFor="profile-picture" className="cursor-pointer">
            <span className="text-blue-600 hover:underline">Upload Profile Picture</span>
          </label>
          {profilePicture && <p className="text-sm text-green-600 mt-2">{profilePicture.name}</p>}
        </div>
      </div>

      <div>
        <Label>ID Document *</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
            className="hidden"
            id="document-file"
          />
          <label htmlFor="document-file" className="cursor-pointer">
            <span className="text-blue-600 hover:underline">Upload ID Document</span>
          </label>
          {documentFile && <p className="text-sm text-green-600 mt-2">{documentFile.name}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Open Your UnionTrust Bank Account</CardTitle>
        <CardDescription className="text-center">
          Complete all steps to create your professional banking account
        </CardDescription>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          <Separator className="my-6" />

          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            )}
            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="ml-auto banking-gradient"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BankRegistrationForm;
