
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart, Mail, Instagram, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed w-full bg-primary/80 backdrop-blur-sm z-50 border-b border-secondary/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-playfair text-2xl font-semibold">everything_hooked</h1>
          <div className="space-x-6 hidden md:flex">
            <a href="#featured" className="hover:text-secondary transition-colors">Featured</a>
            <a href="#about" className="hover:text-secondary transition-colors">About</a>
            <a href="#contact" className="hover:text-secondary transition-colors">Contact</a>
            <Link to="/order" className="flex items-center text-accent hover:text-accent/80 transition-colors">
              <ShoppingBag className="w-4 h-4 mr-1" />
              Order
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section 
        className="min-h-screen flex items-center justify-center pt-20 relative"
        style={{
          backgroundImage: "url('/lovable-uploads/24ebb84a-3c09-49e0-a632-14e05de66896.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
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

      {/* Featured Section */}
      <section id="featured" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="font-playfair text-4xl text-center mb-12">Featured Creations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-secondary/20"></div>
                <div className="p-6">
                  <h4 className="font-playfair text-xl mb-2">Handmade Item {item}</h4>
                  <p className="font-inter text-primary-foreground/70">
                    Beautifully crafted with premium materials
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-playfair text-4xl mb-6">About Us</h3>
            <p className="font-inter text-lg mb-6 leading-relaxed">
              At Everything Hooked, we believe in creating beautiful, handcrafted pieces that bring warmth and character to your home. Each item is made with love and attention to detail, ensuring that you receive a unique piece that will be cherished for years to come.
            </p>
            <div className="flex justify-center">
              <Heart className="text-secondary w-8 h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-playfair text-4xl mb-6">Get in Touch</h3>
            <p className="font-inter mb-8">
              Interested in a custom piece or have questions? We'd love to hear from you!
            </p>
            <div className="flex justify-center space-x-6">
              <a href="mailto:contact@everythinghooked.com" className="p-3 rounded-full bg-primary hover:bg-secondary transition-colors">
                <Mail className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/everything_hooked" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary hover:bg-secondary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-foreground text-primary py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="font-inter text-sm">© 2024 Everything Hooked. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
