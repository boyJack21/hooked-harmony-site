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
    
    // Scroll to payment section smoothly
    const paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    setFormValid(false);
  };

  const renderContent = () => {
    if (isSubmitted) {
      return (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-green-800 dark:text-green-300">
            Order Submitted Successfully!
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Thank you for your order. We'll contact you shortly to confirm details and arrange delivery.
          </p>
          <Button onClick={handleNewOrder} size="lg" className="px-8">
            Place Another Order
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="ml-2 text-sm font-medium">Order Details</span>
          </div>
          <div className="w-16 h-px bg-muted"></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              formValid 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <span className={`ml-2 text-sm font-medium transition-colors ${
              formValid ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              Payment
            </span>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <span className="text-primary font-semibold">1</span>
            </div>
            <h2 className="text-2xl font-bold">Customer Information</h2>
          </div>
          
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
        <div id="payment-section" className={`bg-card rounded-xl border p-6 shadow-sm transition-all duration-300 ${
          formValid 
            ? 'opacity-100 border-primary/20' 
            : 'opacity-50 pointer-events-none'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                formValid 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <span className="font-semibold">2</span>
              </div>
              <h2 className="text-2xl font-bold">Payment Options</h2>
            </div>
            {!formValid && (
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Complete step 1 first
              </span>
            )}
          </div>

          {formValid && (
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 text-center">Order Summary</h3>
              <div className="space-y-2 text-sm max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item(s):</span>
                  <span className="font-medium">{formData.item}</span>
                </div>
                {!isCartCheckout && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{formData.size || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{formData.quantity}</span>
                    </div>
                  </>
                )}
                <Separator className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pay Later Option */}
            <Card className={`relative overflow-hidden transition-all duration-200 ${
              formValid 
                ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/30' 
                : 'cursor-not-allowed'
            }`}>
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Pay Later</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit your order now and we'll contact you to arrange payment and delivery
                  </p>
                </div>
                <Button 
                  onClick={handleDirectOrderSubmit}
                  disabled={submitting || !formValid}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Order'
                  )}
                </Button>
              </div>
            </Card>

            {/* Yoco Payment Option */}
            <Card className={`relative overflow-hidden transition-all duration-200 ${
              formValid 
                ? 'hover:shadow-lg hover:-translate-y-1 border-2 hover:border-[#00d4ff]/30' 
                : 'cursor-not-allowed opacity-50'
            }`}>
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#00d4ff] to-[#00c4ef] rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Yoco</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Pay with Card</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    Secure payment with Yoco
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Amount: {formatPrice(totalPrice)}
                  </p>
                </div>
                <div className="min-h-[48px] flex items-center justify-center">
                  {formValid ? (
                    <YocoButton
                      orderData={formData}
                      amount={totalPrice}
                      onSuccess={handleYocoSuccess}
                      onError={handleYocoError}
                    />
                  ) : (
                    <Button disabled className="w-full h-12 text-base font-semibold" size="lg">
                      Complete Order Form
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {!isSubmitted && <OrderFormHeader />}
          
          <div className="my-6 md:my-8">
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