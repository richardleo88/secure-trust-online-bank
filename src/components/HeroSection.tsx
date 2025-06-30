import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const {
    t
  } = useTranslation();
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
  return <section className="relative pt-24 pb-16 banking-gradient overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title1')}
              <span className="block gold-gradient bg-clip-text text-transparent">
                {t('hero.title2')}
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gold-gradient text-white hover:opacity-90 text-lg px-8 py-4" onClick={handleGetStarted}>
                {t('hero.getStarted')}
              </Button>
              <Button size="lg" variant="outline" onClick={handleLearnMore} className="border-white px-8 py-4 bg-orange-50 text-[banking-navy-light] text-banking-navy">
                {t('hero.learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>;
};
export default HeroSection;