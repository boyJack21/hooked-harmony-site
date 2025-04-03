
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
  const allProducts = [
    {
      imageSrc: "/lovable-uploads/292bcef9-b482-4906-b037-def69ad64fbf.png",
      imageAlt: "Brown and Pink Cardigan",
      title: "Cozy Two-Tone Cardigan",
      description: "Handcrafted cardigan in brown with pink accents, perfect for chilly evenings",
      category: "Cardigans"
    },
    {
      imageSrc: "/lovable-uploads/7c1dfbee-f9f7-4b62-8b0d-ab7c5d1d2990.png",
      imageAlt: "Color Block Cardigan",
      title: "Color Block Cardigan",
      description: "Stylish layered cardigan with cream, tan, brown and gray color blocks",
      category: "Cardigans"
    },
    {
      imageSrc: "/lovable-uploads/d6ea798a-68f0-4e4c-8a0e-6b0d606189db.png",
      imageAlt: "Cream Cardigan",
      title: "Cream Button Cardigan",
      description: "Elegant cream cardigan with buttons and balloon sleeves",
      category: "Cardigans"
    },
    {
      imageSrc: "/lovable-uploads/d910cf04-5989-46cf-8bc7-a9bcb94356b4.png",
      imageAlt: "Blue Summer Set",
      title: "Summer Beach Set",
      description: "Stylish blue and white checkered set including a hat and accessories",
      category: "Summer Sets"
    },
    {
      imageSrc: "/lovable-uploads/3b8fc3fe-1891-426b-9f1c-7e6d61851ee4.png",
      imageAlt: "Cream Crop Top",
      title: "Ruffled Crop Top",
      description: "Delicate cream crop top with ruffle details and tie front",
      category: "Tops"
    }
  ];

  // Filter out current product and prioritize same category
  let recommended = allProducts;
  
  if (currentProductId) {
    recommended = recommended.filter(product => 
      // Use a unique identifier from the product data, for now we'll use title as an approximation
      !product.title.includes(currentProductId)
    );
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
            <CarouselItem key={index} className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}>
              <div className="p-1">
                <Card>
                  <CardContent className="p-0">
                    <FeaturedItem
                      imageSrc={product.imageSrc}
                      imageAlt={product.imageAlt}
                      title={product.title}
                      description={product.description}
                      category={product.category}
                      delay={index * 0.1}
                    />
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
