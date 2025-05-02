
import React from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';
import SearchFilters, { FilterOptions } from '@/components/search/SearchFilters';
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the background animation to improve initial load time
const BackgroundAnimation = lazy(() => import('@/components/home/BackgroundAnimation'));

// Define products interface
interface Product {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  category: string;
}

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
    // This would typically come from an API in a real app
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
    // Use a more efficient smooth scroll implementation
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
    <div className="min-h-screen bg-primary text-primary-foreground relative">
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
        <AboutSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
