import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { encode as base64Encode } from "https://deno.land/std@0.190.0/encoding/base64.ts"
import { generateQRCode } from './qrCodeGenerator.ts'
import { generatePDF } from './pdfGenerator.ts'
import { TicketData, QRCodeData } from './types.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const ticketData: TicketData = await req.json()
    console.log('Generating PDF for:', ticketData)

    // Validate input data
    if (!ticketData.firstName || !ticketData.lastName || !ticketData.email || !ticketData.numberOfTickets) {
      throw new Error('Missing required ticket information')
    }

    // Create QR code data
    const qrData: QRCodeData = {
      ...ticketData,
      ticketId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      validationStatus: 'unused'
    }
    
    // Generate QR code
    const qrCodeImage = await generateQRCode(qrData)
    console.log('QR code generated successfully')

    // Get event information from Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching event information from database...')
    const { data: eventInfo, error } = await supabase
      .from('event_information')
      .select('*')
      .limit(1)
      .single()

    if (error || !eventInfo) {
      throw new Error('Event information not found')
    }

    // Get logo URL
    const { data: siteSettings } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_name', 'header_logo')
      .single()

    // Generate PDF
    const pdfBytes = await generatePDF(ticketData, eventInfo, qrCodeImage, siteSettings?.setting_value)
    console.log('PDF generated successfully, size:', pdfBytes.length, 'bytes')
    
    // Encode PDF to base64
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