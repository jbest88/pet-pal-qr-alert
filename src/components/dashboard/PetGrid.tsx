
import PetCard from "./PetCard";
import EmptyPetState from "./EmptyPetState";
import { Pet } from "@/types";

interface PetGridProps {
  pets: Pet[];
  onDeletePet: (pet: Pet) => void;
}

const PetGrid = ({ pets, onDeletePet }: PetGridProps) => {
  if (pets.length === 0) {
    return <EmptyPetState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} onDeleteClick={onDeletePet} />
      ))}
    </div>
  );
};

export default PetGrid;
