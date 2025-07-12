import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-yoco-signature',
};

async function verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const dataToSign = encoder.encode(payload);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureArrayBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
    const computedSignature = Array.from(new Uint8Array(signatureArrayBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return signature === computedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const signature = req.headers.get('x-yoco-signature');
    const webhookSecret = Deno.env.get('YOCO_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return new Response('Unauthorized', { status: 401 });
    }

    const payload = await req.text();
    console.log('Received webhook payload:', payload);

    // Verify webhook signature
    const isValidSignature = await verifyWebhookSignature(payload, signature, webhookSecret);
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const webhookData = JSON.parse(payload);
    const { type, data: eventData } = webhookData;

    console.log('Processing webhook event:', type, 'for payment:', eventData.id);

    switch (type) {
      case 'payment.succeeded':
      case 'payment.payment_success':
        await handlePaymentSuccess(supabaseClient, eventData);
        break;
      
      case 'payment.failed':
      case 'payment.payment_failed':
        await handlePaymentFailure(supabaseClient, eventData);
        break;
      
      default:
        console.log('Unhandled webhook event type:', type);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

async function handlePaymentSuccess(supabaseClient: any, paymentData: any) {
  console.log('Processing successful payment:', paymentData.id);

  try {
    // Update payment status
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('yoco_payment_id', paymentData.id);

    if (paymentError) {
      console.error('Error updating payment:', paymentError);
    }

    // Update order status
    const { error: orderError } = await supabaseClient
      .from('orders')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('yoco_payment_id', paymentData.id);

    if (orderError) {
      console.error('Error updating order:', orderError);
    }

    // Get order details for confirmation
    const { data: order } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('yoco_payment_id', paymentData.id)
      .single();

    if (order) {
      // Create order confirmation
      const confirmationNumber = await generateConfirmationNumber(supabaseClient);
      
      await supabaseClient
        .from('order_confirmations')
        .insert({
          order_id: order.id,
          confirmation_number: confirmationNumber,
          status: 'confirmed',
          estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
        });

      console.log('Order confirmation created:', confirmationNumber);
    }

  } catch (error) {
    console.error('Error in payment success handler:', error);
  }
}

async function handlePaymentFailure(supabaseClient: any, paymentData: any) {
  console.log('Processing failed payment:', paymentData.id);

  try {
    // Update payment status
    await supabaseClient
      .from('payments')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('yoco_payment_id', paymentData.id);

    // Update order status
    await supabaseClient
      .from('orders')
      .update({
        status: 'payment_failed',
        updated_at: new Date().toISOString()
      })
      .eq('yoco_payment_id', paymentData.id);

  } catch (error) {
    console.error('Error in payment failure handler:', error);
  }
}

async function generateConfirmationNumber(supabaseClient: any): Promise<string> {
  try {
    const { data, error } = await supabaseClient.rpc('generate_confirmation_number');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating confirmation number:', error);
    return `EH${Date.now().toString().slice(-6)}`;
  }
}