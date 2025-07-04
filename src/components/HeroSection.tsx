
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleExploreServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleContactUs = () => {
    navigate("/support");
  };

  return (
    <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 banking-gradient overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              {t('hero.title1')}
              <span className="block gold-gradient bg-clip-text text-transparent">
                {t('hero.title2')}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              {t('hero.subtitle')}
            </p>
            
            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4 sm:px-0">
              <Button 
                size="lg" 
                className="gold-gradient text-white hover:opacity-90 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 w-full sm:w-auto" 
                onClick={handleGetStarted}
              >
                {t('hero.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleLearnMore} 
                className="border-2 border-white/80 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-base sm:text-lg font-medium text-white hover:bg-white/20 hover:border-white transition-all duration-300 w-full sm:w-auto"
              >
                {t('hero.learnMore')}
              </Button>
            </div>

            {/* Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center px-4 sm:px-0">
              <Button 
                variant="ghost" 
                onClick={handleExploreServices}
                className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Explore Our Services</span>
                <span className="sm:hidden">Services</span>
              </Button>
              
              <div className="hidden sm:block w-px h-6 bg-blue-300/50"></div>
              
              <Button 
                variant="ghost" 
                onClick={handleContactUs}
                className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Contact Support</span>
                <span className="sm:hidden">Support</span>
              </Button>
              
              <div className="hidden sm:block w-px h-6 bg-blue-300/50"></div>
              
              <Button 
                variant="ghost" 
                onClick={() => navigate("/business")}
                className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Business Banking</span>
                <span className="sm:hidden">Business</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-blue-200 text-xs sm:text-sm px-4 sm:px-0">
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>FDIC Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>1M+ Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;
