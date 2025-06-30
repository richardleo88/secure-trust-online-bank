
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
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-banking-navy mb-6">Customer Support</h1>
            <p className="text-xl text-banking-slate mb-8">
              We're here to help you with all your banking needs. Get in touch with our support team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-banking-slate mb-4">Speak directly with our customer service representatives.</p>
                <p className="font-semibold text-banking-navy">1-800-UNION-TRUST</p>
                <p className="text-sm text-banking-slate">Available 24/7</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-banking-slate mb-4">Send us an email and we'll respond within 24 hours.</p>
                <p className="font-semibold text-banking-navy">support@uniontrust.com</p>
                <p className="text-sm text-banking-slate">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-banking-slate mb-4">Chat with our support team in real-time.</p>
                <Button className="banking-gradient text-white w-full">Start Chat</Button>
                <p className="text-sm text-banking-slate mt-2">Available 24/7</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Branch Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-banking-navy">Downtown Branch</h4>
                    <p className="text-banking-slate">123 Main Street, Downtown, NY 10001</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-banking-navy">Uptown Branch</h4>
                    <p className="text-banking-slate">456 Broadway, Uptown, NY 10002</p>
                  </div>
                  <Button variant="outline" className="w-full">Find All Locations</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-4">
                    <span>Online Banking:</span>
                    <span className="font-semibold">24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/login')}
              className="banking-gradient text-white hover:opacity-90 px-8 py-3 text-lg"
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
