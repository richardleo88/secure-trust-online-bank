
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Investments = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-banking-navy mb-6">Investment Services</h1>
            <p className="text-xl text-banking-slate mb-8">
              Build your wealth with our comprehensive investment and wealth management services.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Portfolio Management</h3>
                <p className="text-banking-slate mb-4">
                  Professional portfolio management tailored to your investment goals and risk tolerance.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Retirement Planning</h3>
                <p className="text-banking-slate mb-4">
                  Comprehensive retirement planning services to secure your financial future.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-banking-navy mb-4">Wealth Advisory</h3>
                <p className="text-banking-slate mb-4">
                  Expert wealth advisory services for high-net-worth individuals and families.
                </p>
                <Button className="banking-gradient text-white">Learn More</Button>
              </div>
            </div>

            <div className="mt-12">
              <Button 
                onClick={() => navigate('/login')}
                className="banking-gradient text-white hover:opacity-90 px-8 py-3 text-lg"
              >
                Start Investing
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Investments;
