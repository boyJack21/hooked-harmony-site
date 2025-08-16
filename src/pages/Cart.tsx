
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, loading, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart();
  const navigate = useNavigate();


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const total = getTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs className="mb-6" />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
            </Badge>
          </div>

          {items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Start adding some beautiful crochet items!</p>
                <Button asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0">
                          <LazyImage
                            src={item.product_image}
                            alt={item.product_title}
                            className="w-full h-full rounded-md"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-semibold">{item.product_title}</h3>
                          
                          <div className="flex gap-2 mt-1">
                            {item.size && (
                              <Badge variant="outline" className="text-xs">
                                Size: {item.size}
                              </Badge>
                            )}
                            {item.color && (
                              <Badge variant="outline" className="text-xs">
                                Color: {item.color}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              
                              <span className="w-8 text-center">{item.quantity}</span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{item.product_price}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal ({getTotalItems()} items)</span>
                        <span>R{total.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>R{total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full mt-6"
                      onClick={() => {
                        navigate('/order', { 
                          state: { 
                            cartItems: items,
                            isCartCheckout: true 
                          } 
                        });
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <Button variant="outline" className="w-full mt-3" asChild>
                      <Link to="/">Continue Shopping</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
