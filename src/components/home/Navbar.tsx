
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from '@/hooks/use-theme';
import MobileNav from './MobileNav';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isDarkMode = theme === "dark";
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed w-full z-50 transition-all duration-300 
        ${isScrolled ? 'bg-primary/90 backdrop-blur-md shadow-md' : 'bg-primary/80 backdrop-blur-sm'} 
        border-b border-secondary/30 dark:bg-background/90 dark:border-slate-800/50`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <MobileNav onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
          <h1 className="font-playfair text-2xl font-semibold text-black dark:text-white">everything_hooked</h1>
        </div>
        
        <div className="space-x-6 hidden md:flex items-center">
          <motion.a 
            href="#featured" 
            className="text-black dark:text-white hover:text-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Featured
          </motion.a>
          <motion.a 
            href="#about" 
            className="text-black dark:text-white hover:text-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            About
          </motion.a>
          <motion.a 
            href="#contact" 
            className="text-black dark:text-white hover:text-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.a>
          <motion.a 
            href="#faq" 
            className="text-black dark:text-white hover:text-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            FAQ
          </motion.a>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/order" className="flex items-center text-black dark:text-white hover:text-secondary transition-colors">
              <ShoppingBag className="w-4 h-4 mr-1" />
              Order
            </Link>
          </motion.div>
          
          <div className="flex items-center ml-4 border-l pl-4 border-secondary/30 dark:border-slate-700">
            <Sun className="h-4 w-4 mr-2 text-black dark:text-white" />
            <Switch 
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
            <Moon className="h-4 w-4 ml-2 text-black dark:text-white" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
