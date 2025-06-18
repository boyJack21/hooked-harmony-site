
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { OrderForm } from '@/components/order/OrderForm';
import { PaymentForm } from '@/components/order/PaymentForm';
import { OrderFormHeader } from '@/components/order/OrderFormHeader';
import { OrderFormFooter } from '@/components/order/OrderFormFooter';
import { useToast } from '@/components/ui/use-toast';
import { OrderFormData } from '@/types/order';
import { validateOrderForm } from '@/services/validationService';
import { CheckCircle } from 'lucide-react';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = location.state?.product;
  const selectedSize = location.state?.selectedSize;
  
  const [formData, setFormData] = useState<OrderFormData>(() => ({
    name: '',
    email: '',
    phone: '',
    item: product ? product.title : '',
    quantity: 1,
    color: '',
    size: selectedSize || '',
    specialInstructions: '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'success'>('form');
  const [orderId, setOrderId] = useState<string>('');
  const [orderCount, setOrderCount] = useState(0);
  
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
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateOrderForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    // Move to payment step
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (orderIdFromPayment: string) => {
    setOrderId(orderIdFromPayment);
    setCurrentStep('success');
    setOrderCount(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    // Stay on payment step so user can retry
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
    setCurrentStep('form');
    setOrderId('');
    setErrors({});
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'form':
        return (
          <OrderForm 
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleFormSubmit}
            submitting={false}
            errors={errors}
            orderCount={orderCount}
            initialSize={selectedSize}
          />
        );
      
      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Complete Your Payment</h2>
              <p className="text-muted-foreground">
                Review your order details and proceed with secure payment
              </p>
            </div>
            <PaymentForm 
              formData={formData}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
            <button
              onClick={() => setCurrentStep('form')}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to order form
            </button>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">
                Your order #{orderId.slice(-6)} has been paid for successfully.
              </p>
              <p className="text-sm text-muted-foreground">
                We'll contact you soon to arrange delivery details.
              </p>
            </div>
            <button
              onClick={handleNewOrder}
              className="bg-secondary hover:bg-secondary/90 text-white py-3 px-6 rounded-md transition-colors"
            >
              Place Another Order
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {currentStep === 'form' && <OrderFormHeader />}
          
          <div className="my-6 md:my-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-8">
            {renderContent()}
          </div>
          
          {currentStep === 'form' && <OrderFormFooter />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default React.memo(Order);
