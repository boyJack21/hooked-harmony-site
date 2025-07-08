
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

  // Sample data for search functionality - updated with new products and pricing
  const allItems = useMemo(() => [
    {
      id: 'shirt-beige-black',
      title: 'Beige & Black Button Shirt',
      description: 'Stylish short-sleeve shirt with beige base and black stripes with golden details',
      imageSrc: '/lovable-uploads/9294a9a2-018c-4538-9f59-8e98a51a166c.png',
      imageAlt: 'Beige and Black Shirt',
      category: 'Shirts',
      priceDisplay: 'S=R280, M=R320, L=R360'
    },
    {
      id: 'cardigan-navy-button',
      title: 'Navy Button Cardigan',
      description: 'Classic navy blue cardigan with ribbed texture and button closure',
      imageSrc: '/lovable-uploads/a6d0d655-4648-4d2c-8a1b-1e5bdb9884cd.png',
      imageAlt: 'Navy Button Cardigan',
      category: 'Cardigans',
      priceDisplay: 'S=R400, M=R450, L=R500'
    },
    {
      id: 'leg-warmers-gray',
      title: 'Ribbed Leg Warmers',
      description: 'Cozy gray ribbed leg warmers, perfect for layering and staying warm',
      imageSrc: '/lovable-uploads/d7be24c8-6653-4fd7-9cf3-260e5ebe0639.png',
      imageAlt: 'Gray Leg Warmers',
      category: 'Leg Warmers',
      priceDisplay: 'From R100'
    },
    {
      id: 'leg-warmers-cream',
      title: 'Cable Knit Leg Warmers',
      description: 'Elegant cream leg warmers with cable knit pattern, stylish and functional',
      imageSrc: '/lovable-uploads/fdf08431-e067-477f-972f-0b0fe6b32dbb.png',
      imageAlt: 'Cream Leg Warmers',
      category: 'Leg Warmers',
      priceDisplay: 'From R100'
    },
    {
      id: 'accessory-cream-brown-beanie',
      title: 'Two-Tone Beanie',
      description: 'Stylish cream and brown beanie with ribbed texture, perfect for winter',
      imageSrc: '/lovable-uploads/5aa296f8-52ea-47c3-89bc-bdaf4206b4a7.png',
      imageAlt: 'Cream and Brown Beanie',
      category: 'Accessories',
      priceDisplay: 'R150'
    },
    {
      id: 'accessory-blue-beanie',
      title: 'Ocean Blue Beanie',
      description: 'Vibrant blue ribbed beanie with excellent stretch and warmth',
      imageSrc: '/lovable-uploads/6140bc94-40b6-4cd1-81ed-4de76c6c32c6.png',
      imageAlt: 'Blue Ribbed Beanie',
      category: 'Accessories',
      priceDisplay: 'R150'
    },
    {
      id: 'accessory-brown-beanie',
      title: 'Classic Brown Beanie',
      description: 'Rich brown ribbed beanie with EverythingHooked label, perfect for any outfit',
      imageSrc: '/lovable-uploads/d275dcf1-7d00-4422-9fd8-6b017717850b.png',
      imageAlt: 'Brown Ribbed Beanie',
      category: 'Accessories',
      priceDisplay: 'R150'
    },
    {
      id: 'accessory-tote-bag',
      title: 'Natural Tote Bag',
      description: 'Handcrafted natural-colored tote bag with EverythingHooked label, perfect for everyday use',
      imageSrc: '/lovable-uploads/25d8b0e5-c1f2-453b-ac4b-f6a406589f9b.png',
      imageAlt: 'Crochet Tote Bag',
      category: 'Accessories',
      priceDisplay: 'R200'
    },
    {
      id: 'cardigan-red-long',
      title: 'Red Ribbed Long Cardigan',
      description: 'Stunning red long cardigan with ribbed texture and puffy sleeves, perfect for cozy days',
      imageSrc: '/lovable-uploads/745709c6-fff5-4382-8555-07bd30ff28fc.png',
      imageAlt: 'Red Long Cardigan',
      category: 'Cardigans',
      priceDisplay: 'S=R450, M=R520, L=R600'
    },
    {
      id: 'dishcloth-pink-striped',
      title: 'Pink Striped Dishcloth',
      description: 'Handmade pink striped dishcloth, perfect for kitchen use with beautiful crochet pattern',
      imageSrc: '/lovable-uploads/c8fdb45d-3fab-4956-8c57-599c3ed66845.png',
      imageAlt: 'Pink Striped Dishcloth',
      category: 'Accessories',
      priceDisplay: 'Contact EverythingHooked for price'
    }
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
  const categories = ['Cardigans', 'Shirts', 'Tops', 'Summer Sets', 'Accessories', 'Swimwear', 'Baby Clothes', 'Leg Warmers'];

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
