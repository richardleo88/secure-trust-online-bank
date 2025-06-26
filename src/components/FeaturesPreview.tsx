
import { CreditCard, Clock, Users, Globe } from "lucide-react";

const FeaturesPreview = () => {
  const features = [
    {
      icon: Clock,
      title: "Digital Banking 24/7",
      description: "Access your accounts anytime, anywhere with our secure mobile and web platforms."
    },
    {
      icon: Users,
      title: "Personal & Business Accounts",
      description: "Comprehensive banking solutions for individuals, families, and businesses of all sizes."
    },
    {
      icon: CreditCard,
      title: "Instant Transfers",
      description: "Send money instantly to friends, family, or pay bills with our lightning-fast transfer system."
    },
    {
      icon: Globe,
      title: "International Payments",
      description: "Send money globally with competitive exchange rates and low fees."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-banking-navy mb-4">
            Banking Made Simple
          </h2>
          <p className="text-xl text-banking-slate max-w-3xl mx-auto">
            Experience modern banking with features designed to make your financial life easier and more secure.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 banking-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <Icon className="w-8 h-8 text-white" />
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
      </div>
    </section>
  );
};

export default FeaturesPreview;
