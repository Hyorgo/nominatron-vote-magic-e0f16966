import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    })
  }

  try {
    const { firstName, lastName, email, numberOfTickets } = await req.json()
    console.log('Received request data:', { firstName, lastName, email, numberOfTickets })

    if (!firstName || !lastName || !email || !numberOfTickets) {
      throw new Error('Missing required fields')
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not found in environment variables')
      throw new Error('STRIPE_SECRET_KEY not configured')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }
    const supabase = createClient(supabaseUrl, supabaseKey)

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    console.log('Creating payment session...')
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Billet pour l\'événement',
              description: `Réservation pour ${numberOfTickets} personne${numberOfTickets > 1 ? 's' : ''}`,
            },
            unit_amount: 19200,
          },
          quantity: numberOfTickets,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-status?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment-status?status=cancel`,
      customer_email: email,
      metadata: {
        firstName,
        lastName,
        numberOfTickets: numberOfTickets.toString(),
      },
      locale: 'fr',
    })
    
    console.log('Session created successfully:', session.id)

    // Enregistrer la transaction dans la base de données
    const { error: transactionError } = await supabase
      .from('stripe_transactions')
      .insert({
        email: email,
        amount: 19200 * numberOfTickets,
        status: 'pending',
      })

    if (transactionError) {
      console.error('Error storing transaction:', transactionError)
    }

    // Enregistrer la réservation dans la base de données
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        number_of_tickets: numberOfTickets,
      })

    if (bookingError) {
      console.error('Error storing booking:', bookingError)
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
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