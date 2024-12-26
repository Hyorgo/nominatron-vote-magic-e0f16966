import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    })
  }

  try {
    console.log('Testing Stripe connection...')
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not found in environment variables')
      throw new Error('STRIPE_SECRET_KEY not configured')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    // Test the connection by making a simple API call
    const balance = await stripe.balance.retrieve()
    console.log('Stripe connection successful, balance retrieved:', balance)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Connexion Stripe établie avec succès'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erreur lors du test de connexion Stripe:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Erreur de connexion à Stripe: ${error.message}` 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500,
      }
    )
  }
})