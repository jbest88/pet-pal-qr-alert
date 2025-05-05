
import { useState } from "react";
import { Pet } from "@/types";
import { supabase } from "@/integrations/supabase/client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag, FlagOff } from "lucide-react";
import { glass } from "@/lib/utils";

interface PetStatusDialogsProps {
  pet: Pet;
  onPetStatusChange: (updatedPet: Pet) => void;
  lostDialogOpen: boolean;
  setLostDialogOpen: (open: boolean) => void;
  foundDialogOpen: boolean;
  setFoundDialogOpen: (open: boolean) => void;
}

const PetStatusDialogs = ({
  pet,
  onPetStatusChange,
  lostDialogOpen,
  setLostDialogOpen,
  foundDialogOpen,
  setFoundDialogOpen
}: PetStatusDialogsProps) => {
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [markingAsLost, setMarkingAsLost] = useState(false);
  const [markingAsFound, setMarkingAsFound] = useState(false);
  
  const handleMarkAsLost = async () => {
    setMarkingAsLost(true);
    
    try {
      const { error } = await supabase
        .from('pets')
        .update({
          is_lost: true,
          last_seen_location: lastSeenLocation || null,
          lost_date: new Date().toISOString()
        })
        .eq('id', pet.id);
        
      if (error) {
        throw error;
      }
      
      // Update the local pet state via callback
      const updatedPet = {
        ...pet,
        isLost: true,
        lastSeenLocation: lastSeenLocation || null,
        lostDate: new Date().toISOString()
      };
      
      onPetStatusChange(updatedPet);
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
    setMarkingAsFound(true);
    
    try {
      const { error } = await supabase
        .from('pets')
        .update({
          is_lost: false,
          last_seen_location: null,
          lost_date: null
        })
        .eq('id', pet.id);
        
      if (error) {
        throw error;
      }
      
      // Update the local pet state via callback
      const updatedPet = {
        ...pet,
        isLost: false,
        lastSeenLocation: null,
        lostDate: null
      };
      
      onPetStatusChange(updatedPet);
      toast.success(`${pet.name} has been marked as found`);
      setFoundDialogOpen(false);
    } catch (error: any) {
      console.error("Error marking pet as found:", error);
      toast.error(error.message || "Failed to mark pet as found");
    } finally {
      setMarkingAsFound(false);
    }
  };
  
  return (
    <>
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
              className={`bg-destructive text-destructive-foreground hover:bg-destructive/90 ${glass} flex items-center gap-2`}
            >
              <Flag className="h-4 w-4" />
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
              className={`bg-green-600 text-white hover:bg-green-700 ${glass} flex items-center gap-2`}
            >
              <FlagOff className="h-4 w-4" />
              {markingAsFound ? "Marking as Found..." : "Mark as Found"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PetStatusDialogs;
