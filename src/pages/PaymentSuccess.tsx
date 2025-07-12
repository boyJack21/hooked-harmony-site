import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Calendar, Mail, Phone, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getOrderConfirmation, getPaymentStatus } from '@/services/paymentService';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) {
        toast({
          title: "Invalid Order",
          description: "No order ID provided",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        const [confirmation, payment] = await Promise.all([
          getOrderConfirmation(orderId),
          getPaymentStatus(orderId)
        ]);

        setOrderDetails(confirmation);
        setPaymentDetails(payment);
      } catch (error) {
        console.error('Error loading order details:', error);
        toast({
          title: "Error Loading Order",
          description: "Failed to load order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Loading order details...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. We've received your payment and will process your order shortly.
            </p>
          </div>

          {/* Order Details Card */}
          {orderDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Confirmation Number
                    </label>
                    <p className="font-mono text-lg font-bold">
                      {orderDetails.confirmation_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge variant="default">
                        {orderDetails.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {orderDetails.estimated_delivery && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Estimated delivery: {new Date(orderDetails.estimated_delivery).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {orderDetails.tracking_number && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tracking Number
                    </label>
                    <p className="font-mono">{orderDetails.tracking_number}</p>
                  </div>
                )}

                {orderDetails.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Notes
                    </label>
                    <p className="text-sm">{orderDetails.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Details Card */}
          {paymentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Amount Paid
                    </label>
                    <p className="text-lg font-bold">
                      {paymentDetails.currency} {(paymentDetails.amount / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Payment Method
                    </label>
                    <p className="capitalize">{paymentDetails.payment_method}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Transaction ID
                  </label>
                  <p className="font-mono text-sm">{paymentDetails.yoco_payment_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment Date
                  </label>
                  <p className="text-sm">
                    {new Date(paymentDetails.created_at).toLocaleDateString()} at{' '}
                    {new Date(paymentDetails.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Email Confirmation</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email confirmation with your order details shortly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Contact for Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll contact you via phone or email with any order updates.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order will be processed and prepared for delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild>
              <Link to="/order">
                Place Another Order
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;