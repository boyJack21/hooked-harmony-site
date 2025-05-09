
import { OrderFormData } from '@/types/order';
import { toast } from '@/hooks/use-toast';

export interface PaymentResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

const MOCK_PAYMENT_DELAY = 1500; // Simulate API delay in ms

export type PaymentMethod = 'credit_card' | 'eft' | 'mobile_payment';

export interface PaymentDetails {
  method: PaymentMethod;
  email: string;
  reference?: string;
}

// Simulated payment processing service
export async function processPayment(
  orderData: OrderFormData, 
  paymentDetails: PaymentDetails
): Promise<PaymentResponse> {
  try {
    console.log('Processing payment with details:', { orderData, paymentDetails });
    
    // In a real implementation, this would make an API call to a payment gateway
    // For now, we simulate a successful payment with a delay
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random order ID
        const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        
        // Real implementation would validate payment details and process payment
        resolve({
          success: true,
          message: 'Payment processed successfully',
          orderId,
        });
      }, MOCK_PAYMENT_DELAY);
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process payment',
    };
  }
}

// Helper function to validate payment details
export function validatePaymentDetails(paymentDetails: PaymentDetails): string | null {
  if (!paymentDetails.method) {
    return 'Please select a payment method';
  }
  
  if (!paymentDetails.email) {
    return 'Email is required for payment receipt';
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentDetails.email)) {
    return 'Please enter a valid email address';
  }
  
  return null; // No validation errors
}

// Calculate order total based on item and quantity
export function calculateOrderTotal(orderData: OrderFormData): number {
  // This is a simplified pricing model - in a real app, this would likely
  // call an API or use data from a database
  const itemPrices: Record<string, number> = {
    'Beanie': 150,
    'Bucket Hat': 150,
    'Polo Shirt': 320,
    'Crop Cardigan': 400,
    'Color Block Cardigan': 540,
    'Cardigan': 450,
    'Long Cardigan': 520,
    'Ruffled Crop Top': 250,
    'Bikini Set': 200
  };
  
  // Get base price - default to 300 if item not found in price list
  let basePrice = 300;
  
  // Try to match item name with our price list
  for (const [itemName, price] of Object.entries(itemPrices)) {
    if (orderData.item.toLowerCase().includes(itemName.toLowerCase())) {
      basePrice = price;
      break;
    }
  }
  
  // Adjust for size if applicable
  if (orderData.size) {
    switch(orderData.size) {
      case 'S':
        // Small size uses the base price
        break;
      case 'M':
        // Medium size costs 10% more
        basePrice *= 1.1;
        break;
      case 'L':
        // Large size costs 20% more
        basePrice *= 1.2;
        break;
      case 'XL':
        // XL size costs 30% more
        basePrice *= 1.3;
        break;
    }
  }
  
  // Multiply by quantity
  const total = basePrice * (orderData.quantity || 1);
  
  // Round to 2 decimal places
  return Math.round(total * 100) / 100;
}
