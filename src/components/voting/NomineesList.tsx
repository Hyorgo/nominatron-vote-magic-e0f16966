import { Button } from "@/components/ui/button";
import { Vote, Star } from "lucide-react";
import { Nominee } from "@/types/nominees";
import { SocialShare } from "./SocialShare";
import { cn } from "@/lib/utils";

interface NomineesListProps {
  nominees: Nominee[];
  categoryId: string;
  selectedNomineeId?: string;
  onVote: (nomineeId: string, categoryId: string) => void;
}

export const NomineesList = ({ nominees, categoryId, selectedNomineeId, onVote }: NomineesListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
      {nominees
        .filter((nominee) => nominee.category_id === categoryId)
        .map((nominee) => {
          const isSelected = selectedNomineeId === nominee.id;
          
          return (
            <div
              key={nominee.id}
              className={cn(
                "relative group overflow-hidden transition-all duration-300",
                "border rounded-lg p-4",
                "hover:scale-105 hover:shadow-xl",
                isSelected ? [
                  "border-primary bg-primary/5",
                  "ring-2 ring-primary ring-offset-2",
                  "dark:bg-primary/10"
                ] : "border-border/50 hover:border-primary/50"
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 z-10">
                  <Star className="h-8 w-8 text-gold fill-gold animate-scale-in" />
                </div>
              )}

              {nominee.image_url && (
                <div className="relative h-36 sm:h-48 mb-4 overflow-hidden rounded-md">
                  <img
                    src={nominee.image_url}
                    alt={nominee.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {nominee.name}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-2">
                {nominee.description}
              </p>

              <div className="space-y-4">
                <Button 
                  onClick={() => onVote(nominee.id, categoryId)}
                  variant={isSelected ? "secondary" : "default"}
                  className={cn(
                    "w-full text-sm sm:text-base font-semibold",
                    isSelected && [
                      "bg-emerald-100 hover:bg-emerald-200",
                      "dark:bg-emerald-900/30 dark:hover:bg-emerald-900/40",
                      "border-2 border-emerald-500",
                      "text-emerald-700 dark:text-emerald-300"
                    ]
                  )}
                >
                  {isSelected ? (
                    <>
                      <Star className="mr-2 h-5 w-5 animate-scale-in" />
                      Sélectionné
                    </>
                  ) : (
                    <>
                      <Vote className="mr-2 h-4 w-4" />
                      Voter
                    </>
                  )}
                </Button>

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
              </div>
            </div>
          );
        })}
    </div>
  );
};