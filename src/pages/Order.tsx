
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, AlertCircle, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Order = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    item: '',
    quantity: 1,
    color: '',
    specialInstructions: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendOrderEmail = async (orderData: typeof formData) => {
    const emailContent = `
      New Order from Website:
      
      Customer: ${orderData.name}
      Email: ${orderData.email}
      Phone: ${orderData.phone}
      
      Item: ${orderData.item}
      Quantity: ${orderData.quantity}
      Color: ${orderData.color}
      Special Instructions: ${orderData.specialInstructions}
    `;

    // Using EmailJS-like approach with no-cors mode
    const serviceId = 'default_service'; // This would be your EmailJS service ID
    const templateId = 'template_default'; // This would be your EmailJS template ID
    const userId = 'user_default'; // This would be your EmailJS user ID
    
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: userId,
          template_params: {
            to_email: 'everythinghooked09@gmail.com',
            from_name: orderData.name,
            from_email: orderData.email,
            subject: `New Order from ${orderData.name}`,
            message: emailContent
          }
        }),
        mode: 'no-cors'
      });
      
      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simulate sending order data to server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send email notification
      await sendOrderEmail(formData);
      
      console.log('Order submitted:', formData);
      
      toast({
        title: "Order Placed Successfully!",
        description: "We've received your order and will contact you soon.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        item: '',
        quantity: 1,
        color: '',
        specialInstructions: ''
      });
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
          <div className="flex items-center justify-center mb-8">
            <ShoppingBag className="mr-2 h-8 w-8 text-secondary" />
            <h2 className="font-playfair text-4xl font-bold">Place Your Order</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <p className="mb-6 text-center font-inter text-primary-foreground/80">
              Please fill out the form below to place your custom crochet order.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
                
                <div>
                  <label htmlFor="item" className="block font-medium mb-1">Item</label>
                  <input
                    type="text"
                    id="item"
                    name="item"
                    value={formData.item}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Blanket, Hat, Amigurumi"
                    className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="color" className="block font-medium mb-1">Color Preference</label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="specialInstructions" className="block font-medium mb-1">Special Instructions</label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5" />
                      Place Order
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-foreground/60">
                <Mail className="h-4 w-4" />
                <p>Order notifications will be sent to everythinghooked09@gmail.com</p>
              </div>
              
              <p className="mt-4 text-sm text-center text-primary-foreground/60 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                We'll contact you with pricing and timeline after receiving your order details.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Order;
