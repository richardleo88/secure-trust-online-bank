import { useState, useEffect, useCallback } from 'react';
import { countryDataService } from '@/services/countryDataService';

interface UseCountryCityReturn {
  countries: Array<{ name: string; code: string; dialCode: string; flag: string }>;
  cities: string[];
  isLoadingCountries: boolean;
  isLoadingCities: boolean;
  error: string | null;
  selectedCountry: string;
  selectedCity: string;
  setSelectedCountry: (country: string) => void;
  setSelectedCity: (city: string) => void;
  resetSelection: () => void;
}

export const useCountryCity = (
  initialCountry: string = '',
  initialCity: string = ''
): UseCountryCityReturn => {
  const [countries, setCountries] = useState<Array<{ name: string; code: string; dialCode: string; flag: string }>>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountryState] = useState(initialCountry);
  const [selectedCity, setSelectedCityState] = useState(initialCity);

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        setError(null);
        const countryData = await countryDataService.getCountries();
        setCountries(countryData.map(c => ({
          name: c.name,
          code: c.code,
          dialCode: c.dialCode,
          flag: c.flag
        })));
      } catch (err) {
        console.error('Failed to load countries:', err);
        setError('Failed to load countries. Please try again.');
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  // Load cities when country changes
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedCountry) {
        setCities([]);
        return;
      }

      try {
        setIsLoadingCities(true);
        setError(null);
        const cityData = await countryDataService.getCitiesByCountry(selectedCountry);
        setCities(cityData);
        
        // If current city is not in the new city list, reset it
        if (selectedCity && !cityData.includes(selectedCity)) {
          setSelectedCityState('');
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
        setError('Failed to load cities. Please try again.');
        setCities([]);
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedCountry, selectedCity]);

  const setSelectedCountry = useCallback((country: string) => {
    setSelectedCountryState(country);
    setSelectedCityState(''); // Reset city when country changes
  }, []);

  const setSelectedCity = useCallback((city: string) => {
    setSelectedCityState(city);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedCountryState('');
    setSelectedCityState('');
    setCities([]);
  }, []);

  return {
    countries,
    cities,
    isLoadingCountries,
    isLoadingCities,
    error,
    selectedCountry,
    selectedCity,
    setSelectedCountry,
    setSelectedCity,
    resetSelection
  };
};

// Specialized hook for simple country/city selection without state management
export const useCountryCityData = () => {
  const [countries, setCountries] = useState<Array<{ name: string; code: string; dialCode: string; flag: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const countryData = await countryDataService.getCountries();
        setCountries(countryData.map(c => ({
          name: c.name,
          code: c.code,
          dialCode: c.dialCode,
          flag: c.flag
        })));
      } catch (err) {
        console.error('Failed to load countries:', err);
        setError('Failed to load countries. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  const getCitiesForCountry = useCallback(async (countryIdentifier: string): Promise<string[]> => {
    try {
      return await countryDataService.getCitiesByCountry(countryIdentifier);
    } catch (err) {
      console.error('Failed to load cities for country:', countryIdentifier, err);
      return [];
    }
  }, []);

  return {
    countries,
    isLoading,
    error,
    getCitiesForCountry
  };
};