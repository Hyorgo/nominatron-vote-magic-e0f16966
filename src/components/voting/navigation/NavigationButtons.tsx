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
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="transition-transform hover:scale-105"
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
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={currentIndex === totalCategories - 1}
            className="transition-transform hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Catégorie suivante
        </TooltipContent>
      </Tooltip>
    </>
  );
};