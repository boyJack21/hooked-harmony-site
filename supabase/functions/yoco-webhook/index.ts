
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

    const webhookData = await req.json()
    console.log('Received Yoco webhook:', webhookData)

    const { type, payload } = webhookData

    if (type === 'payment.succeeded' || type === 'payment.failed') {
      const paymentId = payload.id
      const status = type === 'payment.succeeded' ? 'successful' : 'failed'
      const orderId = payload.metadata?.order_id

      console.log(`Processing webhook for payment ${paymentId}, order ${orderId}, status: ${status}`)

      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ 
          status,
          payment_method: payload.source?.type || 'card',
          yoco_payment_id: paymentId
        })
        .eq('order_id', orderId)

      if (paymentError) {
        console.error('Error updating payment:', paymentError)
      }

      // Update order status
      if (orderId) {
        const orderStatus = status === 'successful' ? 'paid' : 'failed'
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            status: orderStatus,
            yoco_payment_id: paymentId
          })
          .eq('id', orderId)

        if (orderError) {
          console.error('Error updating order:', orderError)
        }
      }

      console.log(`Payment ${paymentId} status updated to ${status}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(JSON.stringify({
      error: 'Webhook processing failed'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
