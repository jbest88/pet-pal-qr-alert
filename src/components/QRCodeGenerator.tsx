
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!data) {
        console.error("No data provided for QR code generation");
        setError("Missing data for QR code generation");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Force a clean, absolute URL for the QR code
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/scan/${data}`;
        
        console.log("Generating QR code for URL:", fullUrl);
        
        const url = await QRCode.toDataURL(fullUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#334155",
            light: "#FFFFFF",
          },
        });
        
        if (!url) {
          throw new Error("QR code generation failed - empty URL returned");
        }
        
        setQrUrl(url);
        console.log("QR code generated successfully");
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code");
        toast.error("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [data]);

  const downloadQRCode = () => {
    if (!qrUrl) {
      toast.error("QR Code not available for download");
      return;
    }
    
    try {
      const link = document.createElement("a");
      link.download = `${petName.toLowerCase().replace(/\s+/g, "-")}-qrcode.png`;
      link.href = qrUrl;
      document.body.appendChild(link); // Append to body (important for Firefox)
      link.click();
      document.body.removeChild(link); // Clean up
      toast.success("QR Code downloaded!");
    } catch (err) {
      console.error("Error downloading QR code:", err);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-semibold">QR Code for {petName}</h3>
      {loading ? (
        <div className="h-[300px] w-[300px] bg-gray-100 animate-pulse flex items-center justify-center">
          <span>Generating...</span>
        </div>
      ) : error ? (
        <div className="h-[300px] w-[300px] bg-red-100 flex items-center justify-center text-red-600 p-4 text-center">
          {error}
        </div>
      ) : qrUrl ? (
        <div className="p-4 bg-white rounded-md shadow-sm">
          <img src={qrUrl} alt={`QR code for ${petName}`} className="w-64 h-64" />
        </div>
      ) : (
        <div className="h-[300px] w-[300px] bg-red-100 flex items-center justify-center text-red-600 p-4 text-center">
          Unable to generate QR code
        </div>
      )}
      <p className="text-sm text-gray-500 max-w-xs text-center">
        Print this QR code and attach it to {petName}'s collar. Anyone who finds {petName} can scan this to contact you.
      </p>
      <Button 
        onClick={downloadQRCode} 
        disabled={loading || !qrUrl}
        className="mt-4"
      >
        Download QR Code
      </Button>
    </div>
  );
};

export default QRCodeGenerator;
