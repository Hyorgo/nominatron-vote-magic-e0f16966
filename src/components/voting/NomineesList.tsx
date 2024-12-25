import { Button } from "@/components/ui/button";
import { Vote, Star } from "lucide-react";
import { Nominee } from "@/types/nominees";
import { SocialShare } from "./SocialShare";

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
        .map((nominee) => (
          <div
            key={nominee.id}
            className="nominee-card group hover:scale-105 transition-all duration-300 bg-card rounded-lg border p-4"
          >
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
              {selectedNomineeId === nominee.id && (
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-gold fill-gold animate-scale-in flex-shrink-0" />
              )}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-2">
              {nominee.description}
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => onVote(nominee.id, categoryId)}
                variant={selectedNomineeId === nominee.id ? "secondary" : "default"}
                className="w-full text-sm sm:text-base"
              >
                <Vote className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {selectedNomineeId === nominee.id ? "Sélectionné" : "Voter"}
              </Button>

              {selectedNomineeId === nominee.id && (
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
        ))}
    </div>
  );
};