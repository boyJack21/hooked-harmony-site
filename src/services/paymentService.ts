
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
