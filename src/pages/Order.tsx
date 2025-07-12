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
  const [currentStep, setCurrentStep] = useState<'form' | 'success'>('form');
  const [orderId, setOrderId] = useState<string>('');
  const [orderCount, setOrderCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
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
    
    // Simulate order submission
    try {
      // Generate a simple order ID
      const newOrderId = `EH${Date.now().toString().slice(-6)}`;
      
      setTimeout(() => {
        setOrderId(newOrderId);
        setCurrentStep('success');
        setOrderCount(prev => prev + 1);
        setSubmitting(false);
        
        toast({
          title: "Order Submitted Successfully! 🎉",
          description: `Order #${newOrderId} has been received. We'll contact you soon to arrange payment and delivery.`,
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
      
    } catch (error) {
      setSubmitting(false);
      toast({
        title: "Order Submission Failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive",
      });
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
    setCurrentStep('form');
    setOrderId('');
    setErrors({});
    setSubmitting(false);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'form':
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
      
      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Order Submitted Successfully!</h2>
              <p className="text-muted-foreground mb-4">
                Your order #{orderId} has been received successfully.
              </p>
              <p className="text-sm text-muted-foreground">
                We'll contact you soon via phone or email to arrange payment and delivery details.
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