import { useState } from 'react';
import CountryCitySelect from '@/components/auth/CountryCitySelect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Globe } from 'lucide-react';

const CountryCityDemo = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Globe className="h-6 w-6" />
            Dynamic Country & City Selection Demo
          </CardTitle>
          <CardDescription>
            Select a country to see cities populate dynamically without page reloads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Demo Component */}
          <CountryCitySelect
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            onCountryChange={setSelectedCountry}
            onCityChange={setSelectedCity}
            showFlags={true}
          />

          {/* Status Display */}
          {(selectedCountry || selectedCity) && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Selection Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCountry && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Country: {selectedCountry}
                  </Badge>
                )}
                {selectedCity && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    City: {selectedCity}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">✨ Features Implemented</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Dynamic city population on country change</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No page reloads required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Comprehensive country/city database</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Loading states and error handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Fallback messages for empty lists</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Flag emojis for better UX</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">🚀 Technical Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>React hooks for state management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>Mock API service for data fetching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>Reusable components and hooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>TypeScript for type safety</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>Shadcn UI components</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span>Responsive design</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🎯 Try it out:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Select any country from the dropdown</li>
              <li>Watch as cities populate automatically</li>
              <li>Notice the loading indicator while cities load</li>
              <li>Try different countries to see different city lists</li>
              <li>Observe how the city field resets when changing countries</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryCityDemo;