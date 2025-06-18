
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderData, amount } = await req.json()
    console.log('Creating payment for order:', orderData)

    // First, create the order in our database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.name,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        item: orderData.item,
        quantity: orderData.quantity,
        color: orderData.color,
        size: orderData.size,
        special_instructions: orderData.specialInstructions,
        total_amount: amount,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      throw new Error('Failed to create order')
    }

    console.log('Order created successfully:', order.id)

    // Create payment intent with Yoco
    const yocoResponse = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('YOCO_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'ZAR',
        metadata: {
          order_id: order.id,
          customer_email: orderData.email,
          customer_name: orderData.name,
        }
      })
    })

    if (!yocoResponse.ok) {
      const errorText = await yocoResponse.text()
      console.error('Yoco API error:', errorText)
      throw new Error('Failed to create payment with Yoco')
    }

    const yocoData = await yocoResponse.json()
    console.log('Yoco payment created:', yocoData.id)

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        yoco_payment_id: yocoData.id,
        amount: amount,
        status: 'pending'
      })

    if (paymentError) {
      console.error('Payment record creation error:', paymentError)
    }

    return new Response(JSON.stringify({
      success: true,
      order_id: order.id,
      payment_id: yocoData.id,
      public_key: Deno.env.get('YOCO_PUBLIC_KEY')
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
