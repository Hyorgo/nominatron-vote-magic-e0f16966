import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@1.17.1'
import { TicketData, EventInfo } from './types.ts'

export const generatePDF = async (
  ticketData: TicketData,
  eventInfo: EventInfo,
  qrCodeImage: string,
  logoUrl?: string
): Promise<Uint8Array> => {
  console.log('Creating PDF document...')
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
  const { width, height } = page.getSize()

  // Embed logo if available
  if (logoUrl) {
    try {
      const logoResponse = await fetch(logoUrl)
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
    }
  }

  // Embed QR code
  try {
    const qrCodeImageBytes = Uint8Array.from(atob(qrCodeImage), c => c.charCodeAt(0))
    const qrCodePdfImage = await pdfDoc.embedPng(qrCodeImageBytes)
    const qrCodeSize = 200
    page.drawImage(qrCodePdfImage, {
      x: (width - qrCodeSize) / 2,
      y: height - 300,
      width: qrCodeSize,
      height: qrCodeSize,
    })
    console.log('QR code embedded successfully')
  } catch (error) {
    console.error('Error embedding QR code:', error)
    throw new Error('Failed to embed QR code in PDF')
  }

  // Add text content
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

  // Personal information
  page.drawText(`Nom: ${ticketData.lastName}`, {
    x: 50,
    y: height - 450,
    size: fontSize,
    font,
  })

  page.drawText(`Prénom: ${ticketData.firstName}`, {
    x: 50,
    y: height - 470,
    size: fontSize,
    font,
  })

  page.drawText(`Email: ${ticketData.email}`, {
    x: 50,
    y: height - 490,
    size: fontSize,
    font,
  })

  page.drawText(`Nombre de places: ${ticketData.numberOfTickets}`, {
    x: 50,
    y: height - 510,
    size: fontSize,
    font,
  })

  // Event information
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

  console.log('Generating final PDF bytes...')
  return await pdfDoc.save()
}