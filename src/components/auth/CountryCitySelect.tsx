
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Country {
  name: string;
  code: string;
  cities: string[];
}

const countriesWithCities: Country[] = [
  {
    name: "United States",
    code: "US",
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington DC", "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City", "Mesa", "Atlanta", "Omaha", "Colorado Springs", "Raleigh", "Miami", "Long Beach", "Virginia Beach", "Minneapolis", "Tampa", "Oakland", "Tulsa", "Arlington", "New Orleans", "Wichita"]
  },
  {
    name: "Canada",
    code: "CA", 
    cities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "Oshawa", "Windsor", "Saskatoon", "St. Catharines", "Regina", "Sherbrooke", "Barrie", "Kelowna", "Abbotsford", "Kingston", "Trois-Rivières", "Guelph", "Cambridge", "Whitby", "Coquitlam", "Saanich", "Burlington", "Richmond", "Markham", "Vaughan", "Gatineau", "Longueuil", "Burnaby", "Laval", "Brampton", "Mississauga", "Surrey"]
  },
  {
    name: "United Kingdom",
    code: "GB",
    cities: ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Newcastle", "Sheffield", "Bristol", "Belfast", "Leicester", "Edinburgh", "Brighton", "Cardiff", "Coventry", "Nottingham", "Hull", "Plymouth", "Stoke-on-Trent", "Wolverhampton", "Derby", "Swansea", "Southampton", "Salford", "Aberdeen", "Westminster", "Portsmouth", "York", "Peterborough", "Dundee", "Lancaster", "Oxford", "Newport", "Preston", "St Albans", "Norwich", "Chester", "Cambridge", "Salisbury", "Exeter", "Gloucester", "Lisburn", "Chichester", "Winchester", "Londonderry", "Carlisle", "Worcester", "Bath", "Durham", "Lincoln", "Wakefield", "Carlisle"]
  },
  {
    name: "Germany",
    code: "DE",
    cities: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", "Gelsenkirchen", "Mönchengladbach", "Braunschweig", "Chemnitz", "Kiel", "Aachen", "Halle", "Magdeburg", "Freiburg", "Krefeld", "Lübeck", "Oberhausen", "Erfurt", "Mainz", "Rostock", "Kassel", "Hagen", "Potsdam", "Saarbrücken", "Hamm", "Mülheim", "Ludwigshafen", "Leverkusen", "Oldenburg", "Osnabrück", "Solingen"]
  },
  {
    name: "France", 
    code: "FR",
    cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Angers", "Grenoble", "Dijon", "Nîmes", "Aix-en-Provence", "Saint-Quentin-en-Yvelines", "Brest", "Le Mans", "Amiens", "Tours", "Limoges", "Clermont-Ferrand", "Villeurbanne", "Besançon", "Orléans", "Metz", "Rouen", "Mulhouse", "Perpignan", "Caen", "Boulogne-Billancourt", "Nancy", "Fort-de-France", "Roubaix", "Tourcoing", "Montreuil", "Avignon", "Créteil"]
  },
  {
    name: "Australia",
    code: "AU",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Sunshine Coast", "Wollongong", "Logan City", "Geelong", "Hobart", "Townsville", "Cairns", "Darwin", "Toowoomba", "Ballarat", "Bendigo", "Albury", "Launceston", "Mackay", "Rockhampton", "Bunbury", "Bundaberg", "Coffs Harbour", "Wagga Wagga", "Hervey Bay", "Mildura", "Shepparton", "Port Macquarie", "Gladstone", "Tamworth", "Traralgon", "Orange", "Bowral", "Geraldton", "Dubbo", "Nowra"]
  },
  {
    name: "Japan",
    code: "JP", 
    cities: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki", "Kyoto", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai", "Niigata", "Hamamatsu", "Okayama", "Kumamoto", "Sagamihara", "Shizuoka", "Himeji", "Akita", "Matsuyama", "Utsunomiya", "Matsudo", "Kawagoe", "Kanazawa", "Oita", "Nara", "Toyama", "Nagasaki", "Machida", "Gifu", "Hirakata", "Fujisawa", "Kashiwa", "Toyota", "Takatsuki", "Wakayama"]
  },
  {
    name: "Brazil",
    code: "BR",
    cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Nova Iguaçu", "Natal", "Campo Grande", "Teresina", "São Bernardo do Campo", "João Pessoa", "Jaboatão dos Guararapes", "Osasco", "Santo André", "São José dos Campos", "Ribeirão Preto", "Uberlândia", "Sorocaba", "Contagem", "Aracaju", "Feira de Santana", "Cuiabá", "Joinville", "Aparecida de Goiânia", "Londrina", "Juiz de Fora", "Ananindeua"]
  },
  {
    name: "India",
    code: "IN",
    cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur"]
  },
  {
    name: "China",
    code: "CN",
    cities: ["Shanghai", "Beijing", "Chongqing", "Tianjin", "Guangzhou", "Shenzhen", "Wuhan", "Dongguan", "Chengdu", "Nanjing", "Foshan", "Shenyang", "Hangzhou", "Xi'an", "Harbin", "Qingdao", "Zhengzhou", "Shijiazhuang", "Jinan", "Changchun", "Kunming", "Changsha", "Taiyuan", "Hefei", "Urumqi", "Dalian", "Yantai", "Guiyang", "Wenzhou", "Zibo", "Nanning", "Xuzhou", "Haikou", "Hohhot", "Lanzhou", "Baotou", "Daqing", "Wuxi", "Suzhou", "Ningbo"]
  }
];

interface CountryCitySelectProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
}

const CountryCitySelect = ({ 
  selectedCountry, 
  selectedCity, 
  onCountryChange, 
  onCityChange 
}: CountryCitySelectProps) => {
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    const country = countriesWithCities.find(c => c.name === selectedCountry);
    if (country) {
      setAvailableCities(country.cities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  const handleCountryChange = (country: string) => {
    onCountryChange(country);
    onCityChange(''); // Reset city when country changes
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="country">Country *</Label>
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto bg-white border shadow-lg z-50">
            {countriesWithCities.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="city">City *</Label>
        <Select 
          value={selectedCity} 
          onValueChange={onCityChange}
          disabled={!selectedCountry || availableCities.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={availableCities.length > 0 ? "Select City" : "First select a country"} />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto bg-white border shadow-lg z-50">
            {availableCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CountryCitySelect;
