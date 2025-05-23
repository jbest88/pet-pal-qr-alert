
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
        console.error("No slug parameter found in URL");
        toast.error("Invalid QR code");
        navigate("/");
        return;
      }

      // Validate slug format - only allow alphanumeric characters
      if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
        console.error("Invalid slug format:", slug);
        toast.error("Invalid QR code format");
        navigate("/");
        return;
      }

      try {
        console.log(`QR Redirect: Looking up QR code with slug: ${slug}`);
        
        // First, let's verify the slug exists in our database
        const { data, error } = await supabase
          .from('qr_links')
          .select('pet_id')
          .eq('slug', slug)
          .maybeSingle();
        
        console.log("QR redirect query result:", { data, slug, error });

        if (error) {
          console.error("Database error finding QR link:", error);
          toast.error("Error processing QR code");
          navigate("/");
          return;
        }

        if (!data || !data.pet_id) {
          console.error("QR code not found for slug:", slug);
          toast.error("QR code not found");
          navigate("/");
          return;
        }

        console.log(`QR Redirect: Found pet ID for QR slug ${slug}: ${data.pet_id}`);

        // Redirect to pet profile page - this works for both logged-in and anonymous users
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
