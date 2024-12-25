import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface ParticipantsActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDeleteAll: () => void;
  onExportCsv: () => void;
}

export const ParticipantsActions = ({
  searchTerm,
  onSearchChange,
  onDeleteAll,
  onExportCsv,
}: ParticipantsActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Participants aux votes</h3>
      <div className="flex gap-4">
        <Input
          type="search"
          placeholder="Rechercher..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button variant="outline" onClick={onExportCsv}>
          Exporter CSV
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Tout supprimer</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement tous les participants. Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteAll}>
                Supprimer tout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};