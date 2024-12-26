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
  sessionId: string
  status: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const bookingInfo: BookingInfo = await req.json()
    console.log('Sending confirmation email for booking:', bookingInfo)

    if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
      throw new Error('Missing Mailjet configuration')
    }

    console.log('Preparing email data...')
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
            Subject: "Confirmation de votre réservation - Trophées Lyon d'Or",
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #D4AF37; text-align: center;">Confirmation de votre réservation</h1>
                <p>Bonjour ${bookingInfo.firstName} ${bookingInfo.lastName},</p>
                <p>Nous vous confirmons votre réservation pour la soirée des Trophées Lyon d'Or.</p>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <h2 style="color: #D4AF37; margin-top: 0;">Détails de la réservation :</h2>
                  <ul style="list-style: none; padding: 0;">
                    <li>Nombre de billets : ${bookingInfo.numberOfTickets}</li>
                    <li>Prix total : ${(bookingInfo.numberOfTickets * 192).toFixed(2)}€</li>
                    <li>Numéro de transaction : ${bookingInfo.sessionId}</li>
                    <li>Statut : Confirmé</li>
                  </ul>
                </div>
                <p>Nous avons hâte de vous accueillir !</p>
                <p style="margin-top: 30px;">Cordialement,<br>L'équipe des Trophées Lyon d'Or</p>
              </div>
            `
          }
        ]
      })
    })

    const result = await response.json()
    console.log('Mailjet API response:', result)

    if (!response.ok) {
      console.error('Error from Mailjet:', result)
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
      status: 500,
    })
  }
})