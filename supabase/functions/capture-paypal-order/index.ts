import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getPayPalAccessToken() {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderID, orderData } = await req.json();
    
    console.log('Capturing PayPal order:', orderID);
    
    const accessToken = await getPayPalAccessToken();
    
    // Capture the payment
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const capture = await response.json();
    
    if (!response.ok) {
      console.error('PayPal capture failed:', capture);
      throw new Error(capture.message || 'Failed to capture PayPal payment');
    }

    console.log('PayPal payment captured successfully:', capture);

    // Store payment in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const transactionId = capture.purchase_units[0]?.payments?.captures[0]?.id;
    const amount = parseFloat(capture.purchase_units[0]?.payments?.captures[0]?.amount?.value || '0') * 100; // Convert to cents

    // Insert payment record
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        transaction_id: transactionId,
        paypal_order_id: orderID,
        amount_cents: amount,
        currency: 'USD',
        status: 'completed',
        customer_name: orderData.name,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        item_description: orderData.item,
        item_size: orderData.size,
        item_color: orderData.color,
        quantity: orderData.quantity,
        special_instructions: orderData.specialInstructions,
        payment_method: 'paypal',
        captured_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error storing payment:', insertError);
      // Don't fail the whole transaction if DB insert fails
    }

    return new Response(JSON.stringify({ 
      success: true, 
      transactionId,
      amount: amount,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in capture-paypal-order:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});