import { Button } from "@/components/ui/button";

interface VotingHeaderProps {
  isVotingOpen: boolean;
  onOpenDialog: () => void;
}

export const VotingHeader = ({ isVotingOpen, onOpenDialog }: VotingHeaderProps) => {
  return (
    <div className="text-center mb-8">
      {isVotingOpen ? (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Découvrez les nominés et votez pour vos favoris dans chaque catégorie
          </h2>
          <Button 
            variant="default" 
            size="lg" 
            className="mb-8"
            onClick={onOpenDialog}
          >
            Voter maintenant
          </Button>
        </>
      ) : (
        <h2 className="text-2xl font-bold mb-4">
          Les votes ne sont pas encore ouverts. Revenez bientôt pour découvrir les nominés et voter pour vos favoris.
        </h2>
      )}
    </div>
  );
};