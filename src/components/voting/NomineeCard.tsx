import { Check, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SocialShare } from "./SocialShare";

interface NomineeCardProps {
  nominee: {
    id: string;
    name: string;
    description: string;
    image_url?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const NomineeCard = ({ nominee, isSelected, onClick }: NomineeCardProps) => {
  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg",
          "border border-border/50 hover:border-primary/50",
          "animate-fade-in w-full",
          isSelected && "ring-2 ring-primary ring-offset-2 bg-primary/5"
        )}
      >
        {isSelected && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary text-primary-foreground rounded-full p-1 sm:p-1.5 shadow-lg animate-scale-in z-10 cursor-help">
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Votre choix actuel pour cette catégorie
            </TooltipContent>
          </Tooltip>
        )}
        
        {nominee.image_url && (
          <div className="relative h-36 sm:h-48 overflow-hidden rounded-t-lg">
            <img
              src={nominee.image_url}
              alt={nominee.name}
              className={cn(
                "object-cover w-full h-full transition-transform duration-300",
                "group-hover:scale-105",
                isSelected && "brightness-110"
              )}
            />
            {isSelected && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] transition-opacity duration-300" />
            )}
          </div>
        )}
        
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle 
            className={cn(
              "text-base sm:text-lg transition-colors duration-300 line-clamp-2",
              "group-hover:text-primary",
              isSelected && "text-primary"
            )}
          >
            {nominee.name}
          </CardTitle>
          <CardDescription 
            className={cn(
              "text-sm line-clamp-2 mt-1",
              isSelected && "text-foreground/80"
            )}
          >
            {nominee.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onClick}
                variant={isSelected ? "secondary" : "default"}
                className={cn(
                  "w-full transition-all duration-300",
                  "text-sm sm:text-base",
                  "group-hover:shadow-md",
                  isSelected && "bg-primary/20 hover:bg-primary/30"
                )}
              >
                <Vote className={cn(
                  "mr-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300",
                  isSelected && "rotate-12"
                )} />
                {isSelected ? "Sélectionné" : "Voter"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isSelected 
                ? "Cliquez pour changer votre vote" 
                : "Cliquez pour voter pour ce nominé"}
            </TooltipContent>
          </Tooltip>

          {isSelected && (
            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">
                Partagez votre vote !
              </div>
              <SocialShare 
                nomineeId={nominee.id}
                nomineeName={nominee.name}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};