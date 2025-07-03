import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  { code: 'AF', name: 'Afghanistan', dialCode: '+93' },
  { code: 'AL', name: 'Albania', dialCode: '+355' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213' },
  { code: 'AS', name: 'American Samoa', dialCode: '+1' },
  { code: 'AD', name: 'Andorra', dialCode: '+376' },
  { code: 'AO', name: 'Angola', dialCode: '+244' },
  { code: 'AI', name: 'Anguilla', dialCode: '+1' },
  { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1' },
  { code: 'AR', name: 'Argentina', dialCode: '+54' },
  { code: 'AM', name: 'Armenia', dialCode: '+374' },
  { code: 'AW', name: 'Aruba', dialCode: '+297' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'AT', name: 'Austria', dialCode: '+43' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880' },
  { code: 'BB', name: 'Barbados', dialCode: '+1' },
  { code: 'BY', name: 'Belarus', dialCode: '+375' },
  { code: 'BE', name: 'Belgium', dialCode: '+32' },
  { code: 'BZ', name: 'Belize', dialCode: '+501' },
  { code: 'BJ', name: 'Benin', dialCode: '+229' },
  { code: 'BM', name: 'Bermuda', dialCode: '+1' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387' },
  { code: 'BW', name: 'Botswana', dialCode: '+267' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'BN', name: 'Brunei', dialCode: '+673' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226' },
  { code: 'BI', name: 'Burundi', dialCode: '+257' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238' },
  { code: 'KY', name: 'Cayman Islands', dialCode: '+1' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236' },
  { code: 'TD', name: 'Chad', dialCode: '+235' },
  { code: 'CL', name: 'Chile', dialCode: '+56' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'CO', name: 'Colombia', dialCode: '+57' },
  { code: 'KM', name: 'Comoros', dialCode: '+269' },
  { code: 'CG', name: 'Congo', dialCode: '+242' },
  { code: 'CD', name: 'Congo (DRC)', dialCode: '+243' },
  { code: 'CK', name: 'Cook Islands', dialCode: '+682' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506' },
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225' },
  { code: 'HR', name: 'Croatia', dialCode: '+385' },
  { code: 'CU', name: 'Cuba', dialCode: '+53' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420' },
  { code: 'DK', name: 'Denmark', dialCode: '+45' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253' },
  { code: 'DM', name: 'Dominica', dialCode: '+1' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593' },
  { code: 'EG', name: 'Egypt', dialCode: '+20' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291' },
  { code: 'EE', name: 'Estonia', dialCode: '+372' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679' },
  { code: 'FI', name: 'Finland', dialCode: '+358' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'GA', name: 'Gabon', dialCode: '+241' },
  { code: 'GM', name: 'Gambia', dialCode: '+220' },
  { code: 'GE', name: 'Georgia', dialCode: '+995' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'GR', name: 'Greece', dialCode: '+30' },
  { code: 'GD', name: 'Grenada', dialCode: '+1' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502' },
  { code: 'GN', name: 'Guinea', dialCode: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245' },
  { code: 'GY', name: 'Guyana', dialCode: '+592' },
  { code: 'HT', name: 'Haiti', dialCode: '+509' },
  { code: 'HN', name: 'Honduras', dialCode: '+504' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852' },
  { code: 'HU', name: 'Hungary', dialCode: '+36' },
  { code: 'IS', name: 'Iceland', dialCode: '+354' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62' },
  { code: 'IR', name: 'Iran', dialCode: '+98' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964' },
  { code: 'IE', name: 'Ireland', dialCode: '+353' },
  { code: 'IL', name: 'Israel', dialCode: '+972' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'JO', name: 'Jordan', dialCode: '+962' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7' },
  { code: 'KE', name: 'Kenya', dialCode: '+254' },
  { code: 'KI', name: 'Kiribati', dialCode: '+686' },
  { code: 'KP', name: 'Korea (North)', dialCode: '+850' },
  { code: 'KR', name: 'Korea (South)', dialCode: '+82' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996' },
  { code: 'LA', name: 'Laos', dialCode: '+856' },
  { code: 'LV', name: 'Latvia', dialCode: '+371' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266' },
  { code: 'LR', name: 'Liberia', dialCode: '+231' },
  { code: 'LY', name: 'Libya', dialCode: '+218' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352' },
  { code: 'MO', name: 'Macau', dialCode: '+853' },
  { code: 'MK', name: 'Macedonia', dialCode: '+389' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261' },
  { code: 'MW', name: 'Malawi', dialCode: '+265' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'MV', name: 'Maldives', dialCode: '+960' },
  { code: 'ML', name: 'Mali', dialCode: '+223' },
  { code: 'MT', name: 'Malta', dialCode: '+356' },
  { code: 'MH', name: 'Marshall Islands', dialCode: '+692' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230' },
  { code: 'MX', name: 'Mexico', dialCode: '+52' },
  { code: 'FM', name: 'Micronesia', dialCode: '+691' },
  { code: 'MD', name: 'Moldova', dialCode: '+373' },
  { code: 'MC', name: 'Monaco', dialCode: '+377' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382' },
  { code: 'MA', name: 'Morocco', dialCode: '+212' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95' },
  { code: 'NA', name: 'Namibia', dialCode: '+264' },
  { code: 'NR', name: 'Nauru', dialCode: '+674' },
  { code: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505' },
  { code: 'NE', name: 'Niger', dialCode: '+227' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'NO', name: 'Norway', dialCode: '+47' },
  { code: 'OM', name: 'Oman', dialCode: '+968' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92' },
  { code: 'PW', name: 'Palau', dialCode: '+680' },
  { code: 'PS', name: 'Palestine', dialCode: '+970' },
  { code: 'PA', name: 'Panama', dialCode: '+507' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595' },
  { code: 'PE', name: 'Peru', dialCode: '+51' },
  { code: 'PH', name: 'Philippines', dialCode: '+63' },
  { code: 'PL', name: 'Poland', dialCode: '+48' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1' },
  { code: 'QA', name: 'Qatar', dialCode: '+974' },
  { code: 'RO', name: 'Romania', dialCode: '+40' },
  { code: 'RU', name: 'Russia', dialCode: '+7' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250' },
  { code: 'WS', name: 'Samoa', dialCode: '+685' },
  { code: 'SM', name: 'San Marino', dialCode: '+378' },
  { code: 'ST', name: 'São Tomé and Príncipe', dialCode: '+239' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { code: 'SN', name: 'Senegal', dialCode: '+221' },
  { code: 'RS', name: 'Serbia', dialCode: '+381' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386' },
  { code: 'SB', name: 'Solomon Islands', dialCode: '+677' },
  { code: 'SO', name: 'Somalia', dialCode: '+252' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94' },
  { code: 'SD', name: 'Sudan', dialCode: '+249' },
  { code: 'SR', name: 'Suriname', dialCode: '+597' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268' },
  { code: 'SE', name: 'Sweden', dialCode: '+46' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41' },
  { code: 'SY', name: 'Syria', dialCode: '+963' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255' },
  { code: 'TH', name: 'Thailand', dialCode: '+66' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670' },
  { code: 'TG', name: 'Togo', dialCode: '+228' },
  { code: 'TO', name: 'Tonga', dialCode: '+676' },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216' },
  { code: 'TR', name: 'Turkey', dialCode: '+90' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993' },
  { code: 'TV', name: 'Tuvalu', dialCode: '+688' },
  { code: 'UG', name: 'Uganda', dialCode: '+256' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998' },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678' },
  { code: 'VA', name: 'Vatican City', dialCode: '+39' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84' },
  { code: 'YE', name: 'Yemen', dialCode: '+967' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263' },
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
  const { t } = useTranslation();
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
              <h3 className="text-lg font-semibold text-primary mb-2">{t('auth.personalInformation')}</h3>
              <p className="text-sm text-muted-foreground">{t('auth.basicDetailsPrompt')}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('auth.firstName')} *</Label>
                <Input
                  id="firstName"
                  {...register('firstName', { required: true })}
                  placeholder="John"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('auth.lastName')} *</Label>
                <Input
                  id="lastName"
                  {...register('lastName', { required: true })}
                  placeholder="Doe"
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">{t('auth.country')} *</Label>
              <Select onValueChange={handleCountryChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t('auth.selectCountry')} />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t('auth.city')} *</Label>
              <Select 
                onValueChange={(value) => setValue('city', value)}
                disabled={!selectedCountry}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={selectedCountry ? t('auth.selectCity') : t('auth.firstSelectCountry')} />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {selectedCountry && cities[selectedCountry]?.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phoneNumber')} *</Label>
              <Input
                id="phone"
                {...register('phone', { required: true })}
                placeholder="+1 (555) 000-0000"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">{t('auth.countryCodeIncluded')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')} *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: true })}
                placeholder="john.doe@example.com"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">{t('auth.neverSpamPromise')}</p>
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
          <CardTitle className="text-2xl">{t('auth.signUpTitle')}</CardTitle>
          <CardDescription>
            {t('auth.joinSatisfiedCustomers')}
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {progress}{t('auth.percentComplete')}
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