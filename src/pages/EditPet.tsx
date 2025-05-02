
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";

const EditPet = () => {
  const { petId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pet, setPet] = useState({
    name: "",
    type: "dog",
    breed: "",
    description: "",
    imageUrl: ""
  });
  
  useEffect(() => {
    const fetchPet = async () => {
      if (!user || !petId) return;
      
      try {
        setLoading(true);
        
        // Fetch the pet data
        const { data, error } = await supabase
          .from("pets")
          .select("*")
          .eq("id", petId)
          .eq("owner_id", user.id)
          .single();
          
        if (error) {
          toast.error("Error loading pet information");
          navigate("/dashboard");
          return;
        }
        
        if (!data) {
          toast.error("Pet not found");
          navigate("/dashboard");
          return;
        }
        
        setPet({
          name: data.name,
          type: data.type,
          breed: data.breed || "",
          description: data.description || "",
          imageUrl: data.image_url || ""
        });
      } catch (error) {
        toast.error("An error occurred while loading pet information");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPet();
  }, [user, petId, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !petId) {
      toast.error("You must be logged in to update a pet");
      return;
    }
    
    if (!pet.name.trim()) {
      toast.error("Please enter your pet's name");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Update the pet in Supabase
      const { error } = await supabase
        .from("pets")
        .update({
          name: pet.name.trim(),
          type: pet.type,
          breed: pet.breed.trim() || null,
          description: pet.description.trim() || null,
          image_url: pet.imageUrl || null
        })
        .eq("id", petId)
        .eq("owner_id", user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success(`${pet.name}'s profile updated successfully!`);
      navigate(`/pet/${petId}`);
    } catch (error) {
      console.error("Error updating pet profile:", error);
      toast.error(error.message || "Failed to update pet profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUploaded = (url: string) => {
    console.log("Image URL updated:", url);
    setPet({ ...pet, imageUrl: url });
  };
  
  if (loading) {
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
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Pet Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <ImageUpload 
              onImageUploaded={handleImageUploaded} 
              currentImageUrl={pet.imageUrl}
              petId={petId}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Pet Name</Label>
            <Input
              id="name"
              value={pet.name}
              onChange={(e) => setPet({ ...pet, name: e.target.value })}
              placeholder="Enter your pet's name"
              disabled={submitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Pet Type</Label>
            <Select
              value={pet.type}
              onValueChange={(value) => setPet({ ...pet, type: value })}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="breed">Breed (Optional)</Label>
            <Input
              id="breed"
              value={pet.breed}
              onChange={(e) => setPet({ ...pet, breed: e.target.value })}
              placeholder="Enter your pet's breed"
              disabled={submitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={pet.description}
              onChange={(e) => setPet({ ...pet, description: e.target.value })}
              placeholder="Describe your pet (color, size, special marks, etc.)"
              disabled={submitting}
              rows={4}
            />
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate("/dashboard")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={submitting}
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPet;
