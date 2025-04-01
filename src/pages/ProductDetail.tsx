
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { useToast } from '@/components/ui/use-toast';

interface ProductDetailProps {}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src={product.imageSrc} 
              alt={product.imageAlt} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-playfair text-3xl text-black">{product.title}</h1>
              <div className="mt-2 font-inter text-sm text-gray-500">
                Category: {product.category || "Uncategorized"}
              </div>
            </div>

            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
              <h3 className="text-xl mb-3 font-semibold">Pricing</h3>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="font-inter text-lg font-bold">
                  {product.priceDisplay}
                </div>
              </div>
            </Card>

            <div>
              <h3 className="text-xl mb-3 font-semibold">Description</h3>
              <p className="font-inter text-gray-700">
                {product.description}
              </p>

              <div className="mt-8 space-y-4">
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={handleOrderNow}
                >
                  Order Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
