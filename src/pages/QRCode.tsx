
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Pet } from "@/types";
import { Button } from "@/components/ui/button";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabasePet } from "@/types";

const QRCodePage = () => {
  const { petId } = useParams<{ petId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First check authentication
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }
    
    // Only proceed if we have both user and petId
    if (petId && user && !loading) {
      console.log("Fetching pet data for:", petId);
      const fetchPet = async () => {
        try {
          const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('id', petId)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching pet:", error);
            toast.error("Error loading pet data");
            navigate("/dashboard");
            return;
          }
          
          if (data) {
            const mappedPet = mapSupabasePet(data);
            console.log("Pet found:", mappedPet.name);
            setPet(mappedPet);
          } else {
            console.log("Pet not found for id:", petId);
            toast.error("Pet not found");
            navigate("/dashboard");
          }
        } catch (err) {
          console.error("Error in pet fetch:", err);
          toast.error("Failed to load pet data");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPet();
    }
  }, [petId, user, loading, navigate]);
  
  if (loading || isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pet Not Found</h2>
          <p className="mb-6">The pet profile you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Use pet.id as the QR code data
  const qrCodeData = pet.id;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">{pet.name}'s QR Code</h1>
          <p className="text-gray-600 text-center mb-8">
            Print this QR code and attach it to {pet.name}'s collar
          </p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <QRCodeGenerator data={qrCodeData} petName={pet.name} />
        </div>
        
        <div className="mb-8">
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Download and print this QR code</li>
              <li>Cut it out and laminate it or place it in a waterproof holder</li>
              <li>Attach it securely to {pet.name}'s collar</li>
              <li>Test the code by scanning it with your phone's camera</li>
            </ol>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link to={`/pet/${pet.id}`}>Back to {pet.name}'s Profile</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default QRCodePage;
