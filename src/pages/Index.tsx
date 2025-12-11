import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarketplacePreview from "@/components/MarketplacePreview";
import SwipePreview from "@/components/SwipePreview";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <MarketplacePreview />
      <SwipePreview />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;