import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { OrderForm } from '@/components/order/OrderForm';
import { OrderFormHeader } from '@/components/order/OrderFormHeader';
import { OrderFormFooter } from '@/components/order/OrderFormFooter';
import { YocoButton } from '@/components/order/YocoButton';
import { getProductPrice, formatPrice, addSizeUpcharge } from '@/utils/pricing';

import { useToast } from '@/hooks/use-toast';
import { OrderFormData } from '@/types/order';
import { validateOrderForm } from '@/services/validationService';

import { CheckCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = location.state?.product;
  const cartItems = location.state?.cartItems;
  const isCartCheckout = location.state?.isCartCheckout;
  const selectedSize = location.state?.selectedSize;
  
  
  const [formData, setFormData] = useState<OrderFormData>(() => ({
    name: '',
    email: '',
    phone: '',
    item: isCartCheckout ? 'Cart Items' : (product ? product.title : ''),
    quantity: isCartCheckout ? cartItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 1 : 1,
    color: '',
    size: selectedSize || '',
    specialInstructions: '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<string>('');
  const [orderCount, setOrderCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [formValid, setFormValid] = useState(false);
  
  // Calculate price based on product and size or cart total
  const basePrice = isCartCheckout 
    ? cartItems?.reduce((sum: number, item: any) => {
        const price = parseFloat(item.product_price.replace(/[^0-9.]/g, ''));
        return sum + (price * item.quantity);
      }, 0) * 100 || 0 // Convert to cents
    : getProductPrice(formData.item);
  
  const finalPrice = isCartCheckout ? basePrice : addSizeUpcharge(basePrice, formData.size);
  const totalPrice = isCartCheckout ? finalPrice : finalPrice * formData.quantity;
  
  useEffect(() => {
    if (selectedSize && !formData.size) {
      setFormData(prev => ({ ...prev, size: selectedSize }));
    }
  }, [selectedSize]);
  
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    setErrors(prev => {
      if (!prev[name]) return prev;
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateOrderForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setFormValid(false);
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    setFormValid(true);
    setShowPaymentOptions(true);
  };

  const handleDirectOrderSubmit = async () => {
    setSubmitting(true);
    try {
      setIsSubmitted(true);
      setOrderCount(prev => prev + 1);
      
      toast({
        title: "Order Submitted!",
        description: "Your order has been received. We'll contact you shortly.",
      });
      
      // Reset form after successful submission
      setTimeout(() => {
        handleNewOrder();
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleYocoSuccess = (paymentId: string) => {
    setIsSubmitted(true);
    toast({
      title: "Payment Successful!",
      description: `Payment completed successfully. Payment ID: ${paymentId}`,
    });
    
    setTimeout(() => {
      handleNewOrder();
    }, 3000);
  };

  const handleYocoError = (error: string) => {
    // Reset to payment options screen so user can retry
    setShowPaymentOptions(true);
    
    toast({
      title: "Payment Failed",
      description: error + " Please try again or choose 'Pay Later'.",
      variant: "destructive",
    });
  };

  const handleNewOrder = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      item: '',
      quantity: 1,
      color: '',
      size: '',
      specialInstructions: '',
    });
    setOrderId('');
    setErrors({});
    setSubmitting(false);
    setIsSubmitted(false);
    setShowPaymentOptions(false);
  };

  const renderContent = () => {
    if (isSubmitted) {
      return (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We'll contact you shortly to confirm details and arrange payment.
          </p>
          <Button onClick={handleNewOrder}>
            Place Another Order
          </Button>
        </div>
      );
    }

    if (showPaymentOptions && formValid) {
      return (
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-muted/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Item(s):</span>
                <span>{formData.item}</span>
              </div>
              {!isCartCheckout && (
                <>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formData.size || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{formData.quantity}</span>
                  </div>
                </>
              )}
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Choose Payment Method</h3>
            <p className="text-muted-foreground">How would you like to complete your order?</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Direct Order Option */}
            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20">
              <div className="text-center space-y-4">
                <CreditCard className="h-12 w-12 mx-auto text-primary" />
                <div>
                  <h4 className="font-semibold">Pay Later</h4>
                  <p className="text-sm text-muted-foreground">
                    Submit order now, we'll contact you for payment
                  </p>
                </div>
                <Button 
                  onClick={handleDirectOrderSubmit}
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? 'Submitting...' : 'Submit Order'}
                </Button>
              </div>
            </Card>

            {/* Yoco Payment Option */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 mx-auto bg-[#00d4ff] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Yoco</span>
                </div>
                <div>
                  <h4 className="font-semibold">Pay with Card</h4>
                  <p className="text-sm text-muted-foreground">
                    Secure payment with Yoco
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Amount: {formatPrice(totalPrice)}
                  </p>
                </div>
                <YocoButton
                  orderData={formData}
                  amount={totalPrice}
                  onSuccess={handleYocoSuccess}
                  onError={handleYocoError}
                />
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentOptions(false)}
              className="mt-4"
            >
              Back to Order Form
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Order Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
          <OrderForm 
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleFormSubmit}
            submitting={submitting}
            errors={errors}
            orderCount={orderCount}
            initialSize={selectedSize}
          />
        </div>
        
        {/* Payment Section */}
        {formValid && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Payment Options</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Direct Order Option */}
              <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20">
                <div className="text-center space-y-4">
                  <CreditCard className="h-12 w-12 mx-auto text-primary" />
                  <div>
                    <h4 className="font-semibold">Pay Later</h4>
                    <p className="text-sm text-muted-foreground">
                      Submit order now, we'll contact you for payment
                    </p>
                  </div>
                  <Button 
                    onClick={handleDirectOrderSubmit}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Submitting...' : 'Submit Order'}
                  </Button>
                </div>
              </Card>

              {/* Yoco Payment Option */}
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 mx-auto bg-[#00d4ff] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Yoco</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Pay with Card</h4>
                    <p className="text-sm text-muted-foreground">
                      Secure payment with Yoco
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Amount: {formatPrice(totalPrice)}
                    </p>
                  </div>
                  <YocoButton
                    orderData={formData}
                    amount={totalPrice}
                    onSuccess={handleYocoSuccess}
                    onError={handleYocoError}
                  />
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {!isSubmitted && <OrderFormHeader />}
          
          <div className="my-6 md:my-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-8">
            {renderContent()}
          </div>
          
          {!isSubmitted && <OrderFormFooter />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default React.memo(Order);