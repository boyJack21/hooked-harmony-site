
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/components/ui/use-toast';

interface FeaturedItemProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  delay?: number;
  category?: string;
  id?: string;
}

// Create a memoized price display function outside component
const getPriceDisplay = (category?: string, title?: string) => {
  if (category === "Shirts" || title?.includes("Polo")) {
    return "S: R280 | M: R320 | L: R360";
  } else if (title?.includes("Crop Cardigan")) {
    return "S: R350 | M: R400";
  } else if (category === "Cardigans") {
    if (title?.includes("Color Block")) {
      return "S: R500 | M: R540 | L: R600";
    } else if (title?.includes("Long")) {
      return "S: R450 | M: R520 | L: R600";
    }
    return "S: R400 | M: R450 | L: R500";
  } else if (title?.includes("Crop Top") || title?.includes("Ruffled")) {
    return "S: R200 | M: R250 | L: R280";
  } else if (title?.includes("Bikini")) {
    return "S: R170 | M: R200 | L: R230";
  } else if (category === "Accessories") {
    if (title?.includes("Beanie") || title?.includes("Bucket Hat")) {
      return "R150";
    }
    return "Price on request";
  }
  return "Price on request";
};

// Optimized featured item using React.memo to prevent unnecessary re-renders
const FeaturedItem: React.FC<FeaturedItemProps> = React.memo(({ 
  imageSrc, 
  imageAlt, 
  title, 
  description, 
  delay = 0,
  category,
  id = Math.random().toString(36).substring(7) // Generate a random ID if none provided
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const isItemInWishlist = isInWishlist(id);
  
  // Memoize price display to avoid recalculation on re-renders
  const priceDisplay = React.useMemo(() => 
    getPriceDisplay(category, title), [category, title]);
  
  const handleItemClick = React.useCallback(() => {
    navigate(`/product/${id}`, { 
      state: { 
        product: {
          id,
          imageSrc,
          imageAlt,
          title,
          description,
          category,
          priceDisplay
        }
      }
    });
  }, [id, imageSrc, imageAlt, title, description, category, priceDisplay, navigate]);
  
  const handleWishlistToggle = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent item click event
    
    const product = {
      id,
      imageSrc,
      imageAlt,
      title,
      description,
      category,
      priceDisplay
    };
    
    if (isItemInWishlist) {
      removeFromWishlist(id);
      toast({
        title: "Removed from Wishlist",
        description: `${title} has been removed from your wishlist`,
        duration: 2000,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${title} has been added to your wishlist`,
        duration: 2000,
      });
    }
  }, [id, imageSrc, imageAlt, title, description, category, priceDisplay, isItemInWishlist, addToWishlist, removeFromWishlist, toast]);

  // Extremely simplified animations for mobile to reduce performance impact
  const animationProps = isMobile ? {
    initial: { opacity: 0.9 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.2 },
    viewport: { once: true },
  } : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    viewport: { once: true },
    whileHover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)" 
    },
  };

  return (
    <motion.div
      {...animationProps}
      className={`bg-primary dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm transition-all duration-300 h-full cursor-pointer ${isMobile ? 'pb-2' : ''}`}
      onClick={handleItemClick}
    >
      <div className={`relative overflow-hidden ${isMobile ? 'aspect-square' : 'aspect-square'}`}>
        <div className="w-full h-full">
          <img 
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
            width={400}
            height={400}
            decoding="async"
          />
        </div>
        {category && (
          <Badge className="absolute top-3 right-3 bg-black/70 dark:bg-white/80 dark:text-black hover:bg-black/80 dark:hover:bg-white/90">
            {category}
          </Badge>
        )}
        <Button
          variant={isItemInWishlist ? "secondary" : "outline"}
          size="icon"
          className="absolute top-3 left-3 h-8 w-8 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full"
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${isItemInWishlist ? 'fill-current text-red-500' : ''}`} />
        </Button>
      </div>
      <div className={`p-${isMobile ? '3' : '4'}`}>
        <div className="flex flex-col mb-2">
          <h4 className={`font-playfair ${isMobile ? 'text-base' : 'text-xl'} text-black dark:text-white mb-1`}>{title}</h4>
          <div className="mt-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-md shadow-sm">
            <span className={`font-inter font-semibold text-black dark:text-white ${isMobile ? 'text-xs' : 'text-sm'} block`}>
              {priceDisplay}
            </span>
          </div>
        </div>
        {!isMobile && (
          <p className="font-inter text-black/80 dark:text-white/80 text-sm">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
});

FeaturedItem.displayName = "FeaturedItem";

export default FeaturedItem;
