
import React, { useEffect } from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';
import { useTheme } from '@/hooks/use-theme';

const Index = () => {
  const { theme } = useTheme();
  
  // Apply the appropriate class to the main container
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);
  
  return (
    <div className="min-h-screen bg-primary text-primary-foreground transition-colors duration-300 dark:bg-slate-950 dark:text-white">
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
