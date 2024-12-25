import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { firstName, lastName, email, numberOfTickets } = await req.json()
    console.log('Received request data:', { firstName, lastName, email, numberOfTickets })

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    console.log('Creating payment session with price ID: price_1QZGfwAU4Uv1i5TAJHGKvvKx')
    const sessionConfig = {
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: 'price_1QZGfwAU4Uv1i5TAJHGKvvKx',
          quantity: numberOfTickets,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/thank-you`,
      cancel_url: `${req.headers.get('origin')}/reserver`,
      metadata: {
        firstName,
        lastName,
        email,
        numberOfTickets,
      },
      locale: 'fr',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    }
    
    console.log('Session configuration:', sessionConfig)
    const session = await stripe.checkout.sessions.create(sessionConfig)
    console.log('Payment session created successfully:', session.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Detailed error:', error)
    console.error('Error stack:', error.stack)
    console.error('Stripe error details:', error.raw || error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.raw || error 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})