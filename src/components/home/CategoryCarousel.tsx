
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import FeaturedItem from './FeaturedItem';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ProductItem {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  category: string;
}

interface CategoryCarouselProps {
  category: string;
  items: ProductItem[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ category, items }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-16">
      <h3 className="font-playfair text-3xl text-black mb-6">{category}</h3>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: false, // Disable drag free for more controlled sliding
          watchDrag: true, // Watch drag interactions to prevent glitches
          skipSnaps: false, // Disable skipping snaps for smoother experience
        }}
        className="w-full"
      >
        <CarouselContent className="pb-4">
          {items.map((item, index) => (
            <CarouselItem key={index} className={isMobile ? "basis-full" : "md:basis-1/2 lg:basis-1/3"}>
              <div className="p-1">
                <Card>
                  <CardContent className="p-0">
                    <FeaturedItem
                      imageSrc={item.imageSrc}
                      imageAlt={item.imageAlt}
                      title={item.title}
                      description={item.description}
                      category={category}
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

export default CategoryCarousel;
