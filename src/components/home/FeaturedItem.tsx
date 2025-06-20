
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from 'lucide-react';
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

const getPriceDisplay = (category?: string, title?: string) => {
  if (category === "Shirts" || title?.includes("Polo")) {
    return "From R280";
  } else if (title?.includes("Crop Cardigan")) {
    return "From R350";
  } else if (category === "Cardigans") {
    if (title?.includes("Color Block")) {
      return "From R500";
    } else if (title?.includes("Long")) {
      return "From R450";
    }
    return "From R400";
  } else if (title?.includes("Crop Top") || title?.includes("Ruffled")) {
    return "From R200";
  } else if (title?.includes("Bikini")) {
    return "From R170";
  } else if (category === "Accessories") {
    if (title?.includes("Beanie") || title?.includes("Bucket Hat")) {
      return "R150";
    }
    return "Custom pricing";
  }
  return "Custom pricing";
};

const FeaturedItem: React.FC<FeaturedItemProps> = React.memo(({ 
  imageSrc, 
  imageAlt, 
  title, 
  description, 
  delay = 0,
  category,
  id = Math.random().toString(36).substring(7)
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const isItemInWishlist = isInWishlist(id);
  
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
    e.stopPropagation();
    
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

  const handleQuickOrder = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/order', { 
      state: { 
        product: {
          id,
          title,
          priceDisplay
        }
      }
    });
  }, [id, title, priceDisplay, navigate]);

  const isPopular = category === "Cardigans" || title.includes("Crop Top");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full cursor-pointer border border-gray-100 hover:border-pink-200"
      onClick={handleItemClick}
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
        <img 
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          width={400}
          height={400}
          decoding="async"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {category && (
            <Badge className="bg-white/90 text-gray-700 hover:bg-white shadow-lg backdrop-blur-sm">
              {category}
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Hot
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <Button
            variant={isItemInWishlist ? "default" : "secondary"}
            size="icon"
            className={`h-10 w-10 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
              isItemInWishlist 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500'
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isItemInWishlist ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg transition-all duration-300"
            onClick={handleQuickOrder}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-3">
        <div className="space-y-2">
          <h4 className="font-playfair text-lg md:text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-300 line-clamp-1">
            {title}
          </h4>
          
          {!isMobile && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-3 py-2 rounded-lg">
            <span className="font-semibold text-pink-600 text-sm md:text-base">
              {priceDisplay}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-3 h-3 text-yellow-400 fill-current"
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.9)</span>
          </div>
        </div>

        <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleQuickOrder}
          >
            Quick Order
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

FeaturedItem.displayName = "FeaturedItem";

export default FeaturedItem;
