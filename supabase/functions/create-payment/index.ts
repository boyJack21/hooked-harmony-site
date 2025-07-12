import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
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

    const { amount, currency, orderData }: PaymentRequest = await req.json();

    console.log('Creating payment for amount:', amount, 'currency:', currency);

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        item: orderData.item,
        quantity: orderData.quantity,
        color: orderData.color,
        size: orderData.size,
        special_instructions: orderData.special_instructions,
        total_amount: amount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // Create Yoco payment
    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY');
    if (!yocoSecretKey) {
      throw new Error('Yoco secret key not configured');
    }

    const yocoPayload = {
      amount: amount,
      currency: currency,
      metadata: {
        order_id: order.id,
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name
      }
    };

    const yocoResponse = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(yocoPayload)
    });

    if (!yocoResponse.ok) {
      const errorText = await yocoResponse.text();
      console.error('Yoco API error:', errorText);
      throw new Error('Failed to create Yoco payment');
    }

    const yocoData = await yocoResponse.json();
    console.log('Yoco payment created:', yocoData.id);

    // Update order with Yoco payment ID
    await supabaseClient
      .from('orders')
      .update({ yoco_payment_id: yocoData.id })
      .eq('id', order.id);

    // Create payment record
    await supabaseClient
      .from('payments')
      .insert({
        order_id: order.id,
        amount: amount,
        currency: currency,
        status: 'pending',
        yoco_payment_id: yocoData.id,
        payment_method: 'yoco'
      });

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: yocoData.id,
        order_id: order.id,
        checkout_url: yocoData.redirectUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});