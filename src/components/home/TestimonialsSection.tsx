
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  verified?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    review: "The quality of the crochet work is exceptional. I ordered a cardigan that fits perfectly and gets so many compliments! The attention to detail is incredible.",
    rating: 5,
    location: "Cape Town",
    date: "January 2025",
    verified: true
  },
  {
    id: 2,
    name: "Michael T.",
    avatar: "/placeholder.svg",
    review: "I purchased a beanie as a gift for my wife and she absolutely loves it. The stitch work is amazing and the colors are exactly as shown.",
    rating: 5,
    location: "Durban",
    date: "December 2024",
    verified: true
  },
  {
    id: 3,
    name: "Thandi M.",
    avatar: "/placeholder.svg",
    review: "Everything Hooked created the most beautiful baby dress for my daughter. The craftsmanship is outstanding and it will be a keepsake for years to come.",
    rating: 5,
    location: "Johannesburg",
    date: "February 2025",
    verified: true
  },
  {
    id: 4,
    name: "David Wilson",
    review: "The customized cardigan exceeded my expectations. The color combinations were perfect and the sizing was spot on. Highly recommend!",
    rating: 4,
    location: "Port Elizabeth",
    date: "March 2025"
  },
  {
    id: 5,
    name: "Lerato K.",
    avatar: "/placeholder.svg",
    review: "I've ordered multiple items and the quality is consistently excellent. My favorite is the bucket hat which I wear all summer! Fast shipping too.",
    rating: 5,
    location: "Pretoria",
    date: "January 2025",
    verified: true
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
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-20 w-40 h-40 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-3xl opacity-15"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">Customer Love</span>
            <Star className="w-4 h-4 text-yellow-600 fill-current" />
          </div>

          <h2 className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            What Our Customers
            <span className="block text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text">
              Are Saying
            </span>
          </h2>
          
          <p className="font-inter text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it — see what our happy customers have to say about their handcrafted pieces
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="font-playfair text-2xl md:text-3xl font-bold text-pink-600">500+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="font-playfair text-2xl md:text-3xl font-bold text-purple-600">4.9</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="font-playfair text-2xl md:text-3xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="pb-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className={isMobile ? "basis-full" : "basis-1/3"}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-2 h-full"
                >
                  <Card className="h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 ring-1 ring-gray-100 hover:ring-pink-200 group">
                    <CardContent className="p-6 md:p-8 flex flex-col h-full relative">
                      {/* Quote icon */}
                      <Quote className="absolute top-4 right-4 w-8 h-8 text-pink-200 group-hover:text-pink-300 transition-colors" />
                      
                      <div className="flex items-center mb-6">
                        <Avatar className="h-12 w-12 mr-4 ring-2 ring-pink-100">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-pink-700 font-semibold">
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            {testimonial.verified && (
                              <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{testimonial.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex mb-4 gap-1">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <blockquote className="font-inter text-gray-700 italic flex-grow leading-relaxed mb-4">
                        "{testimonial.review}"
                      </blockquote>
                      
                      <div className="text-xs text-gray-400 mt-auto">
                        {testimonial.date}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-3 mt-8">
            <CarouselPrevious className="static translate-y-0 bg-white hover:bg-pink-50 border border-gray-200 hover:border-pink-300 text-gray-600 hover:text-pink-600 shadow-lg" />
            <CarouselNext className="static translate-y-0 bg-white hover:bg-pink-50 border border-gray-200 hover:border-pink-300 text-gray-600 hover:text-pink-600 shadow-lg" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
