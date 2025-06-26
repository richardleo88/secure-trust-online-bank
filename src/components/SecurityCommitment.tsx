
import { Shield, Lock, Eye, Bell } from "lucide-react";

const SecurityCommitment = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "256-bit SSL encryption and multi-layered security protocols protect your data."
    },
    {
      icon: Lock,
      title: "Two-Factor Authentication",
      description: "Additional security layer with SMS, email, or authenticator app verification."
    },
    {
      icon: Eye,
      title: "24/7 Monitoring",
      description: "Continuous fraud monitoring and real-time transaction alerts."
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Immediate alerts for all account activities and suspicious transactions."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-banking-navy mb-4">
            Your Security is Our Priority
          </h2>
          <p className="text-xl text-banking-slate max-w-3xl mx-auto">
            We employ the latest security technologies and best practices to ensure your financial information 
            remains safe and secure at all times.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-banking-navy mb-3">
                  {feature.title}
                </h3>
                <p className="text-banking-slate leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="bg-banking-navy rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            FDIC Insured • Member FDIC
          </h3>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Your deposits are insured up to $250,000 per depositor, per insured bank, 
            for each account ownership category by the Federal Deposit Insurance Corporation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecurityCommitment;
