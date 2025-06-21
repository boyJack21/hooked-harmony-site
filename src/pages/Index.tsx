
import React from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';
import SearchFilters, { FilterOptions } from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearch } from '@/hooks/useSearch';
import { ProductItem } from '@/components/home/CategoryCarousel';

const BackgroundAnimation = lazy(() => import('@/components/home/BackgroundAnimation'));

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: null
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [featuredItems, setFeaturedItems] = useState<ProductItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const isMobile = useIsMobile();
  
  const searchResults = useSearch({
    items: featuredItems,
    searchTerm,
    selectedCategories: activeFilters.categories
  });

  useEffect(() => {
    const categories = [
      "Shirts",
      "Cardigans", 
      "Tops",
      "Summer Sets",
      "Accessories",
      "Swimwear",
      "Baby Clothes"
    ];
    setAvailableCategories(categories);

    // Initialize featured items
    const items: ProductItem[] = [
      {
        imageSrc: "/lovable-uploads/292bcef9-b482-4906-b037-def69ad64fbf.png",
        imageAlt: "Brown and Pink Cardigan",
        title: "Cozy Two-Tone Cardigan",
        description: "Handcrafted cardigan in brown with pink accents, perfect for chilly evenings",
        category: "Cardigans"
      },
      {
        imageSrc: "/lovable-uploads/7c1dfbee-f9f7-4b62-8b0d-ab7c5d1d2990.png",
        imageAlt: "Color Block Cardigan",
        title: "Color Block Cardigan",
        description: "Stylish layered cardigan with cream, tan, brown and gray color blocks",
        category: "Cardigans"
      },
      {
        imageSrc: "/lovable-uploads/d6ea798a-68f0-4e4c-8a0e-6b0d606189db.png",
        imageAlt: "Cream Cardigan",
        title: "Cream Button Cardigan",
        description: "Elegant cream cardigan with buttons and balloon sleeves",
        category: "Cardigans"
      },
      {
        imageSrc: "/lovable-uploads/d910cf04-5989-46cf-8bc7-a9bcb94356b4.png",
        imageAlt: "Blue Summer Set",
        title: "Summer Beach Set",
        description: "Stylish blue and white checkered set including a hat and accessories",
        category: "Summer Sets"
      },
      {
        imageSrc: "/lovable-uploads/3b8fc3fe-1891-426b-9f1c-7e6d61851ee4.png",
        imageAlt: "Cream Crop Top",
        title: "Ruffled Crop Top",
        description: "Delicate cream crop top with ruffle details and tie front",
        category: "Tops"
      },
      {
        imageSrc: "/lovable-uploads/d977b0bc-aa7a-49ea-9d6a-c37dbe6e71b9.png",
        imageAlt: "White Crop Top",
        title: "Summer Crop Top",
        description: "Elegant white crochet crop top with tie-back design, perfect for summer days",
        category: "Tops"
      },
      {
        imageSrc: "/lovable-uploads/8e8b348c-460f-4202-b822-cce533c16d65.png",
        imageAlt: "Beige Polo Shirt",
        title: "Classic Beige Polo",
        description: "Comfortable and breathable beige polo shirt, ideal for casual outings",
        category: "Shirts"
      },
      {
        imageSrc: "/lovable-uploads/5b1caa4b-5579-450f-84f4-c46a9c909ab8.png",
        imageAlt: "Beige and Brown Shirt",
        title: "Two-Tone Button Shirt",
        description: "Elegant beige and brown button-up shirt with contrasting detail",
        category: "Shirts"
      },
      {
        imageSrc: "/lovable-uploads/08cd791a-6b34-44fb-abb5-b8b113488695.png",
        imageAlt: "Sky Blue Crochet Polo",
        title: "Sky Blue Crochet Polo",
        description: "Lightweight and breathable sky blue crochet polo shirt, perfect for summer days",
        category: "Shirts"
      },
      {
        imageSrc: "/lovable-uploads/e255fe3b-ce35-4980-87aa-3b593d0d626d.png",
        imageAlt: "Orange Bikini Set",
        title: "Vibrant Bikini Set",
        description: "Bright orange crochet bikini, perfect for beach days and pool parties",
        category: "Swimwear"
      },
      {
        imageSrc: "/lovable-uploads/cca20f48-3399-428c-9418-804bf8a9c508.png",
        imageAlt: "Green Beanie",
        title: "Emerald Beanie",
        description: "Warm and stylish green beanie, perfect for cold winter days",
        category: "Accessories"
      },
      {
        imageSrc: "/lovable-uploads/68f87ec2-6bd6-4657-a718-151d2cecfa27.png",
        imageAlt: "Bucket Hats Collection",
        title: "Bucket Hat Collection",
        description: "Stylish bucket hats in various colors, perfect for sun protection with a fashion twist",
        category: "Accessories"
      },
      {
        imageSrc: "/lovable-uploads/2f2c964c-4ac4-47b6-8b6f-ed4fc2667b3c.png",
        imageAlt: "Baby Dress",
        title: "Baby Girl Dress",
        description: "Adorable gray crochet dress for babies, perfect for special occasions",
        category: "Baby Clothes"
      }
    ];
    setFeaturedItems(items);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setShowSearchResults(!!term || activeFilters.categories.length > 0);
    
    if (term) {
      const featuredSection = document.getElementById('featured');
      if (featuredSection) {
        const yOffset = -80;
        const y = featuredSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleFilter = (filters: FilterOptions) => {
    setActiveFilters(filters);
    setShowSearchResults(!!searchTerm || filters.categories.length > 0);
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
        
        {showSearchResults ? (
          <section id="featured" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 lg:px-6">
              <SearchResults 
                results={searchResults.searchResults}
                isSearching={searchResults.isSearching}
                hasResults={searchResults.hasResults}
                resultCount={searchResults.resultCount}
                searchTerm={searchTerm}
                selectedCategories={activeFilters.categories}
              />
            </div>
          </section>
        ) : (
          <FeaturedSection />
        )}
        
        <AboutSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
