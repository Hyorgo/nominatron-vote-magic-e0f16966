import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VotingRegistrationForm } from "./VotingRegistrationForm";

interface VotingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VotingDialog = ({ open, onOpenChange }: VotingDialogProps) => {
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