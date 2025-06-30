const Footer = () => {
  return <footer className="bg-banking-navy text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">UnionTrust</h3>
                <p className="text-sm text-blue-200">Capital</p>
              </div>
            </div>
            <p className="text-blue-200 leading-relaxed">
              Empowering your financial future with secure, modern banking solutions 
              tailored to your needs.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Banking</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="#" className="hover:text-white transition-colors">Personal Banking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Business Banking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investment Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Loans & Mortgages</a></li>
            </ul>
          </div>
          
          
          
          
        </div>
        
        <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            © 2024 UnionTrust Capital. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-blue-200 text-sm">Member FDIC</span>
            <span className="text-blue-200 text-sm">Equal Housing Lender</span>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;