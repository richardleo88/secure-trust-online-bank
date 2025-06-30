
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Personal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-banking-navy mb-6">Personal Banking</h1>
            <p className="text-xl text-banking-slate mb-8">
              Discover our comprehensive personal banking solutions designed to meet all your financial needs.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Checking Accounts</h3>
                <p className="text-banking-slate mb-4">
                  Flexible checking accounts with no monthly fees and unlimited transactions.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Savings Accounts</h3>
                <p className="text-banking-slate mb-4">
                  High-yield savings accounts to help your money grow with competitive rates.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Credit Cards</h3>
                <p className="text-banking-slate mb-4">
                  Premium credit cards with rewards, cashback, and exclusive benefits.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
            </div>

            <div className="mt-12">
              <Button 
                onClick={() => navigate('/login')}
                className="banking-gradient text-white hover:opacity-90 px-8 py-3 text-lg"
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
