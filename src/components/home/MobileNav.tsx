
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from '@/hooks/use-theme';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8 mt-2">
              <h1 className="font-playfair text-xl font-semibold">everything_hooked</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex flex-col space-y-5">
              <a href="#featured" className="text-lg hover:text-secondary transition-colors duration-300" onClick={() => setIsOpen(false)}>
                Featured
              </a>
              <a href="#about" className="text-lg hover:text-secondary transition-colors duration-300" onClick={() => setIsOpen(false)}>
                About
              </a>
              <a href="#contact" className="text-lg hover:text-secondary transition-colors duration-300" onClick={() => setIsOpen(false)}>
                Contact
              </a>
              <Link to="/order" className="flex items-center text-lg hover:text-secondary transition-colors duration-300" onClick={() => setIsOpen(false)}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Order
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
