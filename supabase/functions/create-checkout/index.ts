import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

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

    if (!firstName || !lastName || !email || !numberOfTickets) {
      throw new Error('Missing required fields')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    console.log('Creating payment session...')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
      success_url: `${req.headers.get('origin')}/thank-you`,
      cancel_url: `${req.headers.get('origin')}/reserver`,
      customer_email: email,
      locale: 'fr',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        firstName,
        lastName,
        email,
        numberOfTickets,
      },
    })
    
    console.log('Payment session created successfully:', session.id)
    console.log('Checkout URL:', session.url)

    if (!session.url) {
      throw new Error('No checkout URL returned from Stripe')
    }

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