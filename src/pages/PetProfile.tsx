
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Pet, ScanEvent, mapSupabasePet, mapSupabaseScanEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { QrCode, AlertTriangle, Flag, FlagOff } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { glass } from "@/lib/utils";

// Import refactored components
import LostPetCard from "@/components/pet/LostPetCard";
import PetInfo from "@/components/pet/PetInfo";
import QRCodeStatus from "@/components/pet/QRCodeStatus";
import ScanHistory from "@/components/pet/ScanHistory";
import PetStatusDialogs from "@/components/pet/PetStatusDialogs";
import SocialShareButtons from "@/components/pet/SocialShareButtons";

const PetProfile = () => {
  const { petId } = useParams<{ petId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  
  // Dialog state
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [foundDialogOpen, setFoundDialogOpen] = useState(false);

  useEffect(() => {
    // Only proceed if we have petId
    if (petId) {
      console.log("Fetching pet data for:", petId);
      
      const fetchPetAndScans = async () => {
        try {
          // Fetch pet data
          const { data: petData, error: petError } = await supabase
            .from('pets')
            .select('*')
            .eq('id', petId)
            .maybeSingle();
            
          if (petError) {
            console.error("Error fetching pet:", petError);
            toast.error("Error loading pet data");
            navigate("/");
            return;
          }
          
          if (!petData) {
            console.log("Pet not found for id:", petId);
            toast.error("Pet not found");
            navigate("/");
            return;
          }
          
          const mappedPet = mapSupabasePet(petData);
          setPet(mappedPet);
          console.log("Pet found:", mappedPet.name);
          
          // Check if the current user is the owner
          if (user && mappedPet.ownerId === user.id) {
            setIsOwner(true);
            
            // Only fetch scan events if the user is the owner
            const { data: scanData, error: scanError } = await supabase
              .from('scan_events')
              .select('*')
              .eq('pet_id', petId)
              .order('created_at', { ascending: false });
              
            if (scanError) {
              console.error("Error fetching scan events:", scanError);
            } else if (scanData) {
              const mappedScans = scanData.map(mapSupabaseScanEvent);
              setScanEvents(mappedScans);
            }
          } else {
            setIsOwner(false);
          }
        } catch (err) {
          console.error("Error in data fetch:", err);
          toast.error("Failed to load data");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPetAndScans();
    }
  }, [petId, user, navigate]);

  const getPetInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  const handlePetStatusChange = (updatedPet: Pet) => {
    setPet(updatedPet);
  };

  if (isLoading) {
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
        <div className={`container mx-auto px-4 py-8 text-center ${glass} rounded-lg`}>
          <h2 className="text-2xl font-bold mb-4">Pet Not Found</h2>
          <p className="mb-6">The pet profile you're looking for doesn't exist.</p>
          <Button asChild className={glass}>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className={`mb-6 flex flex-col md:flex-row md:justify-between md:items-center ${pet.isLost ? "bg-amber-50/70 backdrop-blur-sm p-4 rounded-lg border-2 border-amber-500" : `${glass} p-4 rounded-lg`}`}>
          <div className="flex items-center gap-4">
            <Avatar className={`h-20 w-20 ${pet.isLost ? "border-2 border-amber-500" : "border-2 border-primary"}`}>
              {pet.imageUrl ? (
                <AvatarImage src={pet.imageUrl} alt={pet.name} />
              ) : (
                <AvatarFallback>{getPetInitials(pet.name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {pet.name}'s Profile
                {pet.isLost && (
                  <span className="text-amber-600 text-sm font-normal bg-amber-100/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Lost
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
                {pet.breed ? ` · ${pet.breed}` : ""}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Button asChild variant="outline" className={`${glass} text-black`}>
              <Link to="/">
                Back Home
              </Link>
            </Button>
            {isOwner && (
              <>
                <Button asChild className={`${glass} text-black`}>
                  <Link to={`/qr-code/${pet.id}`}>
                    <QrCode className="mr-2 h-4 w-4" /> QR Code
                  </Link>
                </Button>
                {pet.isLost ? (
                  <Button 
                    variant="default"
                    onClick={() => setFoundDialogOpen(true)}
                    className={`bg-green-600 hover:bg-green-700 ${glass} flex items-center gap-2 text-black`}
                  >
                    <FlagOff className="h-4 w-4" />
                    Mark as Found
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    onClick={() => setLostDialogOpen(true)}
                    className={`flex items-center gap-2 ${glass} text-black`}
                  >
                    <Flag className="h-4 w-4" />
                    Mark as Lost
                  </Button>
                )}
              </>
            )}
            {user && !isOwner && (
              <Button asChild className={`${glass} text-black`}>
                <Link to="/dashboard">
                  My Dashboard
                </Link>
              </Button>
            )}
            {!user && (
              <>
                <Button asChild className={`${glass} text-black`}>
                  <Link to={`/scan/${pet.id}`}>
                    I've Found This Pet
                  </Link>
                </Button>
                <Button asChild variant="outline" className={`${glass} text-black`}>
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Lost Pet Information */}
        <LostPetCard pet={pet} />
        
        {/* Social Share Buttons - Add for lost pets */}
        {pet.isLost && isOwner && (
          <div className="my-4">
            <SocialShareButtons pet={pet} />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {pet.imageUrl && (
              <div className={`mb-6 overflow-hidden rounded-lg shadow-sm ${glass}`}>
                <div className="aspect-video w-full">
                  <img 
                    src={pet.imageUrl} 
                    alt={pet.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Pet Information */}
            <PetInfo pet={pet} />
          </div>
          
          <div>
            {/* QR Code Status - Show for both owner and anonymous users */}
            <QRCodeStatus petId={pet.id} />

            {!user && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-medium mb-2">Found this pet?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you've found {pet.name}, please scan the QR code on their collar or click the button below to report their location.
                </p>
                <Button asChild variant="outline">
                  <Link to={`/scan/${pet.id}`}>
                    I've Found This Pet
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {isOwner && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Scan History</h2>
            
            {/* Scan History */}
            <ScanHistory scanEvents={scanEvents} petName={pet.name} />
          </div>
        )}
      </div>
      
      {/* Pet Status Dialogs */}
      {isOwner && (
        <PetStatusDialogs 
          pet={pet}
          onPetStatusChange={handlePetStatusChange}
          lostDialogOpen={lostDialogOpen}
          setLostDialogOpen={setLostDialogOpen}
          foundDialogOpen={foundDialogOpen}
          setFoundDialogOpen={setFoundDialogOpen}
        />
      )}
    </Layout>
  );
};

export default PetProfile;
