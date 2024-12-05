import QRCode from 'qrcode';

export const generateMeterQRCode = async (meterId: string): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(meterId);
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};