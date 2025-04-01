
import React from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';

const Index = () => {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
