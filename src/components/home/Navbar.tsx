
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-primary/80 backdrop-blur-sm z-50 border-b border-secondary/30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="font-playfair text-2xl font-semibold text-primary-foreground">everything_hooked</h1>
        <div className="space-x-6 hidden md:flex">
          <a href="#featured" className="text-primary-foreground hover:text-secondary transition-colors">Featured</a>
          <a href="#about" className="text-primary-foreground hover:text-secondary transition-colors">About</a>
          <a href="#contact" className="text-primary-foreground hover:text-secondary transition-colors">Contact</a>
          <Link to="/order" className="flex items-center text-accent-foreground hover:text-secondary transition-colors">
            <ShoppingBag className="w-4 h-4 mr-1" />
            Order
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
