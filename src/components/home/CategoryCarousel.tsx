
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
  return (
    <div className="mb-16">
      <h3 className="font-playfair text-3xl text-black mb-6">{category}</h3>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="p-0">
                    <FeaturedItem
                      imageSrc={item.imageSrc}
                      imageAlt={item.imageAlt}
                      title={item.title}
                      description={item.description}
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
