import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    
    console.log('Retrieving PayPal order details for:', orderId);
    
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // Get access token
    const auth = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get order details
    const orderResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const orderDetails = await orderResponse.json();
    
    if (!orderResponse.ok) {
      console.error('Failed to retrieve PayPal order:', orderDetails);
      throw new Error(orderDetails.message || 'Failed to retrieve order details');
    }

    console.log('PayPal order details retrieved successfully:', orderDetails);

    return new Response(JSON.stringify({ 
      success: true,
      order: orderDetails,
      status: orderDetails.status,
      amount: orderDetails.purchase_units[0]?.amount?.value,
      currency: orderDetails.purchase_units[0]?.amount?.currency_code,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-paypal-order:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});