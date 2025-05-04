
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Eye, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { glass } from "@/lib/utils";
import { Pet } from "@/types";

interface PetCardProps {
  pet: Pet;
  onDeleteClick: (pet: Pet) => void;
}

const PetCard = ({ pet, onDeleteClick }: PetCardProps) => {
  const navigate = useNavigate();
  
  const getPetInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card key={pet.id} className={`overflow-hidden ${glass} transition-all duration-300 hover:shadow-xl`}>
      {pet.imageUrl ? (
        <div className="aspect-video w-full">
          <img 
            src={pet.imageUrl} 
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
            onClick={() => onDeleteClick(pet)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
