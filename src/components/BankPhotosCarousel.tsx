
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BankPhotosCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bankPhotos = [
    {
      url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Banking Experience",
      description: "State-of-the-art digital banking solutions"
    },
    {
      url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
      title: "Professional Service",
      description: "Expert financial advisors at your service"
    },
    {
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      title: "Digital First Approach",
      description: "Banking that fits your lifestyle"
    },
    {
      url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=1200&q=80",
      title: "Comfortable Banking",
      description: "Relax while we handle your finances"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bankPhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bankPhotos.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bankPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bankPhotos.length) % bankPhotos.length);
  };

  return (
    <section className="py-20 bg-banking-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience UnionTrust Capital
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            See how we're revolutionizing banking with modern technology and personal service.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            {bankPhotos.map((photo, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{photo.title}</h3>
                  <p className="text-blue-200">{photo.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="flex justify-center mt-6 space-x-2">
            {bankPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankPhotosCarousel;
