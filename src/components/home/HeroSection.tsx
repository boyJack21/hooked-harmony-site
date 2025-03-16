
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section 
      className="min-h-screen flex items-center justify-center pt-20 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1615529195746-a4837bacaf96?q=80&w=2000&auto=format&fit=crop')",
      }}
    >
      {/* Overlay with reduced opacity for better image visibility */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-white">Handcrafted with Love</h2>
          <p className="font-inter text-lg md:text-xl text-white mb-8">
            Unique crochet pieces made with care and attention to every detail
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <a href="#featured" className="bg-secondary hover:bg-secondary/90 text-white py-2 px-6 rounded-full transition-colors inline-flex items-center">
              <Heart className="mr-2 h-4 w-4" /> Our Creations
            </a>
            <Link to="/order" className="bg-accent hover:bg-accent/90 text-white py-2 px-6 rounded-full transition-colors inline-flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" /> Place an Order
            </Link>
          </div>
          <a href="#featured" className="inline-flex items-center justify-center">
            <ChevronDown className="animate-bounce w-10 h-10 text-white" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
