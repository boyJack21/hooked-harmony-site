
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
        <h4 className="font-playfair text-xl mb-2">{title}</h4>
        <p className="font-inter text-primary-foreground/70">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeaturedItem;
