
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Loans = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-banking-navy mb-6">Loan Services</h1>
            <p className="text-xl text-banking-slate mb-8">
              Competitive loan solutions to help you achieve your personal and business goals.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Home Mortgages</h3>
                <p className="text-banking-slate mb-4">
                  Competitive mortgage rates and flexible terms for your home purchase or refinancing.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Auto Loans</h3>
                <p className="text-banking-slate mb-4">
                  Low-rate auto loans for new and used vehicles with fast approval process.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Personal Loans</h3>
                <p className="text-banking-slate mb-4">
                  Flexible personal loans for debt consolidation, home improvements, and more.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
            </div>

            <div className="mt-12">
              <Button 
                onClick={() => navigate('/login')}
                className="banking-gradient text-white hover:opacity-90 px-8 py-3 text-lg"
              >
                Apply for a Loan
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Loans;
