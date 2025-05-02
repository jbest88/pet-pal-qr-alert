
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPetsByOwnerId } from "@/lib/store";
import { Pet } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Scan } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  
  useEffect(() => {
    // If user authentication is done loading and there's no user, redirect to register
    if (!loading && !user) {
      navigate("/register");
      return;
    }
    
    // If we have a user, fetch their pets
    if (user) {
      const userPets = getPetsByOwnerId(user.id);
      setPets(userPets);
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
        <p className="text-gray-600">Manage your pets and QR codes here</p>
      </div>
      
      <div className="mb-8">
        <Button asChild className="w-full md:w-auto">
          <Link to="/add-pet">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Pet
          </Link>
        </Button>
      </div>
      
      {pets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Scan className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Pets Yet</h2>
          <p className="text-gray-500 mb-6">
            Add your first pet to generate a QR code for their collar.
          </p>
          <Button asChild>
            <Link to="/add-pet">Get Started</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden">
              <CardHeader className="bg-primary/10">
                <CardTitle>{pet.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p><strong>Type:</strong> {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</p>
                {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                {pet.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {pet.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to={`/pet/${pet.id}`}>
                  <Button variant="outline">View Profile</Button>
                </Link>
                <Link to={`/qr-code/${pet.id}`}>
                  <Button>View QR Code</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
