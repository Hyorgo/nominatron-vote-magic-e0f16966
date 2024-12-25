import { Button } from "@/components/ui/button";

interface VotingHeaderProps {
  isVotingOpen: boolean;
  onOpenDialog: () => void;
}

export const VotingHeader = ({ isVotingOpen }: VotingHeaderProps) => {
  return (
    <div className="text-center mb-12">
      {isVotingOpen ? (
        <div className="space-y-4">
          <h1 className="text-4xl font-bold mb-4 golden-reflection">
            Votez pour vos favoris
          </h1>
          <h2 className="text-xl text-muted-foreground">
            Découvrez les nominés et votez pour vos favoris dans chaque catégorie
          </h2>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-4xl font-bold mb-4 golden-reflection">
            Les votes ne sont pas encore ouverts
          </h1>
          <h2 className="text-xl text-muted-foreground">
            Revenez bientôt pour découvrir les nominés et voter pour vos favoris
          </h2>
        </div>
      )}
    </div>
  );
};