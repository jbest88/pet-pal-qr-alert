
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pet, mapSupabasePet } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import Layout from "@/components/Layout";

const LostPets = () => {
  const [lostPets, setLostPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLostPets = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('is_lost', true);

        if (error) {
          console.error("Error fetching lost pets:", error);
          return;
        }

        const mappedPets = data.map(mapSupabasePet);
        setLostPets(mappedPets);
      } catch (error) {
        console.error("Error fetching lost pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLostPets();
  }, []);

  const getPetInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Lost Pets</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These pets have been reported as lost by their owners. If you've seen any of these pets, please contact their owner by scanning the QR code on the pet's profile.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : lostPets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Lost Pets</h2>
            <p className="text-gray-500 mb-6">
              There are currently no pets reported as lost. Check back later or report your lost pet if needed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lostPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden border-2 border-amber-500">
                {pet.imageUrl ? (
                  <div className="aspect-video w-full">
                    <img 
                      src={pet.imageUrl} 
                      alt={pet.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-accent flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback>{getPetInitials(pet.name)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                
                <CardHeader className="bg-amber-50">
                  <CardTitle className="flex items-center gap-2">
                    {pet.name}
                    <span className="text-amber-600 text-sm font-normal bg-amber-100 px-2 py-1 rounded-full">Lost</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-2">
                  <p><strong>Type:</strong> {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</p>
                  {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                  
                  {pet.lastSeenLocation && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-amber-600 flex-shrink-0" />
                      <p><strong>Last seen:</strong> {pet.lastSeenLocation}</p>
                    </div>
                  )}
                  
                  {pet.lostDate && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-1 text-amber-600 flex-shrink-0" />
                      <p><strong>Date:</strong> {formatDate(pet.lostDate)}</p>
                    </div>
                  )}
                  
                  {pet.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      {pet.description}
                    </p>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button asChild variant="default" className="w-full">
                    <Link to={`/pet/${pet.id}`}>
                      View Pet Profile
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LostPets;
