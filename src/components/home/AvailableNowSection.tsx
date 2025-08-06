
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

import { ShoppingBag, Sparkles } from 'lucide-react';

const AvailableNowSection = () => {
  const navigate = useNavigate();
  
  // Static price for Pink Ruffle Hat
  const displayPrice = "200.00";
  
  const handleOrderClick = () => {
    navigate('/order', { 
      state: { 
        product: {
          id: 'pink-ruffle-hat',
          title: 'Pink Ruffle Hat',
          priceDisplay: `R${displayPrice}`
        }
      }
    });
  };

  return (
    <div className="mb-12 md:mb-16">
      <div className="text-center mb-6 md:mb-8">
        <h3 className="font-playfair text-2xl md:text-3xl text-black mb-2">Featured Product</h3>
        <div className="flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-pink-500 mr-1" />
          <span className="text-sm text-pink-600 font-medium">Available for Immediate Purchase</span>
          <Sparkles className="h-4 w-4 text-pink-500 ml-1" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6 md:p-8 rounded-xl shadow-lg border border-pink-100">
        <motion.div 
          className="aspect-square relative overflow-hidden rounded-xl shadow-lg group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src="/lovable-uploads/3d200bb5-6fc3-434c-babc-f4df8d2f6f3f.png"
            alt="Pink Ruffle Hat - Handcrafted with care"
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        
        <div className="flex flex-col space-y-4 md:space-y-6">
          <div>
            <h4 className="font-playfair text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Pink Ruffle Hat</h4>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Handcrafted with premium materials, this elegant ruffle hat adds a touch of sophistication to any outfit.
            </p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-pink-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-100 to-transparent rounded-bl-full" />
            <span className="font-medium block mb-2 text-gray-700 text-sm md:text-base">Price:</span>
            <div className="flex items-baseline">
              <span className="text-3xl md:text-4xl font-playfair text-pink-600 font-bold">R{displayPrice}</span>
              <span className="text-sm text-gray-500 ml-2">incl. VAT</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 md:gap-4">
            <Button 
              onClick={handleOrderClick}
              className="bg-pink-600 hover:bg-pink-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              size="lg"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Order Now - Fast Delivery
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/order')}
              className="border-pink-500 text-pink-600 hover:bg-pink-50 hover:border-pink-600 transition-all duration-200"
              size="lg"
            >
              Custom Order Available
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              <span>In Stock</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableNowSection;
