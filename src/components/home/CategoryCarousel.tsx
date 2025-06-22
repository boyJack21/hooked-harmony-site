
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Crown, Star } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FeaturedItem from './FeaturedItem';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ProductItem {
  id?: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  category: string;
  priceDisplay?: string;
}

interface CategoryCarouselProps {
  category: string;
  items: ProductItem[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ category, items }) => {
  const isMobile = useIsMobile();
  
  const isBestseller = category === "Cardigans";
  const isNew = category === "Summer Sets" || category === "Tops";
  
  return (
    <div className="mb-16 md:mb-20">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-8 md:mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-playfair text-2xl md:text-4xl font-bold text-gray-900">
              {category}
            </h3>
            {isBestseller && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-sm font-semibold flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Bestseller
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 text-sm font-semibold flex items-center gap-1">
                <Star className="w-3 h-3" />
                New
              </Badge>
            )}
          </div>
        </div>
        
        <motion.button
          whileHover={{ x: 5 }}
          className="hidden md:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: false,
          watchDrag: true,
          skipSnaps: false,
        }}
        className="w-full"
      >
        <CarouselContent className="pb-4 -ml-2 md:-ml-4">
          {items.map((item, index) => (
            <CarouselItem 
              key={index} 
              className={`pl-2 md:pl-4 ${
                isMobile 
                  ? "basis-[85%]" 
                  : "md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="h-full overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 ring-1 ring-gray-100">
                  <CardContent className="p-0 h-full">
                    <FeaturedItem
                      id={item.id || `${category}-${index}`}
                      imageSrc={item.imageSrc}
                      imageAlt={item.imageAlt}
                      title={item.title}
                      description={item.description}
                      category={category}
                      priceDisplay={item.priceDisplay}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex justify-center md:justify-end gap-3 mt-6">
          <CarouselPrevious className="static translate-y-0 bg-white hover:bg-pink-50 border border-gray-200 hover:border-pink-300 text-gray-600 hover:text-pink-600 shadow-lg hover:shadow-xl transition-all duration-300" />
          <CarouselNext className="static translate-y-0 bg-white hover:bg-pink-50 border border-gray-200 hover:border-pink-300 text-gray-600 hover:text-pink-600 shadow-lg hover:shadow-xl transition-all duration-300" />
        </div>
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
