
import React from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import SearchFilters, { FilterOptions } from '@/components/search/SearchFilters';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the background animation to improve initial load time
const BackgroundAnimation = lazy(() => import('@/components/home/BackgroundAnimation'));

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: null
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  // Extract unique categories from featured products
  useEffect(() => {
    const categories = [
      "Cardigans",
      "Tops", 
      "Shirts",
      "Summer Sets",
      "Accessories",
      "Swimwear",
      "Baby Clothes"
    ];
    setAvailableCategories(categories);
  }, []);

  // Handler for search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // Scroll to the featured section where results would appear
    const featuredSection = document.getElementById('featured');
    if (featuredSection) {
      const yOffset = -80; // header offset
      const y = featuredSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Handler for filter
  const handleFilter = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };
  
  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <Suspense fallback={null}>
        <BackgroundAnimation />
      </Suspense>
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        
        <div className="container mx-auto px-4 py-8">
          <SearchFilters 
            onSearch={handleSearch}
            onFilter={handleFilter}
            categories={availableCategories}
            activeFilters={activeFilters}
          />
        </div>
        
        <FeaturedSection />
        <TestimonialsSection />
        <AboutSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
