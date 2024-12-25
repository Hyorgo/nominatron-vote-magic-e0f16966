import { Button } from "@/components/ui/button";
import { Vote, Star } from "lucide-react";
import { Nominee } from "@/types/nominees";

interface NomineesListProps {
  nominees: Nominee[];
  categoryId: string;
  selectedNomineeId?: string;
  onVote: (nomineeId: string, categoryId: string) => void;
}

export const NomineesList = ({ nominees, categoryId, selectedNomineeId, onVote }: NomineesListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nominees
        .filter((nominee) => nominee.category_id === categoryId)
        .map((nominee) => (
          <div
            key={nominee.id}
            className="nominee-card group hover:scale-105 transition-all duration-300"
          >
            {nominee.image_url && (
              <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                <img
                  src={nominee.image_url}
                  alt={nominee.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {nominee.name}
              </h3>
              {selectedNomineeId === nominee.id && (
                <Star className="h-5 w-5 text-gold fill-gold animate-scale-in" />
              )}
            </div>
            <p className="text-muted-foreground mb-4">
              {nominee.description}
            </p>
            <Button 
              onClick={() => onVote(nominee.id, categoryId)}
              variant={selectedNomineeId === nominee.id ? "secondary" : "default"}
              className="w-full"
            >
              <Vote className="mr-2 h-4 w-4" />
              {selectedNomineeId === nominee.id ? "Sélectionné" : "Voter"}
            </Button>
          </div>
        ))}
    </div>
  );
};