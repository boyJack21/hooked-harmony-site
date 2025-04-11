
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleRemoveItem = (id: string, title: string) => {
    removeFromWishlist(id);
    toast({
      title: "Item Removed",
      description: `${title} has been removed from your wishlist`,
      duration: 3000,
    });
  };

  const handleNavigateToProduct = (id: string, product: any) => {
    navigate(`/product/${id}`, {
      state: { product }
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-primary dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-3xl text-primary-foreground dark:text-white flex items-center"
          >
            <Heart className="mr-2" /> My Wishlist
          </motion.h1>
          
          {wishlistItems.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearWishlist}
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
        
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Heart className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-primary-foreground dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Start adding your favorite items to your wishlist!</p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative">
                      <img 
                        src={item.imageSrc} 
                        alt={item.imageAlt} 
                        className="w-full aspect-square object-cover rounded-t-lg cursor-pointer"
                        onClick={() => handleNavigateToProduct(item.id, item)}
                      />
                      {item.category && (
                        <Badge className="absolute top-3 right-3 bg-black/70 dark:bg-white/80 dark:text-black">
                          {item.category}
                        </Badge>
                      )}
                      <Button 
                        variant="destructive"
                        size="icon"
                        className="absolute top-3 left-3 h-8 w-8 rounded-full"
                        onClick={() => handleRemoveItem(item.id, item.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 
                        className="font-playfair text-lg text-primary-foreground dark:text-white mb-2 cursor-pointer hover:underline"
                        onClick={() => handleNavigateToProduct(item.id, item)}
                      >
                        {item.title}
                      </h3>
                      
                      {item.priceDisplay && (
                        <div className="mt-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-md shadow-sm">
                          <span className="font-inter font-semibold text-primary-foreground dark:text-white text-sm block">
                            {item.priceDisplay}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-primary-foreground/80 dark:text-white/70 text-sm mt-2 flex-grow line-clamp-3">
                        {item.description}
                      </p>
                      
                      <Button 
                        className="mt-4 w-full"
                        onClick={() => handleNavigateToProduct(item.id, item)}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" /> View Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
