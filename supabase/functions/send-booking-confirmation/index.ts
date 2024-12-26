import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY')
const MAILJET_SECRET_KEY = Deno.env.get('MAILJET_SECRET_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingInfo {
  firstName: string
  lastName: string
  email: string
  numberOfTickets: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const bookingInfo: BookingInfo = await req.json()
    console.log('Sending confirmation email for booking:', bookingInfo)

    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)}`,
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: "contact@lyon-dor.fr",
              Name: "Lyon d'Or"
            },
            To: [
              {
                Email: bookingInfo.email,
                Name: `${bookingInfo.firstName} ${bookingInfo.lastName}`
              }
            ],
            Subject: "Confirmation de votre réservation - Trophées",
            HTMLPart: `
              <h1>Confirmation de votre réservation</h1>
              <p>Bonjour ${bookingInfo.firstName} ${bookingInfo.lastName},</p>
              <p>Nous vous confirmons votre réservation pour la soirée des Trophées.</p>
              <p>Détails de la réservation :</p>
              <ul>
                <li>Nombre de billets : ${bookingInfo.numberOfTickets}</li>
                <li>Prix total : ${(bookingInfo.numberOfTickets * 192).toFixed(2)}€</li>
              </ul>
              <p>Nous avons hâte de vous accueillir !</p>
              <p>Cordialement,<br>L'équipe des Trophées</p>
            `
          }
        ]
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(JSON.stringify(result))
    }

    console.log('Email sent successfully:', result)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})