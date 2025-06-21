
import { useState, useEffect, useMemo } from 'react';
import { ProductItem } from '@/components/home/CategoryCarousel';

interface UseSearchProps {
  items: ProductItem[];
  searchTerm: string;
  selectedCategories: string[];
}

export const useSearch = ({ items, searchTerm, selectedCategories }: UseSearchProps) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoized search results
  const searchResults = useMemo(() => {
    let filtered = items;

    // Filter by categories if any are selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => 
        selectedCategories.includes(item.category)
      );
    }

    // Filter by search term if provided
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchLower);
        const descriptionMatch = item.description.toLowerCase().includes(searchLower);
        const categoryMatch = item.category.toLowerCase().includes(searchLower);
        
        return titleMatch || descriptionMatch || categoryMatch;
      });
    }

    return filtered;
  }, [items, debouncedSearchTerm, selectedCategories]);

  const isSearching = searchTerm !== debouncedSearchTerm;
  const hasResults = searchResults.length > 0;
  const resultCount = searchResults.length;

  return {
    searchResults,
    isSearching,
    hasResults,
    resultCount,
    debouncedSearchTerm
  };
};
