
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AvailableNowSection = () => {
  const navigate = useNavigate();
  
  const handleOrderClick = () => {
    navigate('/order', { 
      state: { 
        product: {
          id: 'pink-ruffle-hat',
          title: 'Pink Ruffle Hat',
          priceDisplay: 'R150'
        }
      }
    });
  };

  return (
    <div className="mb-16">
      <h3 className="font-playfair text-3xl text-black mb-6">Available for Purchase</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-lg shadow-sm">
        <motion.div 
          className="aspect-square relative overflow-hidden rounded-lg shadow-md"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src="/lovable-uploads/3d200bb5-6fc3-434c-babc-f4df8d2f6f3f.png"
            alt="Pink Ruffle Hat"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </motion.div>
        
        <div className="flex flex-col space-y-6">
          <h4 className="font-playfair text-3xl font-semibold text-gray-800">Pink Ruffle Hat</h4>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-pink-200">
            <span className="font-semibold block mb-2 text-gray-700">Price:</span>
            <span className="text-3xl font-playfair text-pink-600 font-bold">R150</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleOrderClick}
              className="bg-pink-500 hover:bg-pink-600 text-white transition-colors shadow-md"
              size="lg"
            >
              Order Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/order')}
              className="border-pink-500 text-pink-600 hover:bg-pink-50 transition-colors"
              size="lg"
            >
              Custom Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableNowSection;
