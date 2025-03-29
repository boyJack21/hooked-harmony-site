
import React from 'react';
import { motion } from 'framer-motion';

interface FeaturedItemProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  delay?: number;
}

const FeaturedItem: React.FC<FeaturedItemProps> = ({ 
  imageSrc, 
  imageAlt, 
  title, 
  description, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative">
        <img 
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-playfair text-xl text-black">{title}</h4>
          <span className="font-inter font-semibold text-black">R0</span>
        </div>
        <p className="font-inter text-black/80">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeaturedItem;
