
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QRCodeGeneratorProps {
  data: string;
  petName: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data, petName }) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        // Create the full URL for the QR code to scan
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/scan/${data}`;
        
        const url = await QRCode.toDataURL(fullUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#334155",
            light: "#FFFFFF",
          },
        });
        setQrUrl(url);
      } catch (err) {
        console.error("Error generating QR code:", err);
        toast.error("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [data]);

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.download = `${petName.toLowerCase().replace(/\s+/g, "-")}-qrcode.png`;
    link.href = qrUrl;
    link.click();
    toast.success("QR Code downloaded!");
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-semibold">QR Code for {petName}</h3>
      {loading ? (
        <div className="h-[300px] w-[300px] bg-gray-100 animate-pulse flex items-center justify-center">
          <span>Generating...</span>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-md shadow-sm">
          <img src={qrUrl} alt={`QR code for ${petName}`} className="w-64 h-64" />
        </div>
      )}
      <p className="text-sm text-gray-500 max-w-xs text-center">
        Print this QR code and attach it to {petName}'s collar. Anyone who finds {petName} can scan this to contact you.
      </p>
      <Button 
        onClick={downloadQRCode} 
        disabled={loading}
        className="mt-4"
      >
        Download QR Code
      </Button>
    </div>
  );
};

export default QRCodeGenerator;
