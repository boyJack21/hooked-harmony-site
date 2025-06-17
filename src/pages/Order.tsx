
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { OrderForm } from '@/components/order/OrderForm';
import { OrderFormHeader } from '@/components/order/OrderFormHeader';
import { OrderFormFooter } from '@/components/order/OrderFormFooter';
import { useToast } from '@/components/ui/use-toast';
import { OrderFormData } from '@/types/order';
import { validateOrderForm } from '@/services/validationService';
import { sendOrderEmail } from '@/services/emailService';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = location.state?.product;
  const selectedSize = location.state?.selectedSize;
  
  // Using lazy state initialization for better performance
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
  const [submitting, setSubmitting] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  
  // Set the initial size from the URL parameter if available
  useEffect(() => {
    if (selectedSize && !formData.size) {
      setFormData(prev => ({ ...prev, size: selectedSize }));
    }
  }, [selectedSize]);
  
  // Optimize the form change handler with memoization
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user makes changes
    setErrors(prev => {
      if (!prev[name]) return prev;
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
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
    
    setSubmitting(true);
    
    try {
      // Send order email
      await sendOrderEmail(formData);
      
      // Generate a simple order ID
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Show success toast
      toast({
        title: "Order Submitted!",
        description: `Your order #${orderId} has been submitted. We'll contact you soon to arrange payment and delivery.`,
      });
      
      // Reset form
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
      setOrderCount(prev => prev + 1);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'There was a problem submitting your order';
      toast({
        title: "Order Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          <OrderFormHeader />
          
          <div className="my-6 md:my-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-8">
            <OrderForm 
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              submitting={submitting}
              errors={errors}
              orderCount={orderCount}
              initialSize={selectedSize}
            />
          </div>
          
          <OrderFormFooter />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default React.memo(Order);
