
import React from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
