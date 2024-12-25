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

    // Create QR code data
    const qrData = JSON.stringify({
      firstName,
      lastName,
      email,
      numberOfTickets,
      paymentStatus: 'success'
    })
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(qrData)
    const qrCodeImage = qrCodeDataUrl.split(',')[1]

    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
    const { width, height } = page.getSize()
    
    // Get logo from Supabase storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get event information
    const { data: eventInfo } = await supabase
      .from('event_information')
      .select('*')
      .limit(1)
      .single()

    // Get logo URL from site settings
    const { data: siteSettings } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_name', 'header_logo')
      .single()

    if (siteSettings?.setting_value) {
      const logoResponse = await fetch(siteSettings.setting_value)
      const logoArrayBuffer = await logoResponse.arrayBuffer()
      const logoImage = await pdfDoc.embedPng(new Uint8Array(logoArrayBuffer))
      const logoDims = logoImage.scale(0.5) // Scale logo to 50%
      page.drawImage(logoImage, {
        x: (width - logoDims.width) / 2,
        y: height - logoDims.height - 50,
        width: logoDims.width,
        height: logoDims.height,
      })
    }

    // Add QR code
    const qrCodeImageBytes = Uint8Array.from(atob(qrCodeImage), c => c.charCodeAt(0))
    const qrCodePdfImage = await pdfDoc.embedPng(qrCodeImageBytes)
    const qrCodeDims = qrCodePdfImage.scale(0.5)
    page.drawImage(qrCodePdfImage, {
      x: (width - qrCodeDims.width) / 2,
      y: height - 300,
      width: qrCodeDims.width,
      height: qrCodeDims.height,
    })

    // Add text
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12
    
    // Informations personnelles
    page.drawText('Informations de réservation', {
      x: 50,
      y: height - 400,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    })

    page.drawText(`Nom: ${lastName}`, {
      x: 50,
      y: height - 430,
      size: fontSize,
      font,
    })

    page.drawText(`Prénom: ${firstName}`, {
      x: 50,
      y: height - 450,
      size: fontSize,
      font,
    })

    page.drawText(`Email: ${email}`, {
      x: 50,
      y: height - 470,
      size: fontSize,
      font,
    })

    page.drawText(`Nombre de places: ${numberOfTickets}`, {
      x: 50,
      y: height - 490,
      size: fontSize,
      font,
    })

    // Informations de l'événement
    if (eventInfo) {
      page.drawText('Informations de l\'événement', {
        x: 50,
        y: height - 530,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      })

      const eventDate = new Date(eventInfo.event_date)
      const formattedDate = eventDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      page.drawText(`Date: ${formattedDate}`, {
        x: 50,
        y: height - 560,
        size: fontSize,
        font,
      })

      page.drawText(`Lieu: ${eventInfo.location}`, {
        x: 50,
        y: height - 580,
        size: fontSize,
        font,
      })

      page.drawText(`Adresse: ${eventInfo.address}`, {
        x: 50,
        y: height - 600,
        size: fontSize,
        font,
      })
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()
    
    // Encode PDF bytes to base64
    const base64Pdf = base64Encode(pdfBytes)

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