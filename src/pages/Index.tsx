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
          backgroundImage: "url('https://images.unsplash.com/photo-1615529195746-a4837bacaf96?q=80&w=2000&auto=format&fit=crop')",
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
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/292bcef9-b482-4906-b037-def69ad64fbf.png"
                  alt="Brown and Pink Cardigan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Cozy Two-Tone Cardigan</h4>
                <p className="font-inter text-primary-foreground/70">
                  Handcrafted cardigan in brown with pink accents, perfect for chilly evenings
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/d910cf04-5989-46cf-8bc7-a9bcb94356b4.png"
                  alt="Blue Summer Set"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Summer Beach Set</h4>
                <p className="font-inter text-primary-foreground/70">
                  Stylish blue and white checkered set including a hat and accessories
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/3b8fc3fe-1891-426b-9f1c-7e6d61851ee4.png"
                  alt="Cream Crop Top"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Ruffled Crop Top</h4>
                <p className="font-inter text-primary-foreground/70">
                  Delicate cream crop top with ruffle details and tie front
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/8e8b348c-460f-4202-b822-cce533c16d65.png"
                  alt="Beige Polo Shirt"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Classic Beige Polo</h4>
                <p className="font-inter text-primary-foreground/70">
                  Comfortable and breathable beige polo shirt, ideal for casual outings
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/5b1caa4b-5579-450f-84f4-c46a9c909ab8.png"
                  alt="Beige and Brown Shirt"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Two-Tone Button Shirt</h4>
                <p className="font-inter text-primary-foreground/70">
                  Elegant beige and brown button-up shirt with contrasting detail
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/7c1dfbee-f9f7-4b62-8b0d-ab7c5d1d2990.png"
                  alt="Color Block Cardigan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Color Block Cardigan</h4>
                <p className="font-inter text-primary-foreground/70">
                  Stylish layered cardigan with cream, tan, brown and gray color blocks
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/e255fe3b-ce35-4980-87aa-3b593d0d626d.png"
                  alt="Orange Bikini Set"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Vibrant Bikini Set</h4>
                <p className="font-inter text-primary-foreground/70">
                  Bright orange crochet bikini, perfect for beach days and pool parties
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/cca20f48-3399-428c-9418-804bf8a9c508.png"
                  alt="Green Beanie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Emerald Beanie</h4>
                <p className="font-inter text-primary-foreground/70">
                  Warm and stylish green beanie, perfect for cold winter days
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/2f2c964c-4ac4-47b6-8b6f-ed4fc2667b3c.png"
                  alt="Baby Dress"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Baby Girl Dress</h4>
                <p className="font-inter text-primary-foreground/70">
                  Adorable gray crochet dress for babies, perfect for special occasions
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/d977b0bc-aa7a-49ea-9d6a-c37dbe6e71b9.png"
                  alt="White Crop Top"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Summer Crop Top</h4>
                <p className="font-inter text-primary-foreground/70">
                  Elegant white crochet crop top with tie-back design, perfect for summer days
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img 
                  src="/lovable-uploads/68f87ec2-6bd6-4657-a718-151d2cecfa27.png"
                  alt="Bucket Hats Collection"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="font-playfair text-xl mb-2">Bucket Hat Collection</h4>
                <p className="font-inter text-primary-foreground/70">
                  Stylish bucket hats in various colors, perfect for sun protection with a fashion twist
                </p>
              </div>
            </motion.div>
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
              <a href="mailto:everythinghooked09@gmail.com" className="p-3 rounded-full bg-primary hover:bg-secondary transition-colors">
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
