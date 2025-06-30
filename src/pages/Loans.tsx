
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Loans = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-banking-navy mb-4 sm:mb-6">Loan Services</h1>
            <p className="text-lg sm:text-xl text-banking-slate mb-6 sm:mb-8">
              Competitive loan solutions to help you achieve your personal and business goals.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-banking-navy mb-3 sm:mb-4">Home Mortgages</h3>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">
                  Competitive mortgage rates and flexible terms for your home purchase or refinancing.
                </p>
                <Button className="banking-gradient text-white w-full sm:w-auto">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-banking-navy mb-3 sm:mb-4">Auto Loans</h3>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">
                  Low-rate auto loans for new and used vehicles with fast approval process.
                </p>
                <Button className="banking-gradient text-white w-full sm:w-auto">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6 rounded-lg md:col-span-2 lg:col-span-1">
                <h3 className="text-lg sm:text-xl font-semibold text-banking-navy mb-3 sm:mb-4">Personal Loans</h3>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">
                  Flexible personal loans for debt consolidation, home improvements, and more.
                </p>
                <Button className="banking-gradient text-white w-full sm:w-auto">Learn More</Button>
              </div>
            </div>

            <div className="mt-8 sm:mt-12">
              <Button 
                onClick={() => navigate('/login')}
                className="banking-gradient text-white hover:opacity-90 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
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
