
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Business = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-banking-navy mb-6">Business Banking</h1>
            <p className="text-xl text-banking-slate mb-8">
              Comprehensive business banking solutions to help your company grow and succeed.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Business Checking</h3>
                <p className="text-banking-slate mb-4">
                  Professional checking accounts with advanced features for businesses of all sizes.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Business Loans</h3>
                <p className="text-banking-slate mb-4">
                  Flexible financing solutions to fuel your business growth and expansion.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Merchant Services</h3>
                <p className="text-banking-slate mb-4">
                  Complete payment processing solutions for your business operations.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
            </div>

            <div className="mt-12">
              <Button 
                onClick={() => navigate('/login')}
                className="banking-gradient text-white hover:opacity-90 px-8 py-3 text-lg"
              >
                Start Banking with Us
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Business;
