import { Check, Vote, Star } from "lucide-react";
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
          "group relative overflow-hidden transition-all duration-300 h-full flex flex-col",
          "border hover:scale-[1.02] hover:shadow-xl",
          isSelected ? [
            "border-primary/80 bg-primary/5",
            "ring-2 ring-primary ring-offset-2",
            "dark:bg-primary/10",
            "transform scale-[1.02]"
          ] : "border-border/50 hover:border-primary/50"
        )}
      >
        {isSelected && (
          <div className="absolute top-4 right-4 z-10">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500 animate-scale-in" />
          </div>
        )}
        
        {nominee.image_url && (
          <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-lg">
            <img
              src={nominee.image_url}
              alt={nominee.name}
              className={cn(
                "object-cover w-full h-full transition-transform duration-500",
                "group-hover:scale-110",
                isSelected && "brightness-110"
              )}
            />
            {isSelected && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
            )}
          </div>
        )}
        
        <CardHeader className="space-y-2 p-5 sm:p-6 flex-grow">
          <CardTitle 
            className={cn(
              "text-xl sm:text-2xl transition-colors duration-300 line-clamp-2",
              isSelected ? "text-primary font-bold" : "group-hover:text-primary"
            )}
          >
            {nominee.name}
          </CardTitle>
          <CardDescription 
            className={cn(
              "text-base sm:text-lg line-clamp-3",
              isSelected && "text-foreground/90"
            )}
          >
            {nominee.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-5 sm:p-6 pt-0 mt-auto">
          <div className="space-y-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onClick}
                  size="lg"
                  className={cn(
                    "w-full transition-all duration-300",
                    "text-base sm:text-lg font-semibold",
                    "group-hover:shadow-lg",
                    isSelected ? [
                      "bg-emerald-600 hover:bg-emerald-700",
                      "dark:bg-emerald-700 dark:hover:bg-emerald-800",
                      "text-white border-2 border-emerald-500",
                      "transform scale-105"
                    ] : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {isSelected ? (
                    <>
                      <Check className="mr-2 h-6 w-6 animate-scale-in" />
                      Sélectionné
                    </>
                  ) : (
                    <>
                      <Vote className="mr-2 h-5 w-5" />
                      Voter
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isSelected 
                  ? "Cliquez pour changer votre vote" 
                  : "Cliquez pour voter pour ce nominé"}
              </TooltipContent>
            </Tooltip>

            {isSelected && (
              <div className="pt-4 border-t space-y-3 animate-fade-in">
                <div className="text-base text-muted-foreground text-center">
                  Partagez votre vote !
                </div>
                <SocialShare 
                  nomineeId={nominee.id}
                  nomineeName={nominee.name}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};