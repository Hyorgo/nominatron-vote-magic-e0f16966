import { Button } from "@/components/ui/button";
import { HelpCircle, Menu } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                Naviguer vers une catégorie spécifique
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              {categories.map((category, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => onSelectCategory?.(index)}
                  className="cursor-pointer"
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Catégorie {currentIndex + 1} sur {totalCategories}
      </p>
    </div>
  );
};