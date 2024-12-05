import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { generateMeterQRCode } from '@/utils/qrCodeGenerator';

interface QRCodeDisplayProps {
  meterId: string;
}

export const QRCodeDisplay = ({ meterId }: QRCodeDisplayProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await generateMeterQRCode(meterId);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    };

    generateQR();
  }, [meterId]);

  if (!qrCodeUrl) {
    return <div>Generating QR code...</div>;
  }

  return (
    <Card className="p-4">
      <img src={qrCodeUrl} alt="Meter QR Code" className="mx-auto" />
    </Card>
  );
};