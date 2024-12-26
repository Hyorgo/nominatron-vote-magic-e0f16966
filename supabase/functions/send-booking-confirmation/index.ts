import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

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
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const bookingInfo: BookingInfo = await req.json()
    console.log('Sending confirmation email for booking:', bookingInfo)

    const emailHtml = `
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

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Trophées <contact@lyon-dor.fr>',
        to: [bookingInfo.email],
        subject: 'Confirmation de votre réservation - Trophées',
        html: emailHtml,
      }),
    })

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`)
    }

    const data = await res.json()
    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify(data), {
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