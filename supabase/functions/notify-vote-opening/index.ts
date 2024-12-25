import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY')
const MAILJET_SECRET_KEY = Deno.env.get('MAILJET_SECRET_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  email: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json() as EmailRequest

    console.log(`Sending confirmation email to ${email}`)

    const mailjetData = {
      Messages: [
        {
          From: {
            Email: "noreply@votredomaine.com",
            Name: "Système de Vote"
          },
          To: [
            {
              Email: email,
            }
          ],
          Subject: "Confirmation de notification pour l'ouverture des votes",
          TextPart: `Bonjour,\n\nNous avons bien enregistré votre demande de notification pour l'ouverture des votes.\nVous recevrez un email dès que les votes seront ouverts.\n\nCordialement,\nL'équipe de vote`,
          HTMLPart: `
            <h3>Confirmation de votre inscription</h3>
            <p>Bonjour,</p>
            <p>Nous avons bien enregistré votre demande de notification pour l'ouverture des votes.</p>
            <p>Vous recevrez un email dès que les votes seront ouverts.</p>
            <p>Cordialement,<br>L'équipe de vote</p>
          `
        }
      ]
    }

    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)}`
      },
      body: JSON.stringify(mailjetData)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Mailjet API error:', error)
      throw new Error('Failed to send email')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in notify-vote-opening function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})