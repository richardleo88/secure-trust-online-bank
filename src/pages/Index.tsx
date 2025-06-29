
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesPreview from "@/components/FeaturesPreview";
import SecurityCommitment from "@/components/SecurityCommitment";
import Testimonials from "@/components/Testimonials";
import RatesPanel from "@/components/RatesPanel";
import BankPhotosCarousel from "@/components/BankPhotosCarousel";
import ATMCardShowcase from "@/components/ATMCardShowcase";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import LanguageWelcomeModal from "@/components/LanguageWelcomeModal";

const Index = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users based on their role
    if (!loading && user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesPreview />
      <SecurityCommitment />
      <ATMCardShowcase />
      <RatesPanel />
      <BankPhotosCarousel />
      <Testimonials />
      <Footer />
      <LiveChat />
      <LanguageWelcomeModal />
    </div>
  );
};

export default Index;
