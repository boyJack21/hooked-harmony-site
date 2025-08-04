import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentId, orderId } = await req.json();
    
    console.log('Verifying Yoco payment:', paymentId);
    
    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY');
    
    if (!yocoSecretKey) {
      throw new Error('Yoco secret key not configured');
    }

    // Retrieve payment from Yoco
    const response = await fetch(`https://online.yoco.com/v1/charges/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const payment = await response.json();
    
    if (!response.ok) {
      console.error('Failed to retrieve Yoco payment:', payment);
      throw new Error(payment.message || 'Failed to retrieve payment details');
    }

    console.log('Yoco payment retrieved successfully:', payment);

    // Update order and payment status in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({ 
        status: payment.status === 'successful' ? 'completed' : 'failed',
        yoco_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('Error updating order:', orderError);
    }

    // Insert payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        yoco_payment_id: paymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        payment_method: 'yoco',
        environment: 'live',
      });

    if (paymentError) {
      console.error('Error storing payment:', paymentError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in verify-yoco-payment:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});