
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Country {
  name: string;
  code: string;
  states?: string[];
}

const countriesWithStates: Country[] = [
  {
    name: "United States",
    code: "US",
    states: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
      "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
      "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
      "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
      "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
      "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
      "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ]
  },
  {
    name: "Canada",
    code: "CA",
    states: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
      "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
      "Quebec", "Saskatchewan", "Yukon"
    ]
  },
  {
    name: "Australia",
    code: "AU",
    states: [
      "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland",
      "South Australia", "Tasmania", "Victoria", "Western Australia"
    ]
  },
  { name: "United Kingdom", code: "GB" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Japan", code: "JP" },
  { name: "South Korea", code: "KR" },
  { name: "China", code: "CN" },
  { name: "India", code: "IN" },
  { name: "Brazil", code: "BR" },
  { name: "Mexico", code: "MX" },
  { name: "Nigeria", code: "NG" },
  { name: "South Africa", code: "ZA" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Netherlands", code: "NL" },
  { name: "Sweden", code: "SE" },
  { name: "Norway", code: "NO" },
  { name: "Denmark", code: "DK" },
  { name: "Switzerland", code: "CH" },
  { name: "Austria", code: "AT" },
  { name: "Belgium", code: "BE" },
  { name: "Finland", code: "FI" },
  { name: "Ireland", code: "IE" },
  { name: "Portugal", code: "PT" },
  { name: "Greece", code: "GR" },
  { name: "Poland", code: "PL" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Hungary", code: "HU" },
  { name: "Romania", code: "RO" },
  { name: "Bulgaria", code: "BG" },
  { name: "Croatia", code: "HR" },
  { name: "Slovenia", code: "SI" },
  { name: "Slovakia", code: "SK" },
  { name: "Lithuania", code: "LT" },
  { name: "Latvia", code: "LV" },
  { name: "Estonia", code: "EE" }
];

interface CountryStateSelectProps {
  selectedCountry: string;
  selectedState: string;
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
}

const CountryStateSelect = ({ 
  selectedCountry, 
  selectedState, 
  onCountryChange, 
  onStateChange 
}: CountryStateSelectProps) => {
  const selectedCountryData = countriesWithStates.find(c => c.name === selectedCountry);
  const hasStates = selectedCountryData?.states && selectedCountryData.states.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="country">Country *</Label>
        <Select value={selectedCountry} onValueChange={(value) => {
          onCountryChange(value);
          onStateChange(''); // Reset state when country changes
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countriesWithStates.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="state">State/Province *</Label>
        <Select 
          value={selectedState} 
          onValueChange={onStateChange}
          disabled={!hasStates}
        >
          <SelectTrigger>
            <SelectValue placeholder={hasStates ? "Select State/Province" : "N/A for selected country"} />
          </SelectTrigger>
          <SelectContent>
            {hasStates && selectedCountryData.states!.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CountryStateSelect;
