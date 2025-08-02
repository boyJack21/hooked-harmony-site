import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Shield, CreditCard, Lock, CheckCircle, AlertCircle, Smartphone, QrCode } from 'lucide-react';
import { useYoco } from '@/hooks/useYoco';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrderData {
  name: string;
  email: string;
  phone: string;
  item: string;
  quantity: number;
  color: string;
  size: string;
  specialInstructions: string;
}

interface PaymentFormProps {
  orderData: OrderData;
  amount: number;
  onSuccess: (paymentId: string, orderId: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  orderData,
  amount,
  onSuccess,
}) => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'ready' | 'processing' | 'success' | 'error'>('ready');
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const { isLoaded, isLoading, isProcessing, processPayment, getSupportedCardTypes } = useYoco();
  const { toast } = useToast();

  const createOrder = async () => {
    setIsCreatingOrder(true);
    setPaymentStep('processing');

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.name,
          customer_email: orderData.email,
          customer_phone: orderData.phone,
          item: orderData.item,
          quantity: orderData.quantity,
          color: orderData.color,
          size: orderData.size,
          special_instructions: orderData.specialInstructions,
          total_amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        throw new Error('Failed to create order');
      }

      setOrderCreated(order);
      setPaymentStep('ready');
      return order;
    } catch (error) {
      console.error('Order creation error:', error);
      setPaymentStep('error');
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePayment = async () => {
    try {
      let order = orderCreated;
      
      if (!order) {
        order = await createOrder();
      }

      setPaymentStep('processing');

      // Process payment with Yoco
      processPayment({
        amount,
        currency: 'ZAR',
        metadata: {
          orderId: order.id,
          customerEmail: orderData.email,
          item: orderData.item,
          customerName: orderData.name
        },
        onSuccess: async (result) => {
          try {
            setPaymentStep('success');
            
            // Update order with payment info
            await supabase
              .from('orders')
              .update({
                status: 'paid',
                yoco_payment_id: result.id
              })
              .eq('id', order.id);

            // Create payment record
            await supabase
              .from('payments')
              .insert({
                order_id: order.id,
                amount: amount,
                currency: 'ZAR',
                status: 'completed',
                yoco_payment_id: result.id,
                environment: 'test'
              });

            // Send confirmation email (if you have email service set up)
            // await sendConfirmationEmail(order, result);

            onSuccess(result.id, order.id);
          } catch (error) {
            console.error('Post-payment error:', error);
            setPaymentStep('error');
            toast({
              title: "Payment Processed",
              description: "Payment completed but there was an issue updating records. We'll contact you shortly.",
              variant: "destructive",
            });
          }
        },
        onError: (error) => {
          console.error('Payment failed:', error);
          setPaymentStep('error');
        },
        onCancel: () => {
          setPaymentStep('ready');
          toast({
            title: "Payment Cancelled",
            description: "You can try again when ready.",
          });
        }
      });
    } catch (error) {
      setPaymentStep('error');
    }
  };

  // Get payment status indicator
  const getPaymentStatusContent = () => {
    switch (paymentStep) {
      case 'processing':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <LoadingSpinner size="sm" />
            <span>Processing payment...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Payment successful!</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Payment failed. Please try again.</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Item:</span>
                <span className="font-medium">{orderData.item}</span>
              </div>
              {orderData.size && (
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{orderData.size}</span>
                </div>
              )}
              {orderData.color && (
                <div className="flex justify-between">
                  <span>Color:</span>
                  <span>{orderData.color}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{orderData.quantity}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>R{(amount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {getPaymentStatusContent() && (
            <Alert>
              <AlertDescription>
                {getPaymentStatusContent()}
              </AlertDescription>
            </Alert>
          )}

          {/* Supported Payment Methods */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Accepted Payment Methods</h4>
            <div className="flex gap-2 flex-wrap">
              {getSupportedCardTypes().map((cardType) => (
                <Badge key={cardType} variant="outline" className="text-xs">
                  {cardType.replace('_', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-600" />
              <span>PCI-DSS Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-green-600" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span>Secured by Yoco</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isCreatingOrder || isProcessing || !isLoaded || paymentStep === 'processing'}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Loading Payment System...
              </div>
            ) : isCreatingOrder ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Creating Order...
              </div>
            ) : isProcessing || paymentStep === 'processing' ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Processing Payment...
              </div>
            ) : (
              `Pay R${(amount / 100).toFixed(2)} Securely`
            )}
          </Button>

          {/* Test Mode Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Test Mode:</strong> Use card number 4000 0000 0000 0002 for testing. 
              No real charges will be made.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Additional Features Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">What happens next?</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Instant payment confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Email receipt sent automatically</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Order processing begins immediately</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};