
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { buildQRCodeUrl, getQRLinkForPet } from "@/lib/qrUtils";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

interface QRCodeGeneratorProps {
  data: string;
  petName: string;
  onRegenerate?: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data: petId, petName, onRegenerate }) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const generateQRCode = async (qrSlug: string) => {
    if (!qrSlug) {
      console.error("No slug provided for QR code generation");
      setError("Missing data for QR code generation");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Ensure we're using a complete, absolute URL for the QR code
      const fullUrl = buildQRCodeUrl(qrSlug);
      
      console.log(`🔍 QR Code slug: ${qrSlug} for pet ID: ${petId}`);
      console.log("🔄 Generating QR code for URL:", fullUrl);
      setDebugInfo(`QR code points to: ${fullUrl} (Pet ID: ${petId})`);
      
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
      console.log("✅ QR code generated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Error generating QR code:", err);
      setError(`Failed to generate QR code: ${errorMessage}`);
      toast.error("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrCreateQRLink = async () => {
      try {
        // Get or create QR link using our utility function
        const qrSlug = await getQRLinkForPet(petId);
        setSlug(qrSlug);
        await generateQRCode(qrSlug);
      } catch (err) {
        console.error("Error setting up QR link:", err);
        setError("Failed to set up QR link");
        toast.error("Failed to set up QR link");
        setLoading(false);
      }
    };

    fetchOrCreateQRLink();
  }, [petId]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      setError(null);
      
      // Generate a new slug for the pet's QR code
      const newSlug = nanoid(10);
      console.log(`Regenerating QR code with new slug: ${newSlug} for pet: ${petId}`);
      
      // Update the QR link in the database
      const { error } = await supabase
        .from('qr_links')
        .update({ slug: newSlug })
        .eq('pet_id', petId);
      
      if (error) {
        console.error("Error updating QR link in database:", error);
        throw error;
      }
      
      console.log(`Successfully updated QR link in database for pet ${petId}`);
      setSlug(newSlug);
      await generateQRCode(newSlug);
      toast.success("QR code has been regenerated");
      
      if (onRegenerate) {
        onRegenerate();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error regenerating QR link:", err);
      setError(`Failed to regenerate QR code: ${errorMessage}`);
      toast.error("Failed to regenerate QR code");
    } finally {
      setRegenerating(false);
    }
  };

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
      console.error("❌ Error downloading QR code:", err);
      toast.error("Failed to download QR code");
    }
  };

  const testQRCode = () => {
    if (!slug) {
      toast.error("QR link not available for testing");
      return;
    }
    
    const fullUrl = buildQRCodeUrl(slug);
    console.log("🧪 Testing QR code with URL:", fullUrl);
    window.open(fullUrl, '_blank');
    toast.success("Opening scan page in new tab for testing");
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

      {debugInfo && (
        <Alert className="max-w-xs text-xs bg-gray-50 border-gray-200">
          <AlertTitle className="text-sm">QR Code Information</AlertTitle>
          <AlertDescription className="break-words">{debugInfo}</AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-gray-500 max-w-xs text-center">
        Print this QR code and attach it to {petName}'s collar. Anyone who finds {petName} can scan this to contact you.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button 
          onClick={downloadQRCode} 
          disabled={loading || !qrUrl}
          className="flex-1 text-black"
        >
          Download QR Code
        </Button>
        
        <Button
          onClick={testQRCode}
          disabled={loading || !qrUrl}
          variant="outline"
          className="flex-1 text-black"
        >
          Test QR Code
        </Button>
      </div>
      
      <Button
        onClick={handleRegenerate}
        disabled={loading || regenerating}
        variant="secondary"
        className="w-full text-black"
      >
        {regenerating ? "Regenerating..." : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" /> Regenerate QR Code
          </>
        )}
      </Button>
      
      <div className="text-xs text-gray-500 italic mt-2 text-center">
        Note: Old printed QR codes will still work even after regeneration.
      </div>
    </div>
  );
};

export default QRCodeGenerator;
