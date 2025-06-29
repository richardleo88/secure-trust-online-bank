
import { useState } from "react";
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

const Header = () => {
  const [language, setLanguage] = useState("en");
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
    setLanguage(value);
    // Here you would typically implement actual language switching logic
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

        <div className="flex items-center space-x-2 md:space-x-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-16 md:w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 EN</SelectItem>
              <SelectItem value="es">🇪🇸 ES</SelectItem>
              <SelectItem value="fr">🇫🇷 FR</SelectItem>
              <SelectItem value="de">🇩🇪 DE</SelectItem>
            </SelectContent>
          </Select>

          {/* Desktop Login/Register */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleLogin}>
              Sign In
            </Button>
            <Button className="banking-gradient text-white hover:opacity-90" size="sm" onClick={handleRegister}>
              Sign Up
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
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Navigation */}
                <div className="space-y-3">
                  <a href="#personal" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    Personal
                  </a>
                  <a href="#business" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    Business
                  </a>
                  <a href="#investments" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    Investments
                  </a>
                  <a href="#loans" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    Loans
                  </a>
                  <a href="#support" className="block text-lg text-banking-slate hover:text-banking-navy transition-colors">
                    Support
                  </a>
                </div>

                {/* Mobile Login/Register */}
                <div className="pt-6 border-t space-y-3">
                  <Button variant="outline" className="w-full" size="lg" onClick={handleLogin}>
                    Sign In
                  </Button>
                  <Button className="banking-gradient text-white hover:opacity-90 w-full" size="lg" onClick={handleRegister}>
                    Sign Up
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
