import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
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
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ParticipantsActions = ({
  searchTerm,
  onSearchChange,
  onDeleteAll,
  onExportCsv,
  currentPage,
  totalPages,
  onPageChange,
}: ParticipantsActionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un participant..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="whitespace-nowrap">
                <Trash2 className="h-4 w-4 mr-2" />
                Tout supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement tous les participants.
                  Cette action ne peut pas être annulée.
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
          <Button onClick={onExportCsv} variant="outline" className="whitespace-nowrap">
            <FileDown className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};