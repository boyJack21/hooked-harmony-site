
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductItem } from '@/components/home/CategoryCarousel';
import FeaturedItem from '@/components/home/FeaturedItem';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecommendedProductsProps {
  currentProductId?: string;
  currentCategory?: string;
}

// Mock recommendation logic - in a real app, this would come from an API
const getRecommendedProducts = (currentProductId?: string, currentCategory?: string): ProductItem[] => {
  // Products from FeaturedSection
  const allProducts: ProductItem[] = [
    {
      id: "cardigan-brown-pink",
      imageSrc: "/lovable-uploads/292bcef9-b482-4906-b037-def69ad64fbf.png",
      imageAlt: "Brown and Pink Cardigan",
      title: "Cozy Two-Tone Cardigan",
      description: "Handcrafted cardigan in brown with pink accents, perfect for chilly evenings",
      category: "Cardigans",
      priceDisplay: "From R450"
    },
    {
      id: "cardigan-color-block",
      imageSrc: "/lovable-uploads/7c1dfbee-f9f7-4b62-8b0d-ab7c5d1d2990.png",
      imageAlt: "Color Block Cardigan",
      title: "Color Block Cardigan",
      description: "Stylish layered cardigan with cream, tan, brown and gray color blocks",
      category: "Cardigans",
      priceDisplay: "From R520"
    },
    {
      id: "cardigan-cream",
      imageSrc: "/lovable-uploads/d6ea798a-68f0-4e4c-8a0e-6b0d606189db.png",
      imageAlt: "Cream Cardigan",
      title: "Cream Button Cardigan",
      description: "Elegant cream cardigan with buttons and balloon sleeves",
      category: "Cardigans",
      priceDisplay: "From R480"
    },
    {
      id: "summer-set-blue",
      imageSrc: "/lovable-uploads/d910cf04-5989-46cf-8bc7-a9bcb94356b4.png",
      imageAlt: "Blue Summer Set",
      title: "Summer Beach Set",
      description: "Stylish blue and white checkered set including a hat and accessories",
      category: "Summer Sets",
      priceDisplay: "From R350"
    },
    {
      id: "top-cream-crop",
      imageSrc: "/lovable-uploads/3b8fc3fe-1891-426b-9f1c-7e6d61851ee4.png",
      imageAlt: "Cream Crop Top",
      title: "Ruffled Crop Top",
      description: "Delicate cream crop top with ruffle details and tie front",
      category: "Tops",
      priceDisplay: "From R280"
    },
    {
      id: "shirt-blue-polo",
      imageSrc: "/lovable-uploads/08cd791a-6b34-44fb-abb5-b8b113488695.png",
      imageAlt: "Sky Blue Crochet Polo",
      title: "Sky Blue Crochet Polo",
      description: "Lightweight and breathable sky blue crochet polo shirt, perfect for summer days",
      category: "Shirts",
      priceDisplay: "From R310"
    }
  ];

  // Filter out current product and prioritize same category
  let recommended = allProducts;
  
  if (currentProductId) {
    recommended = recommended.filter(product => product.id !== currentProductId);
  }
  
  // Sort by category match (if provided)
  if (currentCategory) {
    recommended.sort((a, b) => {
      if (a.category === currentCategory && b.category !== currentCategory) return -1;
      if (a.category !== currentCategory && b.category === currentCategory) return 1;
      return 0;
    });
  }
  
  // Return a maximum of 4 recommendations
  return recommended.slice(0, 4);
};

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ 
  currentProductId,
  currentCategory
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const recommendations = getRecommendedProducts(currentProductId, currentCategory);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-playfair text-2xl text-black dark:text-white mb-6"
      >
        You May Also Like
      </motion.h3>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {recommendations.map((product, index) => (
            <CarouselItem key={product.id} className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}>
              <div className="p-1">
                <Card>
                  <CardContent className="p-0">
                    <FeaturedItem {...product} />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 mr-2" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default RecommendedProducts;
