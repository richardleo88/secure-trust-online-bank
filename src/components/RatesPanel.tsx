
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RatesPanel = () => {
  const rates = [
    {
      type: "Savings Account",
      rate: "4.25%",
      apy: "APY",
      description: "High-yield savings with no minimum balance"
    },
    {
      type: "Certificate of Deposit",
      rate: "5.15%",
      apy: "APY",
      description: "12-month CD with guaranteed returns"
    },
    {
      type: "Home Mortgage",
      rate: "6.75%",
      apy: "APR",
      description: "30-year fixed rate mortgage"
    },
    {
      type: "Personal Loan",
      rate: "8.99%",
      apy: "APR",
      description: "Unsecured personal loans up to $50,000"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-banking-navy mb-4">
            Competitive Rates
          </h2>
          <p className="text-xl text-banking-slate max-w-2xl mx-auto">
            Get the most out of your money with our industry-leading rates and terms.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rates.map((rate, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-banking-navy">
                  {rate.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold gold-gradient bg-clip-text text-transparent">
                    {rate.rate}
                  </span>
                  <span className="text-sm text-banking-slate ml-1">
                    {rate.apy}
                  </span>
                </div>
                <p className="text-sm text-banking-slate text-center">
                  {rate.description}
                </p>
                <div className="mt-4 text-center">
                  <button className="text-banking-navy hover:text-banking-navy-light font-semibold text-sm">
                    Learn More →
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-banking-slate">
            Rates are subject to change. Terms and conditions apply.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RatesPanel;
