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
    const { orderData, amount } = await req.json();
    
    console.log('Creating Yoco payment for amount:', amount);
    
    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY');
    
    if (!yocoSecretKey) {
      throw new Error('Yoco secret key not configured');
    }

    // Create payment intent with Yoco
    const paymentPayload = {
      amount: amount, // Amount in cents
      currency: 'ZAR',
      metadata: {
        order_id: crypto.randomUUID(),
        customer_name: orderData.name,
        customer_email: orderData.email,
        item: orderData.item,
        size: orderData.size,
        color: orderData.color,
        quantity: orderData.quantity,
      },
    };

    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentIntent = await response.json();
    
    if (!response.ok) {
      console.error('Yoco payment creation failed:', paymentIntent);
      throw new Error(paymentIntent.message || 'Failed to create Yoco payment');
    }

    console.log('Yoco payment intent created successfully:', paymentIntent.id);

    // Store order in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.name,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        item: orderData.item,
        size: orderData.size,
        color: orderData.color,
        quantity: orderData.quantity,
        special_instructions: orderData.specialInstructions,
        total_amount: amount,
        status: 'pending',
        yoco_payment_id: paymentIntent.id,
      });

    if (orderError) {
      console.error('Error storing order:', orderError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.id, // Yoco uses the payment ID as client secret
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in create-yoco-payment:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});