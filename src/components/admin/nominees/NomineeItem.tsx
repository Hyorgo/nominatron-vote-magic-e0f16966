import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Nominee } from "@/types/nominees";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { logger } from '@/services/monitoring/logger';

interface NomineeItemProps {
  nominee: Nominee;
  onDelete: (id: string) => void;
}

export const NomineeItem = ({ nominee, onDelete }: NomineeItemProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error('Erreur de chargement de l\'image', {
      nomineeId: nominee.id,
      imageUrl: nominee.image_url
    });
    e.currentTarget.src = '/placeholder.svg';
    e.currentTarget.className = 'w-full h-full object-contain p-4';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={nominee.image_url || ''}
            alt={nominee.name}
            type="profile"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <div>
          <h4 className="font-medium">{nominee.name}</h4>
          <p className="text-sm text-muted-foreground">
            {nominee.description}
          </p>
        </div>
      </div>

      <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="ml-4 flex-shrink-0 hover:bg-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Supprimer ce nominé</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {nominee.name} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(nominee.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};