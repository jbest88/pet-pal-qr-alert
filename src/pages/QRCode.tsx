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
  // Renamed 'loading' from useAuth to 'authLoading' to distinguish from pet data fetching loading state
  const { user, loading: authLoading } = useAuth(); 
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  // Renamed 'isLoading' to 'isPetLoading' for clarity, default true to show loading initially
  const [isPetLoading, setIsPetLoading] = useState(true); 

  useEffect(() => {
    // If petId is not available in the URL, it's an invalid route.
    if (!petId) {
      toast.error("Pet ID is missing from the URL.");
      navigate("/"); // Or navigate to a dedicated 404 page
      setIsPetLoading(false); // Stop loading as we are navigating away or it's an error state
      return; 
    }

    // Start loading pet data
    setIsPetLoading(true);
    const fetchPetData = async () => {
      try {
        // Fetch pet data from Supabase.
        // IMPORTANT: Ensure your Supabase RLS policies for the 'pets' table
        // allow public read access for the necessary columns if this page
        // is to be viewed by unauthenticated users.
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', petId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching pet:", error);
          toast.error("Error loading pet data. Please try again or check if the pet exists.");
          setPet(null); // Triggers "Pet Information Unavailable" display
          return;
        }
        
        if (data) {
          const mappedPet = mapSupabasePet(data);
          setPet(mappedPet);
        } else {
          toast.error("Pet not found. The QR code link might be invalid or the pet profile was removed.");
          setPet(null); // Triggers "Pet Information Unavailable" display
        }
      } catch (err) {
        console.error("Unexpected error occurred while fetching pet:", err);
        toast.error("An unexpected error occurred. Please try again.");
        setPet(null); // Triggers "Pet Information Unavailable" display
      } finally {
        setIsPetLoading(false);
      }
    };
    
    fetchPetData();
  }, [petId, navigate]); // useEffect dependencies
  
  // Show loading spinner while pet data is being fetched
  if (isPetLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  // If pet is not found or an error occurred during fetch
  if (!pet) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pet Information Unavailable</h2>
          <p className="mb-6">We couldn't load the pet profile. The link may be invalid, the profile might have been removed, or there was a connection issue.</p>
          
          {/* Buttons displayed based on authentication status, after auth check is complete */}
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
          {/* While authLoading is true, no button is shown here, or you could add a placeholder. */}
        </div>
      </Layout>
    );
  }

  // Main content: Display QR code and pet information
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">{pet.name}'s QR Code</h1>
          <p className="text-gray-600 text-center mb-8">
            This page displays the QR code for {pet.name}. Owners can print this and attach it to their pet's collar.
          </p>
        </div>
        
        <div className="mb-8 flex justify-center">
          {/* The `data` prop for QRCodeGenerator:
              Original code uses `pet.id`. This might be an internal ID or part of a URL scheme.
              For a publicly scannable QR code leading to a webpage, this should typically be a full URL,
              e.g., `${window.location.origin}/found-pet/${pet.id}` or similar.
              This solution keeps `data={pet.id}` assuming `QRCodeGenerator` or your system handles this.
          */}
          <QRCodeGenerator data={pet.id} petName={pet.name} />
        </div>
        
        <div className="mb-8">
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Instructions for Pet Owner:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Download or take a screenshot of this QR code.</li>
              <li>Print it. For durability, consider laminating it or placing it in a waterproof pet tag holder.</li>
              <li>Attach it securely to {pet.name}'s collar or harness.</li>
              <li>Test the QR code by scanning it with a smartphone. Ensure it links to the correct information or service for {pet.name}.</li>
            </ol>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 items-center">
          {/* Button to view pet's profile. Assuming /pet/${pet.id} is publicly viewable
              or handles unauthenticated users appropriately (e.g., redirects to login if needed).
           */}
          <Button asChild variant="outline">
            <Link to={`/pet/${pet.id}`}>View {pet.name}'s Profile</Link>
          </Button>
          
          {/* Conditional buttons based on auth status */}
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
          {/* While authLoading, the second button spot will be empty.
              You could add a placeholder or disabled button if layout shift is a concern.
              e.g., authLoading && <Button disabled className="opacity-50">Loading...</Button> 
          */}
        </div>
      </div>
    </Layout>
  );
};

export default QRCodePage;