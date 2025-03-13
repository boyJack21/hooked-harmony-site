
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { OrderForm } from '@/components/order/OrderForm';
import { OrderFormHeader } from '@/components/order/OrderFormHeader';
import { OrderFormFooter } from '@/components/order/OrderFormFooter';
import { sendOrderEmail } from '@/services/emailService';
import { validateOrderForm } from '@/services/validationService';
import { OrderFormData } from '@/types/order';

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
    
    // Validate form
    const validationErrors = validateOrderForm(formData);
    
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
      // Simulate sending order data to server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send email notification with updated service
      const emailResult = await sendOrderEmail(formData);
      
      if (!emailResult) {
        throw new Error('Failed to send email notification');
      }
      
      console.log('Order submitted:', formData);
      
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
      toast({
        title: "Error Placing Order",
        description: "There was an issue processing your order. Please try again.",
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
            </p>
            
            <OrderForm 
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              submitting={submitting}
              errors={errors}
            />
            
            <OrderFormFooter />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Order;
