import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

interface BookingInfo {
  firstName: string
  lastName: string
  email: string
  numberOfTickets: number
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY')
const MAILJET_SECRET_KEY = Deno.env.get('MAILJET_SECRET_KEY')

const createEmailTemplate = (bookingInfo: BookingInfo) => ({
  Messages: [{
    From: {
      Email: "no-reply@lovable.com",
      Name: "Lovable Events"
    },
    To: [{
      Email: bookingInfo.email,
      Name: `${bookingInfo.firstName} ${bookingInfo.lastName}`
    }],
    Subject: "Confirmation de votre réservation",
    TextPart: `Bonjour ${bookingInfo.firstName},\n\nNous vous confirmons votre réservation pour ${bookingInfo.numberOfTickets} place(s).\n\nCordialement,\nL'équipe Lovable Events`,
    HTMLPart: `
      <h3>Confirmation de réservation</h3>
      <p>Bonjour ${bookingInfo.firstName},</p>
      <p>Nous vous confirmons votre réservation pour <strong>${bookingInfo.numberOfTickets} place(s)</strong>.</p>
      <p>Détails de la réservation :</p>
      <ul>
        <li>Nom : ${bookingInfo.lastName}</li>
        <li>Prénom : ${bookingInfo.firstName}</li>
        <li>Email : ${bookingInfo.email}</li>
        <li>Nombre de places : ${bookingInfo.numberOfTickets}</li>
      </ul>
      <p>Cordialement,<br>L'équipe Lovable Events</p>
    `
  }]
})

const sendMailjetEmail = async (emailData: any) => {
  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)}`
    },
    body: JSON.stringify(emailData)
  })

  const responseData = await response.json()
  
  if (!response.ok) {
    throw new Error(`Erreur Mailjet: ${JSON.stringify(responseData)}`)
  }

  return responseData
}

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Vérification des clés API
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
    console.error('Configuration Mailjet manquante')
    return new Response(
      JSON.stringify({ error: 'Configuration Mailjet manquante' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    const bookingInfo: BookingInfo = await req.json()
    console.log('Traitement de la réservation pour:', bookingInfo.email)

    const emailData = createEmailTemplate(bookingInfo)
    const result = await sendMailjetEmail(emailData)

    console.log('Email envoyé avec succès à:', bookingInfo.email)
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : 'Erreur inconnue'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})