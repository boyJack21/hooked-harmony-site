import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
            
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for your order. Your payment has been processed successfully.
            </p>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 dark:text-green-200">
                You will receive an email confirmation shortly with your order details and tracking information.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/')} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
              
              <Button variant="outline" onClick={() => navigate('/order')} className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Place Another Order
              </Button>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;