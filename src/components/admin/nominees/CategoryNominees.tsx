import { Trophy, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Category } from "@/types/nominees";
import { NomineeItem } from "./NomineeItem";

interface CategoryNomineesProps {
  category: Category;
  dragHandleProps?: any;
  onDelete: (id: string) => void;
}

export const CategoryNominees = ({ 
  category, 
  dragHandleProps, 
  onDelete 
}: CategoryNomineesProps) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={category.id}>
        <div className="flex items-center">
          <div
            {...dragHandleProps}
            className="p-2 hover:cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <TooltipProvider>
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
          </TooltipProvider>
        </div>

        <AccordionContent>
          <div className="space-y-4 mt-2 animate-fade-in">
            {category.nominees.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Aucun nominé dans cette catégorie
              </p>
            ) : (
              category.nominees.map((nominee) => (
                <NomineeItem
                  key={nominee.id}
                  nominee={nominee}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};