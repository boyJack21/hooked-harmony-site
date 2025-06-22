
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const Enhanced404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12">
              {/* Decorative Elements */}
              <div className="relative mb-8">
                <div className="text-8xl font-bold text-gray-200 dark:text-gray-700">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-pink-400 animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! This page got tangled up
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                It looks like the page you're looking for has gotten lost in our yarn basket. 
                Don't worry though - we have plenty of beautiful handmade items waiting for you!
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button asChild size="lg">
                  <Link to="/">
                    <Home className="mr-2 h-5 w-5" />
                    Back to Home
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" asChild>
                  <Link to="/?search=true">
                    <Search className="mr-2 h-5 w-5" />
                    Search Products
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Go Back
                </Button>
              </div>
              
              {/* Helpful Links */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Looking for something specific?
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <Link 
                    to="/?category=hats" 
                    className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    Handmade Hats
                  </Link>
                  <Link 
                    to="/?category=blankets" 
                    className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    Cozy Blankets
                  </Link>
                  <Link 
                    to="/?category=toys" 
                    className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    Cute Toys
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    Your Wishlist
                  </Link>
                  <Link 
                    to="/cart" 
                    className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    Shopping Cart
                  </Link>
                  <Link 
                    to="/order" 
                    className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    Place Order
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Enhanced404;
