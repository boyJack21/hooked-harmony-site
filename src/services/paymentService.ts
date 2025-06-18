
import { supabase } from '@/integrations/supabase/client';
import { OrderFormData } from '@/types/order';

export interface PaymentRequest {
  orderData: OrderFormData;
  amount: number; // Amount in cents
}

export interface PaymentResponse {
  success: boolean;
  order_id?: string;
  payment_id?: string;
  public_key?: string;
  error?: string;
}

export const createPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: request
    });

    if (error) {
      console.error('Payment creation error:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (error) {
    console.error('Payment service error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment processing failed'
    };
  }
};

export const calculateOrderAmount = (formData: OrderFormData): number => {
  // Base price calculation - you can customize this based on your pricing structure
  const basePrice = 25000; // R250.00 in cents
  const quantityMultiplier = formData.quantity || 1;
  
  return basePrice * quantityMultiplier;
};
