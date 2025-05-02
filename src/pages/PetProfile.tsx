
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPetById, getScanEventsByPetId } from "@/lib/store";
import { Pet, ScanEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, MapPin, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { format } from "date-fns";

const PetProfile = () => {
  const { petId } = useParams<{ petId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user authentication is done loading and there's no user, redirect to register
    if (!loading && !user) {
      navigate("/register");
      return;
    }
    
    // If petId is available, fetch the pet data
    if (petId) {
      const foundPet = getPetById(petId);
      if (foundPet) {
        setPet(foundPet);
        const events = getScanEventsByPetId(petId);
        setScanEvents(events);
      } else {
        // Pet not found
        navigate("/dashboard");
      }
    }
    
    setIsLoading(false);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{pet.name}'s Profile</h1>
            <p className="text-gray-600">
              {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button asChild variant="outline">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link to={`/qr-code/${pet.id}`}>
                <QrCode className="mr-2 h-4 w-4" /> View QR Code
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                          {format(new Date(event.timestamp), "PPP 'at' p")}
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
      </div>
    </Layout>
  );
};

export default PetProfile;
