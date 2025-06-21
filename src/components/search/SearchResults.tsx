
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { ProductItem } from '@/components/home/CategoryCarousel';
import FeaturedItem from '@/components/home/FeaturedItem';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  results: ProductItem[];
  isSearching: boolean;
  hasResults: boolean;
  resultCount: number;
  searchTerm: string;
  selectedCategories: string[];
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isSearching,
  hasResults,
  resultCount,
  searchTerm,
  selectedCategories
}) => {
  const showFilters = searchTerm || selectedCategories.length > 0;

  if (isSearching) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <Search className="w-4 h-4 animate-pulse" />
            <span>Searching...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (showFilters && !hasResults) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any products matching your search criteria.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Try adjusting your search terms or filters:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check spelling</li>
              <li>Use more general terms</li>
              <li>Remove some filters</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {resultCount} {resultCount === 1 ? 'result' : 'results'} found
            </span>
            {searchTerm && (
              <Badge variant="outline" className="text-xs">
                "{searchTerm}"
              </Badge>
            )}
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {results.map((item, index) => (
          <motion.div
            key={`${item.title}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <FeaturedItem {...item} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchResults;
