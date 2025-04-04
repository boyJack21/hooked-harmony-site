
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/home/Footer';
import { useTheme } from '@/hooks/use-theme';
import SearchFilters, { FilterOptions } from '@/components/search/SearchFilters';

// Define products interface
interface Product {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  category: string;
}

const Index = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: null
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Apply the appropriate class to the main container
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
    // Ensure text color classes are applied
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
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
    // In a real app, this would filter products based on the search term
    console.log('Searching for:', term);
    
    // Scroll to the featured section where results would appear
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handler for filter
  const handleFilter = (filters: FilterOptions) => {
    setActiveFilters(filters);
    // In a real app, this would filter products based on the filters
    console.log('Filtering with:', filters);
  };
  
  return (
    <div className="min-h-screen bg-primary text-primary-foreground transition-colors duration-300 dark:bg-slate-950 dark:text-white">
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
  );
};

export default Index;
