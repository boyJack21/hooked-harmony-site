import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { payment_id } = await req.json();

    console.log('Verifying payment:', payment_id);

    if (!payment_id) {
      throw new Error('Payment ID is required');
    }

    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY');
    if (!yocoSecretKey) {
      throw new Error('Yoco secret key not configured');
    }

    // Verify payment with Yoco
    const yocoResponse = await fetch(`https://online.yoco.com/v1/charges/${payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!yocoResponse.ok) {
      const errorText = await yocoResponse.text();
      console.error('Yoco verification error:', errorText);
      throw new Error('Failed to verify payment with Yoco');
    }

    const paymentData = await yocoResponse.json();
    console.log('Payment verification result:', paymentData.status);

    // Update payment status in database
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        status: paymentData.status === 'successful' ? 'completed' : 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('yoco_payment_id', payment_id);

    if (updateError) {
      console.error('Database update error:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: paymentData.status,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_data: paymentData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Payment verification error:', error);
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