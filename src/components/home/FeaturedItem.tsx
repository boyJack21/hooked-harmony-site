
import React from 'react';
import { motion } from 'framer-motion';

interface FeaturedItemProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  delay?: number;
  category?: string;
}

const FeaturedItem: React.FC<FeaturedItemProps> = ({ 
  imageSrc, 
  imageAlt, 
  title, 
  description, 
  delay = 0,
  category
}) => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full"
    >
      <div className="aspect-square relative">
        <img 
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-playfair text-xl text-black">{title}</h4>
          <span className="font-inter font-semibold text-black text-right">
            {getPriceDisplay()}
          </span>
        </div>
        <p className="font-inter text-black/80">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeaturedItem;
