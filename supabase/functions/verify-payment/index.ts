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

    const { orderId } = await req.json()
    console.log('Verifying payment for order:', orderId)

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get the payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (paymentError) {
      console.error('Error fetching payment:', paymentError)
      return new Response(JSON.stringify({ error: 'Payment not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If we have a Yoco payment ID, verify with Yoco API
    if (payment.yoco_payment_id) {
      try {
        const yocoResponse = await fetch(`https://online.yoco.com/v1/charges/${payment.yoco_payment_id}`, {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('YOCO_SECRET_KEY')}`,
            'Content-Type': 'application/json'
          }
        })

        if (yocoResponse.ok) {
          const yocoData = await yocoResponse.json()
          console.log('Yoco payment status:', yocoData.status)

          const newStatus = yocoData.status === 'successful' ? 'successful' : 
                           yocoData.status === 'failed' ? 'failed' : 'pending'

          // Update payment status
          await supabase
            .from('payments')
            .update({ status: newStatus })
            .eq('order_id', orderId)

          // Update order status
          const orderStatus = newStatus === 'successful' ? 'paid' : 
                             newStatus === 'failed' ? 'failed' : 'pending'
          
          await supabase
            .from('orders')
            .update({ status: orderStatus })
            .eq('id', orderId)

          return new Response(JSON.stringify({ 
            status: newStatus,
            verified: true,
            payment_id: payment.yoco_payment_id
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      } catch (error) {
        console.error('Error verifying with Yoco:', error)
      }
    }

    // Return current status if verification failed
    return new Response(JSON.stringify({ 
      status: payment.status,
      verified: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Verification error:', error)
    return new Response(JSON.stringify({
      error: 'Payment verification failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})