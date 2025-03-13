
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderFormHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center mb-8"
    >
      <ShoppingBag className="mr-2 h-8 w-8 text-secondary" />
      <h2 className="font-playfair text-4xl font-bold">Place Your Order</h2>
    </motion.div>
  );
};
