import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@1.17.1'
import QRCode from 'https://cdn.skypack.dev/qrcode@1.5.1'
import { encode as base64Encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

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
    console.log('Generating PDF for:', { firstName, lastName, email, numberOfTickets })

    // Create QR code data with a unique identifier
    const qrData = JSON.stringify({
      ticketId: crypto.randomUUID(), // Add a unique identifier
      firstName,
      lastName,
      email,
      numberOfTickets,
      timestamp: new Date().toISOString(),
      validationStatus: 'unused' // Add a validation status
    })
    
    console.log('Generating QR code with data:', qrData)
    
    // Generate QR code with higher error correction
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H', // Highest error correction level
      margin: 2,
      width: 300, // Larger size for better scanning
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    const qrCodeImage = qrCodeDataUrl.split(',')[1]

    console.log('QR code generated successfully')

    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
    const { width, height } = page.getSize()
    
    // Get event information from Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching event information from database...')

    const { data: eventInfo } = await supabase
      .from('event_information')
      .select('*')
      .limit(1)
      .single()

    if (!eventInfo) {
      throw new Error('Event information not found')
    }

    console.log('Event information retrieved successfully')

    // Get logo URL from site settings
    const { data: siteSettings } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_name', 'header_logo')
      .single()

    console.log('Logo URL retrieved:', siteSettings?.setting_value)

    if (siteSettings?.setting_value) {
      try {
        const logoResponse = await fetch(siteSettings.setting_value)
        const logoArrayBuffer = await logoResponse.arrayBuffer()
        const logoImage = await pdfDoc.embedPng(new Uint8Array(logoArrayBuffer))
        const logoDims = logoImage.scale(0.5)
        page.drawImage(logoImage, {
          x: (width - logoDims.width) / 2,
          y: height - logoDims.height - 50,
          width: logoDims.width,
          height: logoDims.height,
        })
        console.log('Logo embedded successfully')
      } catch (error) {
        console.error('Error embedding logo:', error)
        // Continue without logo if there's an error
      }
    }

    // Add QR code with better positioning and size
    try {
      const qrCodeImageBytes = Uint8Array.from(atob(qrCodeImage), c => c.charCodeAt(0))
      const qrCodePdfImage = await pdfDoc.embedPng(qrCodeImageBytes)
      const qrCodeSize = 200 // Larger size for better scanning
      page.drawImage(qrCodePdfImage, {
        x: (width - qrCodeSize) / 2,
        y: height - 300,
        width: qrCodeSize,
        height: qrCodeSize,
      })

      // Add QR code instructions
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      page.drawText('Scannez ce QR code pour valider votre billet', {
        x: (width - 250) / 2,
        y: height - 320,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      })
      
      console.log('QR code embedded successfully with instructions')
    } catch (error) {
      console.error('Error embedding QR code:', error)
      throw new Error('Failed to embed QR code in PDF')
    }

    // Add text
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontSize = 12
    
    // Title
    page.drawText('BILLET D\'ENTRÉE', {
      x: 50,
      y: height - 400,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    })

    // Informations personnelles
    page.drawText(`Nom: ${lastName}`, {
      x: 50,
      y: height - 450,
      size: fontSize,
      font,
    })

    page.drawText(`Prénom: ${firstName}`, {
      x: 50,
      y: height - 470,
      size: fontSize,
      font,
    })

    page.drawText(`Email: ${email}`, {
      x: 50,
      y: height - 490,
      size: fontSize,
      font,
    })

    page.drawText(`Nombre de places: ${numberOfTickets}`, {
      x: 50,
      y: height - 510,
      size: fontSize,
      font,
    })

    // Informations de l'événement
    if (eventInfo) {
      const eventDate = new Date(eventInfo.event_date)
      const formattedDate = eventDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      page.drawText('Informations de l\'événement', {
        x: 50,
        y: height - 550,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      })

      page.drawText(`Date: ${formattedDate}`, {
        x: 50,
        y: height - 580,
        size: fontSize,
        font,
      })

      page.drawText(`Lieu: ${eventInfo.location}`, {
        x: 50,
        y: height - 600,
        size: fontSize,
        font,
      })

      page.drawText(`Adresse: ${eventInfo.address}`, {
        x: 50,
        y: height - 620,
        size: fontSize,
        font,
      })
    }

    console.log('Generating final PDF bytes...')
    const pdfBytes = await pdfDoc.save()
    console.log('PDF generated successfully, size:', pdfBytes.length, 'bytes')
    
    // Encode PDF bytes to base64
    const base64Pdf = base64Encode(pdfBytes)
    console.log('PDF encoded to base64 successfully')

    return new Response(
      JSON.stringify(base64Pdf),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error generating PDF:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
