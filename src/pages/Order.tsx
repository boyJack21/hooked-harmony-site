import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { OrderForm } from '@/components/order/OrderForm';
import { OrderFormHeader } from '@/components/order/OrderFormHeader';
import { OrderFormFooter } from '@/components/order/OrderFormFooter';
import { PaymentForm } from '@/components/order/PaymentForm';
import { useToast } from '@/hooks/use-toast';
import { OrderFormData } from '@/types/order';
import { validateOrderForm } from '@/services/validationService';
import { createPayment } from '@/services/paymentService';
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
  const [currentStep, setCurrentStep] = useState<'form' | 'payment' | 'success'>('form');
  const [orderId, setOrderId] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [orderCount, setOrderCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [orderAmount, setOrderAmount] = useState(500); // Default amount in ZAR
  
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
    
    // Move to payment step
    setCurrentStep('payment');
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    setPaymentId(paymentId);
    setOrderId(orderId);
    
    // Transform orderData to match payment service interface
    const paymentOrderData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      item: formData.item,
      quantity: formData.quantity,
      color: formData.color,
      size: formData.size,
      special_instructions: formData.specialInstructions,
    };
    
    // Redirect to success page with parameters
    navigate(`/payment-success?payment_id=${paymentId}&order_id=${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setPaymentId('');
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
      
      case 'payment':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                onClick={handleBackToForm}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Order Details
              </Button>
            </div>
            <PaymentForm
              orderData={formData}
              amount={orderAmount}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
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
          {currentStep === 'payment' && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
              <p className="text-muted-foreground">
                Secure payment powered by Yoco
              </p>
            </div>
          )}
          
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