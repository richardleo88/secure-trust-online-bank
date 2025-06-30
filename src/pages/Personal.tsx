
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Personal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-banking-navy mb-4 sm:mb-6">Personal Banking</h1>
            <p className="text-lg sm:text-xl text-banking-slate mb-6 sm:mb-8">
              Discover our comprehensive personal banking solutions designed to meet all your financial needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-banking-navy mb-3 sm:mb-4">Checking Accounts</h3>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">
                  Flexible checking accounts with no monthly fees and unlimited transactions.
                </p>
                <Button className="banking-gradient text-white w-full sm:w-auto">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-banking-navy mb-3 sm:mb-4">Savings Accounts</h3>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">
                  High-yield savings accounts to help your money grow with competitive rates.
                </p>
                <Button className="banking-gradient text-white w-full sm:w-auto">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg md:col-span-2 lg:col-span-1">
                <h3 className="text-lg sm:text-xl font-semibold text-banking-navy mb-3 sm:mb-4">Credit Cards</h3>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">
                  Premium credit cards with rewards, cashback, and exclusive benefits.
                </p>
                <Button className="banking-gradient text-white w-full sm:w-auto">Learn More</Button>
              </div>
            </div>

            <div className="mt-8 sm:mt-12">
              <Button 
                onClick={() => navigate('/login')}
                className="banking-gradient text-white hover:opacity-90 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Personal;
