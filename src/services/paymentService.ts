
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
  const size = formData.size?.toLowerCase() || '';
  const quantity = formData.quantity || 1;
  
  console.log('Calculating price for:', { item, size, quantity });
  
  let basePrice = 0; // Price in cents
  
  // Product-specific pricing with more specific matching
  if (item.includes('pink ruffle hat') || item.includes('ruffle hat')) {
    basePrice = 15000; // R150.00
    console.log('Pink ruffle hat detected - base price:', basePrice);
  } else if (item.includes('beanie')) {
    basePrice = 15000; // R150.00
    console.log('Beanie detected - base price:', basePrice);
  } else if (item.includes('bucket hat')) {
    basePrice = 15000; // R150.00
    console.log('Bucket hat detected - base price:', basePrice);
  } else if (item.includes('polo shirt') || item.includes('polo')) {
    if (size === 's') basePrice = 28000; // R280.00
    else if (size === 'm') basePrice = 32000; // R320.00
    else if (size === 'l') basePrice = 36000; // R360.00
    else basePrice = 28000; // Default to S
    console.log('Polo shirt detected - base price:', basePrice, 'for size:', size);
  } else if (item.includes('crop cardigan')) {
    if (size === 's') basePrice = 35000; // R350.00
    else if (size === 'm') basePrice = 40000; // R400.00
    else basePrice = 35000; // Default to S
    console.log('Crop cardigan detected - base price:', basePrice, 'for size:', size);
  } else if (item.includes('color block cardigan')) {
    if (size === 's') basePrice = 50000; // R500.00
    else if (size === 'm') basePrice = 54000; // R540.00
    else if (size === 'l') basePrice = 60000; // R600.00
    else basePrice = 50000; // Default to S
    console.log('Color block cardigan detected - base price:', basePrice, 'for size:', size);
  } else if (item.includes('long cardigan')) {
    if (size === 's') basePrice = 45000; // R450.00
    else if (size === 'm') basePrice = 52000; // R520.00
    else if (size === 'l') basePrice = 60000; // R600.00
    else basePrice = 45000; // Default to S
    console.log('Long cardigan detected - base price:', basePrice, 'for size:', size);
  } else if (item.includes('cardigan') && !item.includes('crop') && !item.includes('long') && !item.includes('color block')) {
    if (size === 's') basePrice = 40000; // R400.00
    else if (size === 'm') basePrice = 45000; // R450.00
    else if (size === 'l') basePrice = 50000; // R500.00
    else basePrice = 40000; // Default to S
    console.log('Regular cardigan detected - base price:', basePrice, 'for size:', size);
  } else if (item.includes('ruffled crop top') || item.includes('crop top')) {
    if (size === 's') basePrice = 20000; // R200.00
    else if (size === 'm') basePrice = 25000; // R250.00
    else if (size === 'l') basePrice = 28000; // R280.00
    else basePrice = 20000; // Default to S
    console.log('Ruffled crop top detected - base price:', basePrice, 'for size:', size);
  } else if (item.includes('bikini')) {
    if (size === 's') basePrice = 17000; // R170.00
    else if (size === 'm') basePrice = 20000; // R200.00
    else if (size === 'l') basePrice = 23000; // R230.00
    else basePrice = 17000; // Default to S
    console.log('Bikini detected - base price:', basePrice, 'for size:', size);
  } else {
    // Default pricing for custom items
    basePrice = 25000; // R250.00
    console.log('Default/custom item - base price:', basePrice);
  }
  
  const totalAmount = basePrice * quantity;
  console.log('Final calculated amount:', totalAmount, 'cents (R' + (totalAmount / 100).toFixed(2) + ')');
  
  return totalAmount;
};
