
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

interface FeaturedItemProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  delay?: number;
  category?: string;
  id?: string;
}

const FeaturedItem: React.FC<FeaturedItemProps> = ({ 
  imageSrc, 
  imageAlt, 
  title, 
  description, 
  delay = 0,
  category,
  id = Math.random().toString(36).substring(7) // Generate a random ID if none provided
}) => {
  const navigate = useNavigate();
  
  // Define prices based on category
  const getPriceDisplay = () => {
    switch(category) {
      case "Shirts":
        return "S: R280 | M: R330 | L: R340";
      case "Cardigans":
        return "S/M: R450 | L: R550";
      case "Tops":
        return "S/M: R400 | L: R500";
      case "Accessories":
        if (title.includes("Beanie")) {
          return "R150";
        }
        return "Price on request";
      default:
        return "Price on request";
    }
  };

  const handleItemClick = () => {
    navigate(`/product/${id}`, { 
      state: { 
        product: {
          id,
          imageSrc,
          imageAlt,
          title,
          description,
          category,
          priceDisplay: getPriceDisplay()
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)" 
      }}
      className="bg-primary dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="aspect-square relative overflow-hidden">
        <motion.img 
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {category && (
          <Badge className="absolute top-3 right-3 bg-black/70 dark:bg-white/80 dark:text-black hover:bg-black/80 dark:hover:bg-white/90">
            {category}
          </Badge>
        )}
      </div>
      <div className="p-6">
        <div className="flex flex-col mb-3">
          <h4 className="font-playfair text-xl text-black dark:text-white mb-1">{title}</h4>
          <motion.div 
            className="mt-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-md shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <span className="font-inter font-semibold text-black dark:text-white text-sm block">
              {getPriceDisplay()}
            </span>
          </motion.div>
        </div>
        <p className="font-inter text-black/80 dark:text-white/80 text-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeaturedItem;
