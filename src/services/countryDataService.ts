interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  cities: string[];
}

// Comprehensive country and cities data
export const countriesData: Country[] = [
  {
    name: "United States",
    code: "US",
    dialCode: "+1",
    flag: "🇺🇸",
    cities: [
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
      "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", 
      "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", 
      "Seattle", "Denver", "Washington DC", "Boston", "El Paso", "Nashville", 
      "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", 
      "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", 
      "Kansas City", "Mesa", "Atlanta", "Omaha", "Colorado Springs", "Raleigh", 
      "Miami", "Long Beach", "Virginia Beach", "Minneapolis", "Tampa", "Oakland", 
      "Tulsa", "Arlington", "New Orleans", "Wichita"
    ]
  },
  {
    name: "Canada",
    code: "CA",
    dialCode: "+1",
    flag: "🇨🇦",
    cities: [
      "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", 
      "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", 
      "Halifax", "Oshawa", "Windsor", "Saskatoon", "St. Catharines", "Regina", 
      "Sherbrooke", "Barrie", "Kelowna", "Abbotsford", "Kingston", "Trois-Rivières", 
      "Guelph", "Cambridge", "Whitby", "Coquitlam", "Saanich", "Burlington", 
      "Richmond", "Markham", "Vaughan", "Gatineau", "Longueuil", "Burnaby", 
      "Laval", "Brampton", "Mississauga", "Surrey"
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    dialCode: "+44",
    flag: "🇬🇧",
    cities: [
      "London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Newcastle", 
      "Sheffield", "Bristol", "Belfast", "Leicester", "Edinburgh", "Brighton", 
      "Cardiff", "Coventry", "Nottingham", "Hull", "Plymouth", "Stoke-on-Trent", 
      "Wolverhampton", "Derby", "Swansea", "Southampton", "Salford", "Aberdeen", 
      "Westminster", "Portsmouth", "York", "Peterborough", "Dundee", "Lancaster", 
      "Oxford", "Newport", "Preston", "St Albans", "Norwich", "Chester", 
      "Cambridge", "Salisbury", "Exeter", "Gloucester", "Lisburn", "Chichester", 
      "Winchester", "Londonderry", "Carlisle", "Worcester", "Bath", "Durham", 
      "Lincoln", "Wakefield"
    ]
  },
  {
    name: "Germany",
    code: "DE",
    dialCode: "+49",
    flag: "🇩🇪",
    cities: [
      "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", 
      "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", 
      "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", 
      "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", 
      "Gelsenkirchen", "Mönchengladbach", "Braunschweig", "Chemnitz", "Kiel", 
      "Aachen", "Halle", "Magdeburg", "Freiburg", "Krefeld", "Lübeck", 
      "Oberhausen", "Erfurt", "Mainz", "Rostock", "Kassel", "Hagen", 
      "Potsdam", "Saarbrücken", "Hamm", "Mülheim", "Ludwigshafen", "Leverkusen", 
      "Oldenburg", "Osnabrück", "Solingen"
    ]
  },
  {
    name: "France",
    code: "FR",
    dialCode: "+33",
    flag: "🇫🇷",
    cities: [
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", 
      "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", 
      "Saint-Étienne", "Toulon", "Angers", "Grenoble", "Dijon", "Nîmes", 
      "Aix-en-Provence", "Saint-Quentin-en-Yvelines", "Brest", "Le Mans", 
      "Amiens", "Tours", "Limoges", "Clermont-Ferrand", "Villeurbanne", 
      "Besançon", "Orléans", "Metz", "Rouen", "Mulhouse", "Perpignan", 
      "Caen", "Boulogne-Billancourt", "Nancy", "Fort-de-France", "Roubaix", 
      "Tourcoing", "Montreuil", "Avignon", "Créteil"
    ]
  },
  {
    name: "Australia",
    code: "AU",
    dialCode: "+61",
    flag: "🇦🇺",
    cities: [
      "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", 
      "Newcastle", "Canberra", "Sunshine Coast", "Wollongong", "Logan City", 
      "Geelong", "Hobart", "Townsville", "Cairns", "Darwin", "Toowoomba", 
      "Ballarat", "Bendigo", "Albury", "Launceston", "Mackay", "Rockhampton", 
      "Bunbury", "Bundaberg", "Coffs Harbour", "Wagga Wagga", "Hervey Bay", 
      "Mildura", "Shepparton", "Port Macquarie", "Gladstone", "Tamworth", 
      "Traralgon", "Orange", "Bowral", "Geraldton", "Dubbo", "Nowra"
    ]
  },
  {
    name: "Japan",
    code: "JP",
    dialCode: "+81",
    flag: "🇯🇵",
    cities: [
      "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", 
      "Kawasaki", "Kyoto", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", 
      "Chiba", "Sakai", "Niigata", "Hamamatsu", "Okayama", "Kumamoto", 
      "Sagamihara", "Shizuoka", "Himeji", "Akita", "Matsuyama", "Utsunomiya", 
      "Matsudo", "Kawagoe", "Kanazawa", "Oita", "Nara", "Toyama", "Nagasaki", 
      "Machida", "Gifu", "Hirakata", "Fujisawa", "Kashiwa", "Toyota", 
      "Takatsuki", "Wakayama"
    ]
  },
  {
    name: "Brazil",
    code: "BR",
    dialCode: "+55",
    flag: "🇧🇷",
    cities: [
      "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", 
      "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", 
      "Porto Alegre", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", 
      "Maceió", "Duque de Caxias", "Nova Iguaçu", "Natal", "Campo Grande", 
      "Teresina", "São Bernardo do Campo", "João Pessoa", "Jaboatão dos Guararapes", 
      "Osasco", "Santo André", "São José dos Campos", "Ribeirão Preto", 
      "Uberlândia", "Sorocaba", "Contagem", "Aracaju", "Feira de Santana", 
      "Cuiabá", "Joinville", "Aparecida de Goiânia", "Londrina", "Juiz de Fora", 
      "Ananindeua"
    ]
  },
  {
    name: "India",
    code: "IN",
    dialCode: "+91",
    flag: "🇮🇳",
    cities: [
      "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", 
      "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", 
      "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", 
      "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", 
      "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", 
      "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", 
      "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur"
    ]
  },
  {
    name: "China",
    code: "CN",
    dialCode: "+86",
    flag: "🇨🇳",
    cities: [
      "Shanghai", "Beijing", "Chongqing", "Tianjin", "Guangzhou", "Shenzhen", 
      "Wuhan", "Dongguan", "Chengdu", "Nanjing", "Foshan", "Shenyang", 
      "Hangzhou", "Xi'an", "Harbin", "Qingdao", "Zhengzhou", "Shijiazhuang", 
      "Jinan", "Changchun", "Kunming", "Changsha", "Taiyuan", "Hefei", 
      "Urumqi", "Dalian", "Yantai", "Guiyang", "Wenzhou", "Zibo", "Nanning", 
      "Xuzhou", "Haikou", "Hohhot", "Lanzhou", "Baotou", "Daqing", "Wuxi", 
      "Suzhou", "Ningbo"
    ]
  },
  {
    name: "Spain",
    code: "ES",
    dialCode: "+34",
    flag: "🇪🇸",
    cities: [
      "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", 
      "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", 
      "Valladolid", "Vigo", "Gijón", "L'Hospitalet", "A Coruña", "Granada", 
      "Vitoria", "Elche", "Santa Cruz de Tenerife", "Oviedo", "Badalona", 
      "Cartagena", "Terrassa", "Jerez de la Frontera", "Sabadell", "Móstoles", 
      "Alcalá de Henares", "Pamplona", "Fuenlabrada", "Almería", "Leganés", 
      "Donostia", "Burgos", "Santander", "Castellón", "Getafe", "Albacete", 
      "Alcorcón"
    ]
  },
  {
    name: "Italy",
    code: "IT",
    dialCode: "+39",
    flag: "🇮🇹",
    cities: [
      "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", 
      "Florence", "Bari", "Catania", "Venice", "Verona", "Messina", "Padua", 
      "Trieste", "Brescia", "Taranto", "Prato", "Parma", "Reggio Calabria", 
      "Modena", "Reggio Emilia", "Perugia", "Livorno", "Ravenna", "Cagliari", 
      "Foggia", "Rimini", "Salerno", "Ferrara", "Sassari", "Latina", "Giugliano", 
      "Monza", "Syracuse", "Bergamo", "Pescara", "Forlì", "Trento", "Vicenza"
    ]
  },
  {
    name: "Netherlands",
    code: "NL",
    dialCode: "+31",
    flag: "🇳🇱",
    cities: [
      "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", 
      "Groningen", "Almere", "Breda", "Nijmegen", "Enschede", "Haarlem", 
      "Arnhem", "Zaanstad", "Amersfoort", "Apeldoorn", "s-Hertogenbosch", 
      "Hoofddorp", "Maastricht", "Leiden", "Dordrecht", "Zoetermeer", 
      "Zwolle", "Deventer", "Delft", "Alkmaar", "Leeuwarden", "Sittard", 
      "Venlo", "Hilversum", "Hengelo", "Alphen aan den Rijn", "Lelystad", 
      "Roosendaal", "Oss", "Spijkenisse", "Purmerend", "Emmen", "Vlaardingen", 
      "Helmond"
    ]
  }
];

// Mock API simulation for dynamic loading
export const countryDataService = {
  // Get all countries
  getCountries: async (): Promise<Country[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return countriesData;
  },

  // Get cities for a specific country
  getCitiesByCountry: async (countryCode: string): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const country = countriesData.find(c => c.code === countryCode || c.name === countryCode);
    return country ? country.cities : [];
  },

  // Get country by code or name
  getCountry: async (identifier: string): Promise<Country | null> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return countriesData.find(c => 
      c.code === identifier || 
      c.name === identifier ||
      c.name.toLowerCase() === identifier.toLowerCase()
    ) || null;
  },

  // Search cities within a country
  searchCities: async (countryCode: string, searchTerm: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cities = await countryDataService.getCitiesByCountry(countryCode);
    return cities.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};

// Utility functions
export const getCountryByCode = (code: string): Country | undefined => {
  return countriesData.find(c => c.code === code);
};

export const getCountryByName = (name: string): Country | undefined => {
  return countriesData.find(c => c.name === name);
};

export const getAllCountryCodes = (): string[] => {
  return countriesData.map(c => c.code);
};

export const getAllCountryNames = (): string[] => {
  return countriesData.map(c => c.name);
};