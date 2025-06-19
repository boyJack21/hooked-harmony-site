
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
  const item = formData.item.toLowerCase();
  const size = formData.size;
  const quantity = formData.quantity || 1;
  
  let basePrice = 0; // Price in cents
  
  // Product-specific pricing
  if (item.includes('pink ruffle hat') || item.includes('beanie') || item.includes('bucket hat')) {
    basePrice = 15000; // R150.00
  } else if (item.includes('polo shirt')) {
    if (size === 'S') basePrice = 28000; // R280.00
    else if (size === 'M') basePrice = 32000; // R320.00
    else if (size === 'L') basePrice = 36000; // R360.00
    else basePrice = 28000; // Default to S
  } else if (item.includes('crop cardigan')) {
    if (size === 'S') basePrice = 35000; // R350.00
    else if (size === 'M') basePrice = 40000; // R400.00
    else basePrice = 35000; // Default to S
  } else if (item.includes('color block cardigan')) {
    if (size === 'S') basePrice = 50000; // R500.00
    else if (size === 'M') basePrice = 54000; // R540.00
    else if (size === 'L') basePrice = 60000; // R600.00
    else basePrice = 50000; // Default to S
  } else if (item.includes('long cardigan')) {
    if (size === 'S') basePrice = 45000; // R450.00
    else if (size === 'M') basePrice = 52000; // R520.00
    else if (size === 'L') basePrice = 60000; // R600.00
    else basePrice = 45000; // Default to S
  } else if (item.includes('cardigan') && !item.includes('crop') && !item.includes('long') && !item.includes('color block')) {
    if (size === 'S') basePrice = 40000; // R400.00
    else if (size === 'M') basePrice = 45000; // R450.00
    else if (size === 'L') basePrice = 50000; // R500.00
    else basePrice = 40000; // Default to S
  } else if (item.includes('ruffled crop top')) {
    if (size === 'S') basePrice = 20000; // R200.00
    else if (size === 'M') basePrice = 25000; // R250.00
    else if (size === 'L') basePrice = 28000; // R280.00
    else basePrice = 20000; // Default to S
  } else if (item.includes('bikini')) {
    if (size === 'S') basePrice = 17000; // R170.00
    else if (size === 'M') basePrice = 20000; // R200.00
    else if (size === 'L') basePrice = 23000; // R230.00
    else basePrice = 17000; // Default to S
  } else {
    // Default pricing for custom items
    basePrice = 25000; // R250.00
  }
  
  return basePrice * quantity;
};
