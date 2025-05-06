
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const QRRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirectToScan = async () => {
      if (!slug) {
        toast.error("Invalid QR code");
        navigate("/");
        return;
      }

      try {
        console.log(`Looking up QR code with slug: ${slug}`);
        
        // Find the pet ID from the QR slug
        const { data, error } = await supabase
          .from('qr_links')
          .select('pet_id')
          .eq('slug', slug)
          .maybeSingle();

        if (error) {
          console.error("Error finding QR link:", error);
          toast.error("Error processing QR code");
          navigate("/");
          return;
        }

        if (!data) {
          console.error("QR code not found:", slug);
          toast.error("QR code not found");
          navigate("/");
          return;
        }

        console.log(`Found pet ID for QR slug ${slug}: ${data.pet_id}`);

        // Redirect to pet profile page instead of scan page
        navigate(`/pet/${data.pet_id}`);
      } catch (err) {
        console.error("Error in QR redirect:", err);
        toast.error("Failed to process QR code");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    redirectToScan();
  }, [slug, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to pet information...</p>
      </div>
    </div>
  );
};

export default QRRedirect;
