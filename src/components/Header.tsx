
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
    console.log("Login clicked, navigating to auth");
    navigate("/auth");
  };

  const handleRegister = () => {
    console.log("Register clicked, navigating to auth");
    navigate("/auth");
  };

  const handleLanguageChange = (value: string) => {
    console.log("Language changed to:", value);
    i18n.changeLanguage(value);
    localStorage.setItem("preferredLanguage", value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 banking-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-banking-navy">UnionTrust</h1>
            <p className="text-xs text-banking-slate">Capital</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#personal" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.personal')}
          </a>
          <a href="#business" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.business')}
          </a>
          <a href="#investments" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.investments')}
          </a>
          <a href="#loans" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.loans')}
          </a>
          <a href="#support" className="text-banking-slate hover:text-banking-navy transition-colors">
            {t('header.support')}
          </a>
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-24 md:w-32 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white border shadow-lg z-50">
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
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleLogin}>
              {t('header.signIn')}
            </Button>
            <Button className="banking-gradient text-white hover:opacity-90" size="sm" onClick={handleRegister}>
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
                  <a href="#personal" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.personal')}
                  </a>
                  <a href="#business" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.business')}
                  </a>
                  <a href="#investments" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.investments')}
                  </a>
                  <a href="#loans" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.loans')}
                  </a>
                  <a href="#support" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    {t('header.support')}
                  </a>
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
