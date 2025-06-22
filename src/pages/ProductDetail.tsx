
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { LazyImage } from '@/components/ui/lazy-image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import SizeSelector from '@/components/product/SizeSelector';
import RecommendedProducts from '@/components/product/RecommendedProducts';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = location.state?.product;
  const { user } = useAuth();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const isInWishlist = wishlistItems.some(item => item.id === product?.id);

  useEffect(() => {
    if (product && user) {
      addToRecentlyViewed({
        product_id: product.id,
        product_title: product.title,
        product_image: product.imageSrc,
        product_category: product.category,
      });
    }
  }, [product, user, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to add items to cart.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    await addToCart({
      product_id: product.id,
      product_title: product.title,
      product_image: product.imageSrc,
      product_price: product.priceDisplay || 'From R200',
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  const handleBuyNow = () => {
    navigate('/order', {
      state: {
        product: {
          ...product,
          selectedSize,
          selectedColor,
          quantity,
        },
        selectedSize,
      }
    });
  };

  const colors = ['Pink', 'Blue', 'White', 'Yellow', 'Purple'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs 
          className="mb-6"
          items={[
            { label: 'Home', href: '/' },
            { label: product.category || 'Products', href: `/?category=${product.category?.toLowerCase()}` },
            { label: product.title }
          ]}
        />
        
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <LazyImage
                  src={product.imageSrc}
                  alt={product.imageAlt || product.title}
                  className="w-full aspect-square"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              {product.category && (
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-primary-foreground dark:text-white">
                {product.title}
              </h1>
              {product.priceDisplay && (
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  <span className="text-2xl font-bold text-primary-foreground dark:text-white">
                    {product.priceDisplay}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary-foreground dark:text-white">
                Description
              </h3>
              <p className="text-primary-foreground/80 dark:text-white/70">
                {product.description || 'Beautiful handmade crochet item crafted with love and attention to detail.'}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary-foreground dark:text-white">
                Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <SizeSelector 
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary-foreground dark:text-white">
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="w-12 text-center font-semibold text-primary-foreground dark:text-white">
                  {quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlistToggle}
                  className={isInWishlist ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <Button 
                onClick={handleBuyNow}
                size="lg"
                className="w-full"
              >
                Buy Now
              </Button>
            </div>

            {/* Product Info */}
            <div className="space-y-2 text-sm text-primary-foreground/70 dark:text-white/60">
              <p>✨ Handmade with love</p>
              <p>🧶 High-quality yarn</p>
              <p>📦 Custom orders available</p>
              <p>🚚 Fast shipping</p>
            </div>
          </motion.div>
        </div>

        {/* Recommended Products */}
        <RecommendedProducts currentProductId={product.id} />
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
