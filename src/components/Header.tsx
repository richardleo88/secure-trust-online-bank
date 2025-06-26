
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Header = () => {
  const [language, setLanguage] = useState("en");

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
            Personal
          </a>
          <a href="#business" className="text-banking-slate hover:text-banking-navy transition-colors">
            Business
          </a>
          <a href="#investments" className="text-banking-slate hover:text-banking-navy transition-colors">
            Investments
          </a>
          <a href="#loans" className="text-banking-slate hover:text-banking-navy transition-colors">
            Loans
          </a>
          <a href="#support" className="text-banking-slate hover:text-banking-navy transition-colors">
            Support
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 EN</SelectItem>
              <SelectItem value="es">🇪🇸 ES</SelectItem>
              <SelectItem value="fr">🇫🇷 FR</SelectItem>
              <SelectItem value="de">🇩🇪 DE</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="hidden sm:flex">
            Login
          </Button>
          <Button className="banking-gradient text-white hover:opacity-90">
            Register
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
