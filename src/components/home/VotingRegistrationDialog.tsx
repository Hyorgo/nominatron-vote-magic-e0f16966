import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VotingRegistrationForm } from "@/components/voting/VotingRegistrationForm";

interface VotingRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VotingRegistrationDialog = ({ 
  open, 
  onOpenChange 
}: VotingRegistrationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscription pour voter</DialogTitle>
          <DialogDescription>
            Veuillez renseigner vos informations pour participer aux votes.
          </DialogDescription>
        </DialogHeader>
        <VotingRegistrationForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};