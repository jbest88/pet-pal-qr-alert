
import { Pet } from "@/types";
import { glass } from "@/lib/utils";
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

interface DeletePetDialogProps {
  pet: Pet | null;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

const DeletePetDialog = ({ pet, onOpenChange, onConfirmDelete }: DeletePetDialogProps) => {
  return (
    <AlertDialog open={!!pet} onOpenChange={onOpenChange}>
      <AlertDialogContent className={glass}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {pet?.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {pet?.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={glass}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePetDialog;
