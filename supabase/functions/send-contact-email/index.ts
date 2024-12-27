import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY')
const MAILJET_SECRET_KEY = Deno.env.get('MAILJET_SECRET_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactForm {
  name: string
  email: string
  message: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Début du traitement de la requête de contact')
    console.log('📝 Vérification des clés Mailjet:', {
      apiKeyExists: !!MAILJET_API_KEY,
      secretKeyExists: !!MAILJET_SECRET_KEY,
      apiKeyLength: MAILJET_API_KEY?.length,
      secretKeyLength: MAILJET_SECRET_KEY?.length
    })
    
    if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
      console.error('❌ Clés Mailjet manquantes')
      throw new Error('Configuration Mailjet manquante')
    }

    const { name, email, message } = await req.json() as ContactForm
    console.log('📨 Données reçues:', { name, email })

    const mailjetPayload = {
      Messages: [
        {
          From: {
            Email: "contact@ideai.fr",
            Name: "Lyon d'Or Contact"
          },
          To: [
            {
              Email: "contact@ideai.fr",
              Name: "Lyon d'Or"
            }
          ],
          Subject: "Nouveau message de contact",
          TextPart: `Nouveau message de ${name} (${email}):\n\n${message}`,
          HTMLPart: `
            <h3>Nouveau message de contact</h3>
            <p><strong>De:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        },
        {
          From: {
            Email: "contact@ideai.fr",
            Name: "Lyon d'Or"
          },
          To: [
            {
              Email: email,
              Name: name
            }
          ],
          Subject: "Confirmation de votre message - Lyon d'Or",
          TextPart: `Bonjour ${name},\n\nNous avons bien reçu votre message et nous vous en remercions. Notre équipe vous répondra dans les plus brefs délais.\n\nVotre message :\n${message}\n\nCordialement,\nL'équipe Lyon d'Or`,
          HTMLPart: `
            <h3>Confirmation de votre message</h3>
            <p>Bonjour ${name},</p>
            <p>Nous avons bien reçu votre message et nous vous en remercions. Notre équipe vous répondra dans les plus brefs délais.</p>
            <p><strong>Votre message :</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <p>Cordialement,<br>L'équipe Lyon d'Or</p>
          `
        }
      ]
    }

    console.log('📤 Tentative d\'envoi via Mailjet')
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)}`,
      },
      body: JSON.stringify(mailjetPayload)
    })

    const result = await response.json()
    console.log('📬 Réponse Mailjet:', result)

    if (!response.ok) {
      console.error('❌ Erreur Mailjet:', result)
      throw new Error(JSON.stringify(result))
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})