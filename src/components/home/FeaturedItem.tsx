
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';
import WishlistButton from '@/components/WishlistButton';

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  category?: string;
  priceDisplay?: string;
}

const FeaturedItem: React.FC<ProductItem> = ({ 
  id, 
  title, 
  description, 
  imageSrc, 
  imageAlt, 
  category,
  priceDisplay 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`, {
      state: {
        product: {
          id,
          title,
          description,
          imageSrc,
          imageAlt,
          category,
          priceDisplay
        }
      }
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <LazyImage
          src={imageSrc}
          alt={imageAlt}
          className={`w-full aspect-square ${
            title.toLowerCase().includes('tote bag') 
              ? 'object-contain bg-gray-50' 
              : 'object-cover'
          }`}
        />
        
        {category && (
          <Badge className="absolute top-3 left-3 bg-black/70 dark:bg-white/80 dark:text-black">
            {category}
          </Badge>
        )}
        
        <div className="absolute top-3 right-3">
          <WishlistButton 
            item={{
              id,
              title,
              description,
              imageSrc,
              imageAlt,
              category,
              priceDisplay
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="font-playfair text-xl font-semibold text-primary-foreground dark:text-white mb-2 group-hover:text-secondary transition-colors">
          {title}
        </h3>
        
        {priceDisplay && (
          <div className="mb-3 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-md shadow-sm">
            <span className="font-inter font-semibold text-primary-foreground dark:text-white text-sm block">
              {priceDisplay}
            </span>
          </div>
        )}
        
        <p className="text-primary-foreground/80 dark:text-white/70 text-sm line-clamp-3">
          {description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-secondary font-medium group-hover:text-secondary/80 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedItem;
