import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import CpicSection from "@/components/landing/CpicSection";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import AboutSection from "@/components/landing/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <CpicSection />
      <WhatWeDoSection />
      <AboutSection />
    </div>
  );
};

export default Index;
