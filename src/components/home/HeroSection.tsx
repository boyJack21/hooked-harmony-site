
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1615529195746-a4837bacaf96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Enhanced gradient overlay with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/90 via-white/80 to-purple-50/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,182,193,0.3),transparent_50%)]" />
      
      <div className="container mx-auto px-6 md:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-pink-200 rounded-full px-4 py-2 mb-6 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">Handcrafted with Love</span>
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          </motion.div>

          {/* Main Heading with improved typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight"
          >
            Everything
            <span className="block text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text">
              Hooked
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-inter text-lg md:text-xl lg:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Discover unique crochet pieces crafted with premium materials and attention to every stitch
          </motion.p>

          {/* Enhanced CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <a 
              href="#featured" 
              className="group bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-full transition-all duration-300 inline-flex items-center justify-center font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> 
              Shop Our Creations
            </a>
            <Link 
              to="/order" 
              className="group bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 py-4 px-8 rounded-full transition-all duration-300 inline-flex items-center justify-center font-semibold text-lg border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> 
              Custom Order
            </Link>
          </motion.div>

          {/* Enhanced scroll indicator */}
          <motion.a 
            href="#featured"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="inline-flex flex-col items-center justify-center group"
          >
            <span className="text-sm text-gray-600 mb-2 font-medium">Explore Collection</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <ChevronDown className="animate-bounce w-4 h-4 text-gray-600 mt-2 group-hover:text-pink-500 transition-colors" />
            </div>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
