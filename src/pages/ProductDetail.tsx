
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Share2, Facebook, Twitter, Instagram, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { useToast } from '@/components/ui/use-toast';
import RecommendedProducts from '@/components/product/RecommendedProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import SizeSelector, { SizeOption } from '@/components/product/SizeSelector';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductDetailProps {}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
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

  // Determine available sizes based on category and title
  const getAvailableSizes = (): SizeOption[] => {
    if (product.category === "Accessories") {
      if (product.title.includes("Beanie") || product.title.includes("Bucket Hat")) {
        return [];
      }
      return ['S', 'M', 'L'];
    } else if (product.title.includes("Crop Cardigan")) {
      return ['S', 'M'];
    }
    return ['S', 'M', 'L']; // Default all sizes
  };

  const handleOrderNow = () => {
    const needsSize = !product.title.includes("Beanie") && 
                      !product.title.includes("Bucket Hat") && 
                      product.category !== "Accessories";
                      
    if (!selectedSize && needsSize) {
      toast({
        title: "Size Selection Required",
        description: "Please select a size before ordering",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    toast({
      title: "Order initiated",
      description: "You'll be redirected to our order form",
      duration: 3000,
    });
    
    // Navigate to the order page with the product information and selected size
    navigate('/order', { 
      state: { 
        product,
        selectedSize 
      } 
    });
  };
  
  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.title} has been removed from your wishlist`,
        duration: 3000,
      });
    } else {
      addToWishlist({
        id: product.id,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt,
        title: product.title,
        description: product.description,
        category: product.category,
        priceDisplay: product.priceDisplay
      });
      toast({
        title: "Added to Wishlist",
        description: `${product.title} has been added to your wishlist`,
        duration: 3000,
      });
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    let shareLink = '';
    
    if (platform === 'facebook') {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'twitter') {
      shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this amazing ${product.title}`;
    } else if (platform === 'instagram') {
      // Instagram doesn't support direct sharing via URL, but we'll show a toast with instructions
      toast({
        title: "Instagram Sharing",
        description: "Copy the link and share it on your Instagram story!",
        duration: 3000,
      });
      navigator.clipboard.writeText(shareUrl);
      setShareMenuOpen(false);
      return;
    }
    
    // Open share link in new window
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
    
    setShareMenuOpen(false);
    
    toast({
      title: "Shared Successfully",
      description: `Product shared on ${platform}`,
      duration: 3000,
    });
  };

  // Should we show size selector?
  const showSizeSelector = !product.title.includes("Beanie") && 
                          !product.title.includes("Bucket Hat") && 
                          product.category !== "Accessories";

  const isProductInWishlist = isInWishlist(product.id);

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
          {/* Product Image with Zoom */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative aspect-square rounded-lg overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <div className={`w-full h-full transition-all duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}>
              <img 
                src={product.imageSrc} 
                alt={product.imageAlt} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Zoom indicator */}
            <div className="absolute top-3 left-3 bg-black/60 text-white p-2 rounded-full">
              <Maximize2 size={16} />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-playfair text-3xl text-black dark:text-white">{product.title}</h1>
                <div className="mt-2 font-inter text-sm text-gray-500 dark:text-gray-400">
                  Category: {product.category || "Uncategorized"}
                </div>
              </div>
              
              {/* Social Share Button */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                >
                  <Share2 size={16} /> Share
                </Button>
                
                {shareMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-10 w-44"
                  >
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center justify-start gap-2"
                        onClick={() => handleShare('facebook')}
                      >
                        <Facebook size={16} className="text-blue-600" /> Facebook
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center justify-start gap-2"
                        onClick={() => handleShare('twitter')}
                      >
                        <Twitter size={16} className="text-blue-400" /> Twitter
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center justify-start gap-2"
                        onClick={() => handleShare('instagram')}
                      >
                        <Instagram size={16} className="text-pink-600" /> Instagram
                      </Button>
                    </div>
                  </motion.div>
                )}
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

            {/* Size Selector - only show when needed */}
            {showSizeSelector && (
              <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                <SizeSelector 
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                  availableSizes={getAvailableSizes()}
                />
              </Card>
            )}

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
                  variant={isProductInWishlist ? "secondary" : "outline"}
                  className={`${isMobile ? 'w-full' : 'w-auto'}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isProductInWishlist ? 'fill-current' : ''}`} />
                  {isProductInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
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
