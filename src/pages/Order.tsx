
import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import PaymentDetails from '@/components/order/PaymentDetails';
import { PaymentDetails as PaymentDetailsType, processPayment, calculateOrderTotal } from '@/services/paymentService';

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
  
  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  
  // Set the initial size from the URL parameter if available
  useEffect(() => {
    if (selectedSize && !formData.size) {
      setFormData(prev => ({ ...prev, size: selectedSize }));
    }
  }, [selectedSize]);
  
  // Calculate order total whenever form data changes
  useEffect(() => {
    const total = calculateOrderTotal(formData);
    setOrderTotal(total);
  }, [formData]);
  
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
    
    // Show the payment component
    setShowPayment(true);
    
    // Scroll to the payment section
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };
  
  const handlePaymentSubmit = async (paymentDetails: PaymentDetailsType) => {
    setPaymentProcessing(true);
    setPaymentError(null);
    
    try {
      // Process payment
      const result = await processPayment(formData, paymentDetails);
      
      if (result.success) {
        // Send order email
        await sendOrderEmail(formData);
        
        // Show success toast
        toast({
          title: "Payment Successful!",
          description: `Your order #${result.orderId} has been placed. Thank you for your purchase!`,
        });
        
        // Reset form and payment view
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
        setShowPayment(false);
        setOrderCount(prev => prev + 1);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Show payment error
        setPaymentError(result.message);
        toast({
          title: "Payment Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'There was a problem processing your payment';
      setPaymentError(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPaymentProcessing(false);
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
              submitting={showPayment || paymentProcessing}
              errors={errors}
              orderCount={orderCount}
              initialSize={selectedSize}
            />
            
            {showPayment && (
              <PaymentDetails 
                onPaymentSubmit={handlePaymentSubmit}
                isProcessing={paymentProcessing}
                error={paymentError}
                totalAmount={orderTotal}
              />
            )}
          </div>
          
          <OrderFormFooter />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default React.memo(Order);
