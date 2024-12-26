import { Button } from "@/components/ui/button";
import { HelpCircle, Grid3X3 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryTitleProps {
  categoryName: string;
  currentIndex: number;
  totalCategories: number;
  categories?: { name: string }[];
  onSelectCategory?: (index: number) => void;
}

export const CategoryTitle = ({
  categoryName,
  currentIndex,
  totalCategories,
  categories = [],
  onSelectCategory,
}: CategoryTitleProps) => {
  return (
    <div className="flex-1 text-center">
      <div className="flex items-center justify-center gap-4">
        <h2 className="text-2xl font-bold golden-reflection">{categoryName}</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="group">
              <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sélectionnez votre nominé favori dans cette catégorie</p>
          </TooltipContent>
        </Tooltip>
        {categories.length > 0 && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Grid3X3 className="h-4 w-4" />
                Toutes les catégories
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Catégories</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                <div className="grid gap-2 py-4">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={currentIndex === index ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => onSelectCategory?.(index)}
                    >
                      <span className="mr-2 text-sm text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Catégorie {currentIndex + 1} sur {totalCategories}
      </p>
    </div>
  );
};