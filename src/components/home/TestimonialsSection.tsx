
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';

interface Testimonial {
  id: number;
  name: string;
  avatar?: string;
  review: string;
  rating: number;
  location: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    review: "The quality of the crochet work is exceptional. I ordered a cardigan that fits perfectly and gets so many compliments!",
    rating: 5,
    location: "Cape Town",
    date: "January 2025"
  },
  {
    id: 2,
    name: "Michael T.",
    avatar: "/placeholder.svg",
    review: "I purchased a beanie as a gift for my wife and she absolutely loves it. The attention to detail and the stitch work is amazing.",
    rating: 5,
    location: "Durban",
    date: "December 2024"
  },
  {
    id: 3,
    name: "Thandi M.",
    avatar: "/placeholder.svg",
    review: "Everything Hooked created the most beautiful baby dress for my daughter. The craftsmanship is outstanding and it will be a keepsake for years.",
    rating: 5,
    location: "Johannesburg",
    date: "February 2025"
  },
  {
    id: 4,
    name: "David Wilson",
    review: "The customized cardigan exceeded my expectations. The color combinations were perfect and the sizing was spot on.",
    rating: 4,
    location: "Port Elizabeth",
    date: "March 2025"
  },
  {
    id: 5,
    name: "Lerato K.",
    avatar: "/placeholder.svg",
    review: "I've ordered multiple items and the quality is consistently excellent. My favorite is the bucket hat which I wear all summer!",
    rating: 5,
    location: "Pretoria",
    date: "January 2025"
  }
];

const renderStars = (rating: number) => {
  return Array(5).fill(0).map((_, i) => (
    <Star 
      key={i} 
      size={16} 
      className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
    />
  ));
};

const TestimonialsSection: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <section id="testimonials" className="py-20 bg-primary dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="font-playfair text-4xl text-primary-foreground dark:text-white mb-4">
            Customer Reviews
          </h3>
          <p className="font-inter text-primary-foreground/80 dark:text-white/80 max-w-xl mx-auto">
            See what our customers are saying about their handcrafted crochet items.
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className={isMobile ? "basis-full" : "basis-1/3"}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-2 h-full"
                >
                  <Card className="h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-primary-foreground dark:text-white">{testimonial.name}</h4>
                          <p className="text-sm text-primary-foreground/60 dark:text-white/60">{testimonial.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex my-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <p className="font-inter text-primary-foreground/80 dark:text-white/80 italic flex-grow">
                        "{testimonial.review}"
                      </p>
                      
                      <div className="text-xs text-primary-foreground/60 dark:text-white/60 mt-4">
                        {testimonial.date}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="static translate-y-0 mr-2" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
