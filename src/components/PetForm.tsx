
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pet } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const PetForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState<"dog" | "cat" | "other">("dog");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a pet profile");
      return;
    }
    
    if (!name.trim()) {
      toast.error("Please enter your pet's name");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the pet in Supabase
      const { data: pet, error } = await supabase
        .from('pets')
        .insert({
          owner_id: user.id,
          name: name.trim(),
          type,
          breed: breed.trim() || null,
          description: description.trim() || null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success(`${name}'s profile created successfully!`);
      navigate(`/pet/${pet.id}`);
    } catch (error: any) {
      console.error("Error creating pet profile:", error);
      toast.error(error.message || "Failed to create pet profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Pet Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your pet's name"
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Pet Type</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as "dog" | "cat" | "other")}
          disabled={isSubmitting}
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
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder="Enter your pet's breed"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your pet (color, size, special marks, etc.)"
          disabled={isSubmitting}
          rows={4}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Profile..." : "Create Pet Profile"}
      </Button>
    </form>
  );
};

export default PetForm;
