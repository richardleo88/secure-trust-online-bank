import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login clicked, navigating to login");
    navigate("/login");
  };

  const handleRegister = () => {
    console.log("Register clicked, navigating to login");
    navigate("/login");
  };

  const handleLanguageChange = (value: string) => {
    console.log("Language changed to:", value);
    // Change language immediately
    i18n.changeLanguage(value);
    // Store in localStorage to persist across sessions
    localStorage.setItem("preferredLanguage", value);
    // Force re-render of entire app by triggering a small delay
    setTimeout(() => {
      window.dispatchEvent(new Event('languageChanged'));
    }, 100);
  };

  const getCurrentLanguage = () => {
    const current = languages.find(lang => lang.code === i18n.language);
    return current || languages[0];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 banking-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-banking-navy">UnionTrust</h1>
            <p className="text-xs text-banking-slate">Capital</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/personal" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.personal')}
          </Link>
          <Link to="/business" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.business')}
          </Link>
          <Link to="/investments" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.investments')}
          </Link>
          <Link to="/loans" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.loans')}
          </Link>
          <Link to="/support" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.support')}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-20 sm:w-24 md:w-32 h-8 text-sm shrink-0">
              <SelectValue>
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm">{getCurrentLanguage().flag}</span>
                  <span className="hidden lg:inline text-xs">{getCurrentLanguage().name}</span>
                  <span className="lg:hidden text-xs">{getCurrentLanguage().code.toUpperCase()}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white border shadow-lg z-[60]">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span className="hidden md:inline">{lang.name}</span>
                    <span className="md:hidden">{lang.code.toUpperCase()}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Desktop Login/Register */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleLogin} className="text-xs sm:text-sm px-2 sm:px-3">
              {t('header.signIn')}
            </Button>
            <Button className="banking-gradient text-white hover:opacity-90 text-xs sm:text-sm px-2 sm:px-3" size="sm" onClick={handleRegister}>
              {t('header.signUp')}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{t('header.menu')}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Navigation */}
                <div className="space-y-3">
                  <Link to="/personal" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.personal')}
                  </Link>
                  <Link to="/business" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.business')}
                  </Link>
                  <Link to="/investments" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.investments')}
                  </Link>
                  <Link to="/loans" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.loans')}
                  </Link>
                  <Link to="/support" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.support')}
                  </Link>
                </div>

                {/* Mobile Login/Register */}
                <div className="pt-6 border-t space-y-3">
                  <Button variant="outline" className="w-full" size="lg" onClick={handleLogin}>
                    {t('header.signIn')}
                  </Button>
                  <Button className="banking-gradient text-white hover:opacity-90 w-full" size="lg" onClick={handleRegister}>
                    {t('header.signUp')}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
