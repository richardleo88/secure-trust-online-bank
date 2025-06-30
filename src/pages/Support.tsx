
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-banking-navy mb-4 sm:mb-6">Customer Support</h1>
            <p className="text-lg sm:text-xl text-banking-slate mb-6 sm:mb-8">
              We're here to help you with all your banking needs. Get in touch with our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="h-full">
              <CardHeader>
                <Phone className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">Speak directly with our customer service representatives.</p>
                <p className="font-semibold text-banking-navy text-sm sm:text-base">1-800-UNION-TRUST</p>
                <p className="text-xs sm:text-sm text-banking-slate">Available 24/7</p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <Mail className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">Send us an email and we'll respond within 24 hours.</p>
                <p className="font-semibold text-banking-navy text-sm sm:text-base break-all">support@uniontrust.com</p>
                <p className="text-xs sm:text-sm text-banking-slate">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="h-full md:col-span-2 lg:col-span-1">
              <CardHeader>
                <MessageCircle className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-banking-slate mb-3 sm:mb-4 text-sm sm:text-base">Chat with our support team in real-time.</p>
                <Button className="banking-gradient text-white w-full">Start Chat</Button>
                <p className="text-xs sm:text-sm text-banking-slate mt-2">Available 24/7</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="h-full">
              <CardHeader>
                <MapPin className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Branch Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-semibold text-banking-navy text-sm sm:text-base">Downtown Branch</h4>
                    <p className="text-banking-slate text-xs sm:text-sm">123 Main Street, Downtown, NY 10001</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-banking-navy text-sm sm:text-base">Uptown Branch</h4>
                    <p className="text-banking-slate text-xs sm:text-sm">456 Broadway, Uptown, NY 10002</p>
                  </div>
                  <Button variant="outline" className="w-full">Find All Locations</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <Clock className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Saturday:</span>
                    <span className="font-semibold">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-4 text-sm sm:text-base">
                    <span>Online Banking:</span>
                    <span className="font-semibold">24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button 
              onClick={() => navigate('/login')}
              className="banking-gradient text-white hover:opacity-90 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Access Your Account
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
