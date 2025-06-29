
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, MapPin } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "no", name: "Norsk", flag: "🇳🇴" }
];

const LanguageWelcomeModal = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // Show modal if no language preference is stored and it's the first visit
    const hasSeenWelcome = localStorage.getItem('hasSeenLanguageWelcome');
    const storedLanguage = localStorage.getItem('preferredLanguage');
    
    if (!hasSeenWelcome && !storedLanguage) {
      setIsOpen(true);
      detectLocationAndLanguage();
    }
  }, []);

  const detectLocationAndLanguage = async () => {
    setIsDetecting(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setDetectedLocation(`${data.city}, ${data.country_name}`);
      
      // Country to language mapping
      const countryToLanguage: { [key: string]: string } = {
        'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en',
        'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es',
        'FR': 'fr', 'BE': 'fr', 'CH': 'fr',
        'DE': 'de', 'AT': 'de',
        'IT': 'it', 'PT': 'pt', 'BR': 'pt',
        'RU': 'ru', 'CN': 'zh', 'JP': 'ja', 'KR': 'ko',
        'SA': 'ar', 'AE': 'ar', 'EG': 'ar',
        'IN': 'hi', 'TH': 'th', 'VN': 'vi', 'TR': 'tr',
        'PL': 'pl', 'NL': 'nl', 'SE': 'sv', 'DK': 'da', 'NO': 'no'
      };
      
      const detectedLanguage = countryToLanguage[data.country_code];
      if (detectedLanguage) {
        setSelectedLanguage(detectedLanguage);
      }
    } catch (error) {
      console.log('Location detection failed:', error);
      setDetectedLocation("Unable to detect location");
    }
    setIsDetecting(false);
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleConfirm = () => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('preferredLanguage', selectedLanguage);
    localStorage.setItem('hasSeenLanguageWelcome', 'true');
    setIsOpen(false);
    
    // Trigger a global language change event
    window.dispatchEvent(new Event('languageChanged'));
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenLanguageWelcome', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2 text-2xl text-banking-navy">
            <Languages className="h-6 w-6" />
            {t('languageWelcome.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-banking-slate font-medium">
              {t('languageWelcome.subtitle')}
            </p>
            <p className="text-sm text-banking-slate">
              {t('languageWelcome.description')}
            </p>
            
            {detectedLocation && (
              <div className="flex items-center justify-center gap-2 text-sm text-banking-slate bg-blue-50 p-2 rounded-md">
                <MapPin className="h-4 w-4" />
                <span>Detected location: {detectedLocation}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-banking-navy">
              {t('header.languageSelector')}:
            </label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange} disabled={isDetecting}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto bg-white border shadow-lg z-50">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button 
              onClick={handleConfirm}
              className="flex-1 banking-gradient text-white hover:opacity-90"
              disabled={isDetecting}
            >
              {isDetecting ? 'Detecting...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageWelcomeModal;
