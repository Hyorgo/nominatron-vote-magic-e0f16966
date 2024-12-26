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
          "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
          "border border-border/50 hover:border-primary/50",
          "animate-fade-in w-full h-full flex flex-col",
          "bg-white/[0.02] backdrop-blur-sm",
          isSelected && "ring-2 ring-primary/50 ring-offset-2 bg-primary/5"
        )}
      >
        {isSelected && (
          <div className="absolute top-4 right-4 z-10">
            <Star className="h-6 w-6 text-gold fill-gold animate-scale-in" />
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
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] transition-opacity duration-300" />
            )}
          </div>
        )}
        
        <CardHeader className="space-y-2 p-5 sm:p-6 flex-grow">
          <CardTitle 
            className={cn(
              "text-xl sm:text-2xl transition-colors duration-300 line-clamp-2",
              "group-hover:text-primary",
              isSelected && "text-primary"
            )}
          >
            {nominee.name}
          </CardTitle>
          <CardDescription 
            className={cn(
              "text-base sm:text-lg line-clamp-3 mt-2",
              isSelected && "text-foreground/80"
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
                  variant={isSelected ? "secondary" : "default"}
                  size="lg"
                  className={cn(
                    "w-full transition-all duration-300",
                    "text-base sm:text-lg",
                    "group-hover:shadow-lg",
                    isSelected && "bg-primary/20 hover:bg-primary/30 border-2 border-primary"
                  )}
                >
                  {isSelected ? (
                    <>
                      <Check className="mr-2 h-5 w-5 animate-scale-in" />
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
              <div className="pt-4 border-t space-y-3">
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