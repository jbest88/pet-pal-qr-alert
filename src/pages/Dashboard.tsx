
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Scan, Pencil, Trash2, Eye, QrCode } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { toast } from "sonner";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { glass } from "@/lib/utils";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  
  // Fetch pets when user is available
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching pets for user:", user.id);
        setLoadingPets(true);
        
        // Fetch pets from Supabase
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', user.id);
        
        if (error) {
          console.error('Error fetching pets:', error);
          return;
        }
        
        console.log("Pets fetched:", data);
        setPets(data || []);
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoadingPets(false);
      }
    };
    
    fetchPets();
  }, [user]);
  
  useEffect(() => {
    // If user authentication is done loading and there's no user, redirect to login
    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    }
  }, [user, loading, navigate]);
  
  const handleDeletePet = async () => {
    if (!petToDelete) return;
    
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petToDelete.id);
        
      if (error) {
        toast.error(`Failed to delete ${petToDelete.name}: ${error.message}`);
        return;
      }
      
      // Remove pet from local state
      setPets(pets.filter(pet => pet.id !== petToDelete.id));
      toast.success(`${petToDelete.name} has been removed`);
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      // Reset petToDelete state
      setPetToDelete(null);
    }
  };

  const getPetInitials = (name) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  if (loading || loadingPets) {
    return (
      <Layout>
        <div className="min-h-screen bg-accent flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage your pets and QR codes here</p>
        </div>
        
        <div className="mb-8">
          <Button asChild className={`${glass} hover:bg-white/40 transition-all duration-300`}>
            <Link to="/add-pet">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Pet
            </Link>
          </Button>
        </div>
        
        {pets.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${glass}`}>
            <Scan className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Pets Yet</h2>
            <p className="text-gray-500 mb-6">
              Add your first pet to generate a QR code for their collar.
            </p>
            <Button asChild className={`${glass} hover:bg-white/40 transition-all duration-300`}>
              <Link to="/add-pet">Get Started</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className={`overflow-hidden ${glass} transition-all duration-300 hover:shadow-xl`}>
                {pet.image_url ? (
                  <div className="aspect-video w-full">
                    <img 
                      src={pet.image_url} 
                      alt={pet.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-accent/20 backdrop-blur-sm flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback>{getPetInitials(pet.name)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <CardHeader className="bg-primary/10 backdrop-blur-sm">
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
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`${glass} hover:bg-white/40`}
                      onClick={() => navigate(`/pet/${pet.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon"
                      className={`${glass} hover:bg-white/40`}
                      onClick={() => navigate(`/qr-code/${pet.id}`)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`${glass} hover:bg-white/40`}
                      onClick={() => navigate(`/edit-pet/${pet.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`${glass} hover:bg-white/40 hover:text-destructive`}
                      onClick={() => setPetToDelete(pet)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!petToDelete} onOpenChange={(open) => !open && setPetToDelete(null)}>
        <AlertDialogContent className={glass}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {petToDelete?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {petToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={glass}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePet} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Dashboard;
