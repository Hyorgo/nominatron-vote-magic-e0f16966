import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavigationButtonsProps {
  currentIndex: number;
  totalCategories: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const NavigationButtons = ({
  currentIndex,
  totalCategories,
  onPrevious,
  onNext,
}: NavigationButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="transition-all hover:scale-105 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Catégorie précédente
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={currentIndex === totalCategories - 1}
            className="transition-all hover:scale-105 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Catégorie suivante
        </TooltipContent>
      </Tooltip>
    </div>
  );
};