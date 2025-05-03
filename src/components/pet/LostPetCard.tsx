
import { Pet } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LostPetCardProps {
  pet: Pet;
}

const LostPetCard = ({ pet }: LostPetCardProps) => {
  if (!pet.isLost) return null;
  
  return (
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
  );
};

export default LostPetCard;
