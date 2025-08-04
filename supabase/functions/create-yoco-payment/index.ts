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
    
    console.log('Creating order for Yoco payment, amount:', amount);
    
    // Store order in database first (before payment)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const orderId = crypto.randomUUID();

    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
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
      });

    if (orderError) {
      console.error('Error storing order:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('Order created successfully:', orderId);

    // Return order ID for frontend to use with Yoco SDK
    return new Response(JSON.stringify({ 
      success: true,
      orderId: orderId,
      amount: amount,
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