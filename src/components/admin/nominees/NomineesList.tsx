import { useState, useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Category } from "../../../types/nominees";
import { SearchAndSortBar } from "./SearchAndSortBar";
import { CategoryNominees } from "./CategoryNominees";
import { TooltipProvider } from "@/components/ui/tooltip";

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

    try {
      const updates = items.map((category, index) => ({
        id: category.id,
        name: category.name,
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
        <SearchAndSortBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

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
                        <CategoryNominees
                          category={category}
                          dragHandleProps={provided.dragHandleProps}
                          onDelete={onDelete}
                        />
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