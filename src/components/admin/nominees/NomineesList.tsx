import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Category } from "../../../types/nominees";

interface NomineesListProps {
  categories: Category[];
  onDelete: (id: string) => void;
}

export const NomineesList = ({ categories, onDelete }: NomineesListProps) => {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {categories.map((category) => (
        <AccordionItem key={category.id} value={category.id}>
          <AccordionTrigger className="text-lg font-medium">
            {category.name} ({category.nominees.length} nominés)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-2">
              {category.nominees.map((nominee) => (
                <div
                  key={nominee.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-left">{nominee.name}</h4>
                    <p className="text-sm text-muted-foreground text-left">
                      {nominee.description}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(nominee.id)}
                    className="ml-4 flex-shrink-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
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
  );
};