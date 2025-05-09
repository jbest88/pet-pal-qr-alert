
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
  const { user, loading: authLoading } = useAuth(); 
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isPetLoading, setIsPetLoading] = useState(true); 
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!petId) {
      toast.error("Pet ID is missing from the URL.");
      navigate("/");
      setIsPetLoading(false);
      return; 
    }

    setIsPetLoading(true);
    const fetchPetData = async () => {
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', petId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching pet:", error);
          toast.error("Error loading pet data. Please try again or check if the pet exists.");
          setPet(null);
          return;
        }
        
        if (data) {
          const mappedPet = mapSupabasePet(data);
          setPet(mappedPet);
          
          // Check if current user is the owner
          setIsOwner(user && user.id === mappedPet.owner_id);
        } else {
          toast.error("Pet not found. The QR code link might be invalid or the pet profile was removed.");
          setPet(null);
        }
      } catch (err) {
        console.error("Unexpected error occurred while fetching pet:", err);
        toast.error("An unexpected error occurred. Please try again.");
        setPet(null);
      } finally {
        setIsPetLoading(false);
      }
    };
    
    fetchPetData();
  }, [petId, navigate, user]);
  
  if (isPetLoading) {
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
          <h2 className="text-2xl font-bold mb-4">Pet Information Unavailable</h2>
          <p className="mb-6">We couldn't load the pet profile. The link may be invalid, the profile might have been removed, or there was a connection issue.</p>
          
          {!authLoading && user && (
            <Button asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          )}
          {!authLoading && !user && (
            <Button asChild>
              <Link to="/">Go to Homepage</Link>
            </Button>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">{pet.name}'s QR Code</h1>
          <p className="text-gray-600 text-center mb-8">
            {isOwner ? 
              `This page displays the QR code for ${pet.name}. You can print this and attach it to your pet's collar.` :
              `This QR code helps people contact the owner if ${pet.name} is found.`
            }
          </p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <QRCodeGenerator data={pet.id} petName={pet.name} />
        </div>
        
        {isOwner && (
          <div className="mb-8">
            <div className="bg-primary/10 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Instructions for Pet Owner:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Download or take a screenshot of this QR code.</li>
                <li>Print it. For durability, consider laminating it or placing it in a waterproof pet tag holder.</li>
                <li>Attach it securely to {pet.name}'s collar or harness.</li>
                <li>Test the QR code by scanning it with a smartphone. Ensure it links to the correct information.</li>
              </ol>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 items-center">
          <Button asChild variant="outline">
            <Link to={`/pet/${pet.id}`}>View {pet.name}'s Profile</Link>
          </Button>
          
          {!authLoading && user && (
            <Button asChild>
              <Link to="/dashboard">My Dashboard</Link>
            </Button>
          )}
          {!authLoading && !user && (
            <Button asChild>
              <Link to="/login">Login or Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QRCodePage;
