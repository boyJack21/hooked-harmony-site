import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CreditCard, Lock } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoaded, processPayment } = useYoco();
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // First create order in database
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

      // Process payment with Yoco
      processPayment(
        amount, // amount in cents
        'ZAR',
        {
          orderId: order.id,
          customerEmail: orderData.email,
          item: orderData.item
        },
        async (result) => {
          try {
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

            toast({
              title: "Payment Successful!",
              description: "Your order has been confirmed.",
            });

            onSuccess(result.id, order.id);
          } catch (error) {
            console.error('Post-payment error:', error);
            toast({
              title: "Payment Processed",
              description: "Payment completed but there was an issue updating records. We'll contact you shortly.",
              variant: "destructive",
            });
          }
          setIsProcessing(false);
        },
        (error) => {
          console.error('Payment failed:', error);
          toast({
            title: "Payment Failed",
            description: error.message || "Payment could not be processed",
            variant: "destructive",
          });
          setIsProcessing(false);
        }
      );
    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Item:</span>
              <span>{orderData.item}</span>
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
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Total:</span>
              <span>R{(amount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Secured by Yoco</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing || !isLoaded}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            "Processing Payment..."
          ) : (
            `Pay R${(amount / 100).toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};