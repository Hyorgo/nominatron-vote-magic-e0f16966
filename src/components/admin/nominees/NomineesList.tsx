import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Trash, Search, ArrowUpDown, GripVertical } from "lucide-react";
import { Category } from "../../../types/nominees";
import { useState, useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NomineesListProps {
  categories: Category[];
  onDelete: (id: string) => void;
}

export const NomineesList = ({ categories: initialCategories, onDelete }: NomineesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"name" | "date">("name");
  const [categories, setCategories] = useState(initialCategories);
  const { toast } = useToast();

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);

    // Mettre à jour l'ordre dans la base de données
    try {
      const updates = items.map((category, index) => ({
        id: category.id,
        name: category.name, // Ajout du champ name requis
        display_order: index + 1,
      }));

      const { error } = await supabase
        .from('categories')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'ordre des catégories a été mis à jour",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'ordre des catégories",
      });
    }
  }, [categories, toast]);

  const filteredAndSortedCategories = categories.map(category => ({
    ...category,
    nominees: category.nominees
      .filter(nominee =>
        nominee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nominee.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "name") {
          return a.name.localeCompare(b.name);
        } else {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      })
  }));

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un nominé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={sortOrder}
            onValueChange={(value: "name" | "date") => setSortOrder(value)}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Choisir l'ordre de tri</p>
              </TooltipContent>
            </Tooltip>
            <SelectContent>
              <SelectItem value="name">Trier par nom</SelectItem>
              <SelectItem value="date">Trier par date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {filteredAndSortedCategories.map((category, index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <Accordion type="single" collapsible>
                          <AccordionItem value={category.id}>
                            <div className="flex items-center">
                              <div
                                {...provided.dragHandleProps}
                                className="p-2 hover:cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AccordionTrigger className="flex-1 text-lg font-medium hover:no-underline">
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
                            </div>

                            <AccordionContent>
                              <div className="space-y-4 mt-2 animate-fade-in">
                                {category.nominees.length === 0 ? (
                                  <p className="text-muted-foreground text-sm">
                                    Aucun nominé dans cette catégorie
                                  </p>
                                ) : (
                                  category.nominees.map((nominee) => (
                                    <div
                                      key={nominee.id}
                                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                                    >
                                      <div className="flex-1">
                                        <h4 className="font-medium">{nominee.name}</h4>
                                        <p className="text-sm text-muted-foreground">
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
                                  ))
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </TooltipProvider>
  );
};