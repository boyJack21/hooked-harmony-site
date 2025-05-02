
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
          id: 'pink-floral-hat',
          title: 'Pink Floral Hat',
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
          className="aspect-square relative overflow-hidden rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src="/lovable-uploads/3d200bb5-6fc3-434c-babc-f4df8d2f6f3f.png"
            alt="Pink Floral Hat"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        
        <div className="flex flex-col space-y-4">
          <h4 className="font-playfair text-2xl font-semibold">Pink Floral Hat</h4>
          <p className="text-gray-700">
            Adorable handcrafted pink hat with beautiful decorative flowers. Perfect for spring and summer outings. This charming pink crochet hat features delicate floral embellishments in varying shades of pink.
          </p>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="font-semibold block mb-1">Price:</span>
            <span className="text-xl font-playfair">R150</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleOrderClick}
              className="bg-primary hover:bg-secondary transition-colors"
            >
              Order Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/order')}
              className="border-primary text-primary hover:bg-primary/10"
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
