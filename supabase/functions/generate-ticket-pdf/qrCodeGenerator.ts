import QRCode from 'https://cdn.skypack.dev/qrcode@1.5.1'
import { QRCodeData } from './types.ts'

export const generateQRCode = async (data: QRCodeData): Promise<string> => {
  console.log('Generating QR code with data:', data)
  
  const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(data), {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 300,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  })

  console.log('QR code generated successfully')
  return qrCodeDataUrl.split(',')[1]
}