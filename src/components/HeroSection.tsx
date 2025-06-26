
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-16 banking-gradient overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Empowering Your
              <span className="block gold-gradient bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Experience secure, modern banking with 24/7 digital access, instant transfers, 
              and comprehensive financial solutions tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gold-gradient text-white hover:opacity-90 text-lg px-8 py-4">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="border-white Text-white hover:bg-white hover:text-banking-navy text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="w-full max-w-md mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80" 
                alt="Modern banking experience"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 banking-gradient opacity-20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;
