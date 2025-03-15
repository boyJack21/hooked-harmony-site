
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { OrderForm } from '@/components/order/OrderForm';
import { OrderFormHeader } from '@/components/order/OrderFormHeader';
import { OrderFormFooter } from '@/components/order/OrderFormFooter';
import { sendOrderEmail } from '@/services/emailService';
import { validateOrderForm } from '@/services/validationService';
import { OrderFormData } from '@/types/order';

const MAX_ORDERS_PER_SESSION = 2;
const ORDER_LIMIT_KEY = 'everythinghooked_order_count';

const Order = () => {
  const { toast } = useToast();
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
    
    setSubmitting(true);
    
    try {
      console.log('Proceeding with form submission after validation passed');
      
      // Send email notification
      console.log('Attempting to send email notification');
      const emailResult = await sendOrderEmail(formData);
      
      if (!emailResult) {
        console.error('Email sending failed in Order component');
        throw new Error('Failed to send email notification');
      }
      
      console.log('Order submitted successfully:', formData);
      
      // Increment order count and update localStorage
      const newOrderCount = orderCount + 1;
      setOrderCount(newOrderCount);
      localStorage.setItem(ORDER_LIMIT_KEY, newOrderCount.toString());
      
      toast({
        title: "Order Placed Successfully!",
        description: "We've received your order and will contact you soon.",
      });
      
      // Reset form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        item: '',
        quantity: 1,
        color: '',
        specialInstructions: ''
      });
      
      // Clear any errors
      setErrors({});
    } catch (error) {
      console.error('Error submitting order:', error);
      
      let errorMessage = "There was an issue processing your order. Please try again.";
      if (error instanceof Error) {
        errorMessage += ` Error: ${error.message}`;
        console.error('Error details:', error.name, error.message);
      }
      
      toast({
        title: "Error Placing Order",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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
            
            <OrderForm 
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              submitting={submitting}
              errors={errors}
              orderCount={orderCount}
              maxOrders={MAX_ORDERS_PER_SESSION}
            />
            
            <OrderFormFooter />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Order;
