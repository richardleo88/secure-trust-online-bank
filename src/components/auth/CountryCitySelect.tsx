
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, MapPin, Globe } from 'lucide-react';
import { useCountryCity } from '@/hooks/useCountryCity';

interface CountryCitySelectProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  disabled?: boolean;
  showFlags?: boolean;
}

const CountryCitySelect = ({ 
  selectedCountry, 
  selectedCity, 
  onCountryChange, 
  onCityChange,
  disabled = false,
  showFlags = true
}: CountryCitySelectProps) => {
  const { t } = useTranslation();
  const {
    countries,
    cities,
    isLoadingCountries,
    isLoadingCities,
    error
  } = useCountryCity(selectedCountry, selectedCity);

  const handleCountryChange = (country: string) => {
    onCountryChange(country);
    onCityChange(''); // Reset city when country changes
  };

  const renderCountryOption = (country: { name: string; code: string; flag: string }) => (
    <div className="flex items-center gap-2">
      {showFlags && <span className="text-sm">{country.flag}</span>}
      <span>{country.name}</span>
    </div>
  );

  const renderCityFallback = () => {
    if (!selectedCountry) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm p-2">
          <Globe className="h-4 w-4" />
          <span>{t('auth.firstSelectCountry')}</span>
        </div>
      );
    }

    if (isLoadingCities) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Loading cities...</span>
        </div>
      );
    }

    if (cities.length === 0) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm p-2">
          <AlertCircle className="h-4 w-4" />
          <span>No cities available for this country</span>
        </div>
      );
    }

    return null;
  };

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-destructive text-sm p-4 bg-destructive/10 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="country" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t('auth.country')} *
        </Label>
        {isLoadingCountries ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select 
            value={selectedCountry} 
            onValueChange={handleCountryChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('auth.selectCountry')} />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white border shadow-lg z-50">
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {renderCountryOption(country)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      <div>
        <Label htmlFor="city" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {t('auth.city')} *
        </Label>
        {isLoadingCountries ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select 
            value={selectedCity} 
            onValueChange={onCityChange}
            disabled={disabled || !selectedCountry || isLoadingCities}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  !selectedCountry 
                    ? t('auth.firstSelectCountry')
                    : isLoadingCities 
                    ? 'Loading cities...'
                    : cities.length > 0 
                    ? t('auth.selectCity') 
                    : 'No cities available'
                } 
              />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white border shadow-lg z-50">
              {cities.length > 0 ? (
                cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))
              ) : (
                renderCityFallback()
              )}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default CountryCitySelect;
