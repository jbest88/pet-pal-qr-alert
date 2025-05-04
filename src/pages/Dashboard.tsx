
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { glass } from "@/lib/utils";
import { Pet } from "@/types";
import PetGrid from "@/components/dashboard/PetGrid";
import DeletePetDialog from "@/components/dashboard/DeletePetDialog";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  
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
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      // Reset petToDelete state
      setPetToDelete(null);
    }
  };

  if (loading || loadingPets) {
    return <DashboardLoading />;
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
              <PlusCircle className="h-4 w-4 mr-2" /> Add New Pet
            </Link>
          </Button>
        </div>
        
        <PetGrid pets={pets} onDeletePet={setPetToDelete} />
      </div>
      
      <DeletePetDialog 
        pet={petToDelete}
        onOpenChange={(open) => !open && setPetToDelete(null)}
        onConfirmDelete={handleDeletePet}
      />
    </Layout>
  );
};

export default Dashboard;
