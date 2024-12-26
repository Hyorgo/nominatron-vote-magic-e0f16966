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
  // Vérification initiale des clés API
  console.log('Vérification des clés API Mailjet...')
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
    console.error('Clés API Mailjet manquantes')
    return new Response(
      JSON.stringify({ error: 'Configuration Mailjet manquante' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
  console.log('Clés API Mailjet présentes')

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const bookingInfo: BookingInfo = await req.json()
    console.log('Informations de réservation reçues:', bookingInfo)

    console.log('Préparation du corps de l\'email...')
    const emailData = {
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
    }

    console.log('Envoi de la requête à Mailjet...')
    console.log('URL de l\'API Mailjet:', 'https://api.mailjet.com/v3.1/send')
    console.log('Authentification utilisée:', `${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)
    
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)}`
      },
      body: JSON.stringify(emailData)
    })

    console.log('Statut de la réponse Mailjet:', response.status)
    const responseData = await response.json()
    console.log('Réponse complète de Mailjet:', responseData)

    if (!response.ok) {
      throw new Error(`Erreur Mailjet: ${JSON.stringify(responseData)}`)
    }

    console.log('Email envoyé avec succès')
    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erreur détaillée:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})