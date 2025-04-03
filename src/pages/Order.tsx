
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { OrderForm } from '@/components/order/OrderForm';
import { OrderFormHeader } from '@/components/order/OrderFormHeader';
import { OrderFormFooter } from '@/components/order/OrderFormFooter';
import PaymentDetails from '@/components/order/PaymentDetails';
import { sendOrderEmail } from '@/services/emailService';
import { validateOrderForm } from '@/services/validationService';
import { OrderFormData } from '@/types/order';
import { processPayment, PaymentDetails as PaymentDetailsType, PaymentMethod } from '@/services/paymentService';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation, useNavigate } from 'react-router-dom';

const MAX_ORDERS_PER_SESSION = 2;
const ORDER_LIMIT_KEY = 'everythinghooked_order_count';

// Mock function to calculate order total
const calculateOrderTotal = (formData: OrderFormData): number => {
  // Simplified pricing logic, would be more complex in a real app
  const basePrice = formData.item.toLowerCase().includes('cardigan') ? 450 : 
                    formData.item.toLowerCase().includes('top') ? 400 : 
                    formData.item.toLowerCase().includes('beanie') ? 150 : 300;
  
  return basePrice * formData.quantity;
};

const Order = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    email: '',
    phone: '',
    item: '',
    quantity: 1,
    color: '',
    specialInstructions: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  
  // If product was passed from ProductDetail page, populate the form
  useEffect(() => {
    if (location.state?.product) {
      const product = location.state.product;
      setFormData(prev => ({
        ...prev,
        item: product.title || '',
      }));
    }
  }, [location.state]);

  // Load order count from localStorage on component mount
  useEffect(() => {
    const savedOrderCount = localStorage.getItem(ORDER_LIMIT_KEY);
    if (savedOrderCount) {
      setOrderCount(parseInt(savedOrderCount, 10));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    
    // Handle numeric inputs
    if (name === 'quantity') {
      processedValue = value === '' ? 1 : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission initiated with data:', formData);
    
    // Check if user has reached order limit
    if (orderCount >= MAX_ORDERS_PER_SESSION) {
      toast({
        title: "Order Limit Reached",
        description: "You have reached the maximum number of orders (2) per session. Please contact us directly for additional orders.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate form
    const validationErrors = validateOrderForm(formData);
    console.log('Validation results:', validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Form Validation Error",
        description: "Please check the form and fix the errors.",
        variant: "destructive"
      });
      return;
    }
    
    // If validation passed, calculate order total and show payment form
    const total = calculateOrderTotal(formData);
    setOrderTotal(total);
    setShowPayment(true);
    
    // Scroll to payment section
    setTimeout(() => {
      const paymentElement = document.getElementById('payment-section');
      if (paymentElement) {
        paymentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handlePaymentSubmit = async (paymentDetails: PaymentDetailsType) => {
    setPaymentProcessing(true);
    setPaymentError(null);
    
    try {
      console.log('Processing payment with details:', paymentDetails);
      
      // Process payment
      const paymentResult = await processPayment(formData, paymentDetails);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }
      
      // Send order notification email
      console.log('Payment processed successfully, sending email notification');
      const emailResult = await sendOrderEmail(formData);
      
      if (!emailResult) {
        console.error('Email sending failed in Order component');
        // Continue even if email fails - we already have the payment
        toast({
          title: "Email Notification Failed",
          description: "Your order was processed but we couldn't send a confirmation email. Please save your order reference.",
          variant: "warning"
        });
      }
      
      console.log('Order submitted successfully:', formData);
      
      // Increment order count and update localStorage
      const newOrderCount = orderCount + 1;
      setOrderCount(newOrderCount);
      localStorage.setItem(ORDER_LIMIT_KEY, newOrderCount.toString());
      
      // Show success message
      toast({
        title: "Order Placed Successfully!",
        description: `We've received your order #${paymentResult.orderId} and will contact you soon.`,
      });
      
      // Reset form and state
      setFormData({
        name: '',
        email: '',
        phone: '',
        item: '',
        quantity: 1,
        color: '',
        specialInstructions: ''
      });
      setShowPayment(false);
      setErrors({});
      
      // Navigate to home page after short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      
      let errorMessage = "There was an issue processing your payment. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', error.name, error.message);
      }
      
      setPaymentError(errorMessage);
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-primary-foreground pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <OrderFormHeader />
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="mb-6 text-center font-inter text-primary-foreground/80">
              Please fill out the form below to place your custom crochet order.
              {orderCount > 0 && (
                <span className="block mt-2 text-xs text-amber-600 font-medium">
                  You have placed {orderCount} of 2 allowed orders.
                </span>
              )}
            </p>
            
            {!showPayment ? (
              <OrderForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                submitting={submitting}
                errors={errors}
                orderCount={orderCount}
                maxOrders={MAX_ORDERS_PER_SESSION}
              />
            ) : (
              <div id="payment-section">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <PaymentDetails 
                    onPaymentSubmit={handlePaymentSubmit}
                    isProcessing={paymentProcessing}
                    error={paymentError}
                    totalAmount={orderTotal}
                  />
                  
                  {/* Button to go back to order form */}
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="text-sm text-blue-500 hover:text-blue-700"
                      onClick={() => setShowPayment(false)}
                      disabled={paymentProcessing}
                    >
                      ← Back to order details
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
            
            <OrderFormFooter />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Order;
