import { supabase } from '@/integrations/supabase/client';
import { OrderFormData } from '@/types/order';

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    item: string;
    quantity: number;
    color?: string;
    size?: string;
    special_instructions?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  payment_id?: string;
  order_id?: string;
  checkout_url?: string;
  error?: string;
}

export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: paymentData
    });

    if (error) {
      console.error('Payment creation error:', error);
      throw new Error(error.message || 'Failed to create payment');
    }

    return data;
  } catch (error) {
    console.error('Payment service error:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentId: string): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { payment_id: paymentId }
    });

    if (error) {
      console.error('Payment verification error:', error);
      throw new Error(error.message || 'Failed to verify payment');
    }

    return data;
  } catch (error) {
    console.error('Payment verification service error:', error);
    throw error;
  }
};

export const getPaymentStatus = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Error fetching payment status:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Payment status service error:', error);
    return null;
  }
};

export const getOrderConfirmation = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('order_confirmations')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order confirmation:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Order confirmation service error:', error);
    return null;
  }
};