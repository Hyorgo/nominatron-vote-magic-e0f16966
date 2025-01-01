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
  console.log(`NomineeCard ${nominee.id} - isSelected:`, isSelected);
  
  // Gestion des images spécifiques pour MY, PLAN B, THE MAZE, F&K, L'ILE, BUS PARADISE, KAIA, NEL'S CLUB, LA MAISON BLEUE et LA FERIA
  const nomineeName = nominee.name.toLowerCase();
  const isMyNominee = nomineeName === "my";
  const isPlanBNominee = nomineeName === "plan b";
  const isMazeNominee = nomineeName === "the maze";
  const isFKNominee = nomineeName === "f&k";
  const isIleNominee = nomineeName === "l'ile";
  const isParadiseNominee = nomineeName === "bus paradise";
  const isKaiaNominee = nomineeName === "kaia";
  const isNelsClubNominee = nomineeName === "nel's club";
  const isMaisonBleueNominee = nomineeName === "la maison bleue";
  const isFeriaNominee = nomineeName === "la feria";
  
  const imageUrl = isMyNominee 
    ? "/lovable-uploads/d58b4350-a0b2-4d6a-a124-3d2724665647.png"
    : isPlanBNominee
    ? "/lovable-uploads/c9f7ee7f-7f01-4778-bf67-98c3af662375.png"
    : isMazeNominee
    ? "/lovable-uploads/58e4d1a2-4dfb-4c0d-a74d-edf7b9133d2e.png"
    : isFKNominee
    ? "/lovable-uploads/4cca2c41-ad59-4eb8-8768-d8acd38f6a85.png"
    : isIleNominee
    ? "/lovable-uploads/e2bb2732-4867-4199-9d7c-93f850f4e8b2.png"
    : isParadiseNominee
    ? "/lovable-uploads/e86ac02b-b1f9-4ba7-b2fe-6c0b71a57d1a.png"
    : isKaiaNominee
    ? "/lovable-uploads/822f2109-e39c-49bc-9d49-a0caff61ca93.png"
    : isNelsClubNominee
    ? "/lovable-uploads/25203221-e2c4-47ba-9bca-3268e1a91e12.png"
    : isMaisonBleueNominee
    ? "/lovable-uploads/b7e6bd80-2442-4cd2-ab7c-d9844d394308.png"
    : isFeriaNominee
    ? "/lovable-uploads/6f664826-df3a-424d-8c6d-ccad72240ba6.png"
    : nominee.image_url;
  
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
        
        {imageUrl && (
          <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={nominee.name}
              className={cn(
                "object-contain w-full h-full transition-transform duration-500",
                "group-hover:scale-110",
                isSelected && "brightness-110",
                (isMyNominee || isPlanBNominee || isMazeNominee || isFKNominee || isIleNominee || isParadiseNominee || isKaiaNominee || isNelsClubNominee || isMaisonBleueNominee || isFeriaNominee) && "bg-black p-4" // Ajout d'un fond noir et padding pour tous les logos
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
                      "bg-primary/90 hover:bg-primary/80",
                      "dark:bg-primary/80 dark:hover:bg-primary/70",
                      "text-primary-foreground border-2 border-primary/50",
                      "transform scale-105"
                    ] : [
                      "bg-gold-light/30 hover:bg-gold/40",
                      "text-gold-dark border border-gold/30",
                      "dark:bg-gold-light/20 dark:hover:bg-gold/30",
                      "dark:text-gold-light dark:border-gold/20"
                    ]
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