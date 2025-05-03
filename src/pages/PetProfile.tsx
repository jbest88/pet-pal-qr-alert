import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Pet, ScanEvent, mapSupabasePet, mapSupabaseScanEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, MapPin, Clock, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PetProfile = () => {
  const { petId } = useParams<{ petId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  
  // Lost pet dialog state
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [markingAsLost, setMarkingAsLost] = useState(false);
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  
  // Found pet dialog state
  const [foundDialogOpen, setFoundDialogOpen] = useState(false);
  const [markingAsFound, setMarkingAsFound] = useState(false);

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
            navigate("/dashboard");
            return;
          }
          
          if (!petData) {
            console.log("Pet not found for id:", petId);
            toast.error("Pet not found");
            navigate("/dashboard");
            return;
          }
          
          const mappedPet = mapSupabasePet(petData);
          setPet(mappedPet);
          console.log("Pet found:", mappedPet.name);
          
          // Check if the current user is the owner
          if (user && mappedPet.ownerId === user.id) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
          
          // Fetch scan events
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
  
  const formatDate = (dateString: string | number) => {
    try {
      const date = typeof dateString === 'number' 
        ? new Date(dateString) 
        : new Date(dateString);
      return format(date, "PPP 'at' p");
    } catch (e) {
      return "Unknown date";
    }
  };

  const getPetInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const handleMarkAsLost = async () => {
    if (!pet || !user) return;
    
    setMarkingAsLost(true);
    
    try {
      const { error } = await supabase
        .from('pets')
        .update({
          is_lost: true,
          last_seen_location: lastSeenLocation || null,
          lost_date: new Date().toISOString()
        })
        .eq('id', pet.id)
        .eq('owner_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update the local pet state
      setPet({
        ...pet,
        isLost: true,
        lastSeenLocation: lastSeenLocation || null,
        lostDate: new Date().toISOString()
      });
      
      toast.success(`${pet.name} has been marked as lost`);
      setLostDialogOpen(false);
    } catch (error: any) {
      console.error("Error marking pet as lost:", error);
      toast.error(error.message || "Failed to mark pet as lost");
    } finally {
      setMarkingAsLost(false);
    }
  };
  
  const handleMarkAsFound = async () => {
    if (!pet || !user) return;
    
    setMarkingAsFound(true);
    
    try {
      const { error } = await supabase
        .from('pets')
        .update({
          is_lost: false,
          last_seen_location: null,
          lost_date: null
        })
        .eq('id', pet.id)
        .eq('owner_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update the local pet state
      setPet({
        ...pet,
        isLost: false,
        lastSeenLocation: null,
        lostDate: null
      });
      
      toast.success(`${pet.name} has been marked as found`);
      setFoundDialogOpen(false);
    } catch (error: any) {
      console.error("Error marking pet as found:", error);
      toast.error(error.message || "Failed to mark pet as found");
    } finally {
      setMarkingAsFound(false);
    }
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className={`mb-6 flex flex-col md:flex-row md:justify-between md:items-center ${pet.isLost ? "bg-amber-50 p-4 rounded-lg border-2 border-amber-500" : ""}`}>
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
                  <span className="text-amber-600 text-sm font-normal bg-amber-100 px-2 py-1 rounded-full flex items-center">
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
            <Button asChild variant="outline">
              <Link to={user ? "/dashboard" : "/"}>
                Back {user ? "to Dashboard" : "Home"}
              </Link>
            </Button>
            {isOwner && (
              <>
                <Button asChild>
                  <Link to={`/qr-code/${pet.id}`}>
                    <QrCode className="mr-2 h-4 w-4" /> QR Code
                  </Link>
                </Button>
                {pet.isLost ? (
                  <Button 
                    variant="default"
                    onClick={() => setFoundDialogOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Mark as Found
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    onClick={() => setLostDialogOpen(true)}
                  >
                    Mark as Lost
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        {pet.isLost && (
          <Card className="mb-6 border-2 border-amber-500">
            <CardHeader className="bg-amber-50">
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                Lost Pet Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {pet.lostDate && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span><strong>Reported lost on:</strong> {formatDate(pet.lostDate)}</span>
                </div>
              )}
              
              {pet.lastSeenLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <span><strong>Last seen at:</strong> {pet.lastSeenLocation}</span>
                </div>
              )}
              
              <p className="text-gray-700 mt-2">
                If you have seen this pet, please use the contact information below or scan the QR code to report a sighting.
              </p>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {pet.imageUrl && (
              <Card className="mb-6 overflow-hidden">
                <div className="aspect-video w-full">
                  <img 
                    src={pet.imageUrl} 
                    alt={pet.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>About {pet.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Type</h3>
                    <p>{pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</p>
                  </div>
                  
                  {pet.breed && (
                    <div>
                      <h3 className="font-semibold text-gray-700">Breed</h3>
                      <p>{pet.breed}</p>
                    </div>
                  )}
                  
                  {pet.description && (
                    <div>
                      <h3 className="font-semibold text-gray-700">Description</h3>
                      <p>{pet.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>QR Code Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <QrCode className="h-12 w-12 mx-auto text-primary" />
                </div>
                <Button asChild className="w-full">
                  <Link to={`/qr-code/${pet.id}`}>View & Download QR Code</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {isOwner && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Scan History</h2>
            
            {scanEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Scan History</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  When someone scans {pet.name}'s QR code, the scan events will appear here with location information.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {scanEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Clock className="h-4 w-4 mr-2" />
                            {formatDate(event.timestamp || event.createdAt)}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location.address || `Lat: ${event.location.lat}, Lng: ${event.location.lng}`}
                            </div>
                          )}
                          
                          {event.scannerContact && (
                            <p className="mb-2">
                              <span className="font-semibold">Contact:</span> {event.scannerContact}
                            </p>
                          )}
                          
                          {event.message && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                              <p className="text-gray-700">{event.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Mark as Lost Dialog */}
      <AlertDialog open={lostDialogOpen} onOpenChange={setLostDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark {pet.name} as Lost</AlertDialogTitle>
            <AlertDialogDescription>
              This will add {pet.name} to the public lost pets registry. Enter the last known location where your pet was seen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="lastSeenLocation">Last seen location</Label>
            <Input
              id="lastSeenLocation"
              placeholder="e.g. Central Park, New York"
              value={lastSeenLocation}
              onChange={(e) => setLastSeenLocation(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={markingAsLost}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMarkAsLost} 
              disabled={markingAsLost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {markingAsLost ? "Marking as Lost..." : "Mark as Lost"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Mark as Found Dialog */}
      <AlertDialog open={foundDialogOpen} onOpenChange={setFoundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark {pet.name} as Found</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {pet.name} from the public lost pets registry. Are you sure your pet has been found?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={markingAsFound}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMarkAsFound} 
              disabled={markingAsFound}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {markingAsFound ? "Marking as Found..." : "Mark as Found"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </Layout>
  );
};

export default PetProfile;
