
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import AvailableNowSection from '@/components/home/AvailableNowSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import SearchFilters, { FilterOptions } from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import RecentlyViewed from '@/components/RecentlyViewed';
import { useSearch } from '@/hooks/useSearch';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // Sample data for search functionality
  const allItems = useMemo(() => [
    {
      id: '1',
      title: 'Pink Ruffle Hat',
      description: 'Adorable handmade pink ruffle hat perfect for babies and toddlers',
      imageSrc: '/lovable-uploads/3b8fc3fe-1891-426b-9f1c-7e6d61851ee4.png',
      imageAlt: 'Pink Ruffle Hat',
      category: 'Hats',
      priceDisplay: 'From R200'
    },
    {
      id: '2',
      title: 'Cozy Baby Blanket',
      description: 'Soft and warm handmade baby blanket in beautiful colors',
      imageSrc: '/lovable-uploads/d6ea798a-68f0-4e4c-8a0e-6b0d606189db.png',
      imageAlt: 'Baby Blanket',
      category: 'Blankets',
      priceDisplay: 'From R350'
    },
    // Add more items as needed
  ], []);

  const {
    searchResults,
    isSearching,
    hasResults,
    resultCount,
    debouncedSearchTerm
  } = useSearch({
    items: allItems,
    searchTerm,
    selectedCategories
  });

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setShowSearch(term.length > 0 || selectedCategories.length > 0);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setSelectedCategories(filters.categories);
    setShowSearch(filters.categories.length > 0 || searchTerm.length > 0);
  };

  const showMainContent = !showSearch || (showSearch && searchTerm.length === 0 && selectedCategories.length === 0);
  const categories = ['Hats', 'Blankets', 'Cardigans', 'Tops', 'Shirts', 'Summer Sets'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        showSearch={showSearch}
      />
      
      <main>
        {showSearch && (
          <div className="container mx-auto px-4 py-8">
            <Breadcrumbs className="mb-6" />
            
            <SearchFilters
              onSearch={handleSearchChange}
              onFilter={handleFilterChange}
              categories={categories}
              activeFilters={{
                categories: selectedCategories,
                priceRange: null
              }}
            />
            
            <SearchResults
              results={searchResults}
              isSearching={isSearching}
              hasResults={hasResults}
              resultCount={resultCount}
              searchTerm={debouncedSearchTerm}
              selectedCategories={selectedCategories}
            />
          </div>
        )}

        {showMainContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection />
            <RecentlyViewed />
            <FeaturedSection />
            <AvailableNowSection />
            <AboutSection />
            <ContactSection />
            <FAQSection />
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
