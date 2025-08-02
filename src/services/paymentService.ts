import { supabase } from '@/integrations/supabase/client';

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

export const getOrderDetails = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order details:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Order details service error:', error);
    return null;
  }
};