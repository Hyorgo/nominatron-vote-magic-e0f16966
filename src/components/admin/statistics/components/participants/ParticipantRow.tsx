import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

type Participant = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
};

interface ParticipantRowProps {
  participant: Participant;
  onEdit: (participant: Participant) => void;
  onDelete: (email: string) => void;
}

export const ParticipantRow = ({ participant, onEdit, onDelete }: ParticipantRowProps) => {
  return (
    <TableRow>
      <TableCell>{participant.email}</TableCell>
      <TableCell>{participant.first_name || "-"}</TableCell>
      <TableCell>{participant.last_name || "-"}</TableCell>
      <TableCell>
        {new Date(participant.created_at).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le participant</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="first_name">Prénom</label>
                  <Input
                    id="first_name"
                    defaultValue={participant.first_name || ""}
                    onChange={(e) =>
                      onEdit({ ...participant, first_name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="last_name">Nom</label>
                  <Input
                    id="last_name"
                    defaultValue={participant.last_name || ""}
                    onChange={(e) =>
                      onEdit({ ...participant, last_name: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => onEdit(participant)}>Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement ce participant. Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(participant.email)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};