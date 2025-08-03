import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { OrderForm } from '@/components/order/OrderForm';
import { OrderFormHeader } from '@/components/order/OrderFormHeader';
import { OrderFormFooter } from '@/components/order/OrderFormFooter';

import { useToast } from '@/hooks/use-toast';
import { OrderFormData } from '@/types/order';
import { validateOrderForm } from '@/services/validationService';

import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [orderId, setOrderId] = useState<string>('');
  const [orderCount, setOrderCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
    setSubmitting(true);
    
    const formErrors = validateOrderForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }
    
    try {
      // Submit order directly without payment
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

    return (
      <OrderForm 
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleFormSubmit}
        submitting={submitting}
        errors={errors}
        orderCount={orderCount}
        initialSize={selectedSize}
      />
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