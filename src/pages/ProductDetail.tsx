
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { useToast } from '@/components/ui/use-toast';
import RecommendedProducts from '@/components/product/RecommendedProducts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductDetailProps {}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const product = location.state?.product;
  
  // Handle case where user navigates directly to this page without product data
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Product not found</h2>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const handleOrderNow = () => {
    toast({
      title: "Order initiated",
      description: "You'll be redirected to our order form",
      duration: 3000,
    });
    
    // Navigate to the order page with the product information
    navigate('/order', { state: { product } });
  };
  
  const handleAddToWishlist = () => {
    toast({
      title: "Added to Wishlist",
      description: `${product.title} has been added to your wishlist`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="aspect-square rounded-lg overflow-hidden"
          >
            <img 
              src={product.imageSrc} 
              alt={product.imageAlt} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-playfair text-3xl text-black dark:text-white">{product.title}</h1>
              <div className="mt-2 font-inter text-sm text-gray-500 dark:text-gray-400">
                Category: {product.category || "Uncategorized"}
              </div>
            </div>

            <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl mb-3 font-semibold dark:text-white">Pricing</h3>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg">
                <div className="font-inter text-lg font-bold dark:text-white">
                  {product.priceDisplay}
                </div>
              </div>
            </Card>

            <div>
              <h3 className="text-xl mb-3 font-semibold dark:text-white">Description</h3>
              <p className="font-inter text-gray-700 dark:text-gray-300">
                {product.description}
              </p>

              <div className={`mt-8 ${isMobile ? 'space-y-4' : 'flex space-x-4'}`}>
                <Button 
                  size="lg"
                  className={`${isMobile ? 'w-full' : 'flex-1'}`}
                  onClick={handleOrderNow}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Order Now
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className={`${isMobile ? 'w-full' : 'w-auto'}`}
                  onClick={handleAddToWishlist}
                >
                  <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Product Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <RecommendedProducts 
            currentProductId={product.id} 
            currentCategory={product.category} 
          />
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
