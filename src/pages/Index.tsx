
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ATMCardShowcase from "@/components/ATMCardShowcase";
import FeaturesPreview from "@/components/FeaturesPreview";
import RatesPanel from "@/components/RatesPanel";
import BankPhotosCarousel from "@/components/BankPhotosCarousel";
import Testimonials from "@/components/Testimonials";
import SecurityCommitment from "@/components/SecurityCommitment";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ATMCardShowcase />
      <FeaturesPreview />
      <RatesPanel />
      <BankPhotosCarousel />
      <Testimonials />
      <SecurityCommitment />
      <Footer />
      <LiveChat />
    </div>
  );
};

export default Index;
