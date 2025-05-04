
import { Pet } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { glass } from "@/lib/utils";

interface PetInfoProps {
  pet: Pet;
}

const PetInfo = ({ pet }: PetInfoProps) => {
  return (
    <Card className={glass}>
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
  );
};

export default PetInfo;
