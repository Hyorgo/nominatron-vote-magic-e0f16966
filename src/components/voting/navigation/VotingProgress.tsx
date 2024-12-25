import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VotingProgressProps {
  votedCategories: number;
  totalCategories: number;
}

export const VotingProgress = ({
  votedCategories,
  totalCategories,
}: VotingProgressProps) => {
  const progress = (votedCategories / totalCategories) * 100;

  return (
    <div className="bg-card/50 p-8 rounded-lg border border-border backdrop-blur-sm shadow-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium">Progression des votes</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-base font-bold text-primary cursor-help">
                {votedCategories} / {totalCategories} catégories votées
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Votez dans toutes les catégories pour compléter votre participation</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-3 bg-secondary"
          />
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(progress)}% complété
          </p>
        </div>
      </div>
    </div>
  );
};