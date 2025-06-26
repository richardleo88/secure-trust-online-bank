
import { useState } from "react";

const ATMCardShowcase = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-banking-navy mb-4">
          Your Premium Banking Card
        </h2>
        <p className="text-xl text-banking-slate mb-12 max-w-2xl mx-auto">
          Experience the future of banking with our premium debit and credit cards, 
          designed for security and convenience.
        </p>
        
        <div className="flex justify-center mb-8">
          <div 
            className="relative w-96 h-60 cursor-pointer card-3d"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`absolute inset-0 w-full h-full transition-transform duration-700 card-face ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front of card */}
              <div className="w-full h-full banking-gradient rounded-2xl p-6 shadow-2xl text-white flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">UnionTrust Capital</h3>
                    <p className="text-sm opacity-80">Premium Account</p>
                  </div>
                  <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
                    <div className="w-6 h-6 bg-gold-gradient rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-2xl font-mono tracking-wider mb-2">
                    •••• •••• •••• 1234
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80">VALID THRU</p>
                      <p className="text-sm font-mono">12/28</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">JOHN DOE</p>
                      <p className="text-xs opacity-80">CARDHOLDER</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`absolute inset-0 w-full h-full transition-transform duration-700 card-face card-back ${isFlipped ? '' : 'rotate-y-180'}`}>
              {/* Back of card */}
              <div className="w-full h-full bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="h-12 bg-black mt-6"></div>
                <div className="p-6">
                  <div className="bg-white h-8 rounded mb-4 flex items-center justify-end pr-4">
                    <span className="text-black text-sm font-mono">123</span>
                  </div>
                  <div className="text-white text-xs space-y-2">
                    <p>This card is property of UnionTrust Capital</p>
                    <p>If found, please return to any branch</p>
                    <p className="font-mono">Customer Service: 1-800-UNION-TC</p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="text-white text-lg font-bold">
                      UNIONTRUST
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-banking-slate">Click the card to see both sides</p>
      </div>
    </section>
  );
};

export default ATMCardShowcase;
