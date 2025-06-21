
import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchFiltersProps {
  onSearch: (term: string) => void;
  onFilter: (filters: FilterOptions) => void;
  categories: string[];
  activeFilters: FilterOptions;
}

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number] | null;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onSearch, 
  onFilter, 
  categories,
  activeFilters
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(activeFilters.categories || []);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleSearchEvent = (event: CustomEvent) => {
      const { searchTerm } = event.detail;
      setSearchTerm(searchTerm);
      onSearch(searchTerm);
    };

    window.addEventListener('searchProducts', handleSearchEvent as EventListener);
    return () => {
      window.removeEventListener('searchProducts', handleSearchEvent as EventListener);
    };
  }, [onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories: string[];
    
    if (checked) {
      newCategories = [...selectedCategories, category];
    } else {
      newCategories = selectedCategories.filter(c => c !== category);
    }
    
    setSelectedCategories(newCategories);
    
    onFilter({
      ...activeFilters,
      categories: newCategories
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
    onFilter({
      categories: [],
      priceRange: null
    });
    onSearch('');
  };

  const renderFilterContent = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <div className="mb-6 space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-lg bg-white dark:bg-gray-800"
          />
          <Button type="submit" size="icon">
            <Search size={18} />
          </Button>
        </form>
        
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <Filter size={16} /> Filters
          </h2>
          {renderFilterContent()}
          
          <div className="flex justify-between mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(cat => (
                <Badge key={cat} variant="secondary" className="px-2 py-1">
                  {cat}
                </Badge>
              ))}
            </div>
            {(selectedCategories.length > 0 || searchTerm) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white dark:bg-gray-800"
          />
          <Button type="submit" size="icon">
            <Search size={18} />
          </Button>
        </form>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter size={18} />
              {selectedCategories.length > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white dark:bg-gray-800">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            
            <div className="py-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="categories">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                          />
                          <Label htmlFor={`mobile-category-${category}`}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <SheetFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={clearFilters}>
                  Clear all
                </Button>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {(selectedCategories.length > 0 || searchTerm) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="outline" className="px-2 py-1">
              Search: {searchTerm}
            </Badge>
          )}
          {selectedCategories.map(cat => (
            <Badge key={cat} variant="secondary" className="px-2 py-1">
              {cat}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
