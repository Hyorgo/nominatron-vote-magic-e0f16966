import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Trophy, Trash } from "lucide-react";
import { Category } from "../../../types/nominees";

interface NomineesListProps {
  categories: Category[];
  onDelete: (id: string) => void;
}

export const NomineesList = ({ categories, onDelete }: NomineesListProps) => {
  return (
    <TooltipProvider>
      <Accordion 
        type="single" 
        collapsible 
        className="space-y-4"
      >
        {categories.map((category) => (
          <AccordionItem 
            key={category.id} 
            value={category.id}
            className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up transition-all"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-gold" />
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.nominees.length} nominé{category.nominees.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </AccordionTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cliquez pour voir les nominés de cette catégorie</p>
              </TooltipContent>
            </Tooltip>
            
            <AccordionContent>
              <div className="space-y-4 mt-2 animate-fade-in">
                {category.nominees.map((nominee) => (
                  <div
                    key={nominee.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-left">{nominee.name}</h4>
                      <p className="text-sm text-muted-foreground text-left">
                        {nominee.description}
                      </p>
                    </div>
                    
                    <AlertDialog>
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

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer {nominee.name} ? Cette action est irréversible.
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
                ))}
                {category.nominees.length === 0 && (
                  <p className="text-muted-foreground text-sm text-left">
                    Aucun nominé dans cette catégorie
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </TooltipProvider>
  );
};