import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FinishVotingButtonProps {
  selectedNominees: Record<string, string>;
  categories: { id: string }[];
}

export const FinishVotingButton = ({ selectedNominees, categories }: FinishVotingButtonProps) => {
  const navigate = useNavigate();

  const handleFinishVoting = () => {
    // Redirection directe vers la page de remerciement sans vérification
    navigate("/thank-you");
  };

  return (
    <div className="mt-8 flex justify-center">
      <Button 
        onClick={handleFinishVoting}
        size="lg"
        className="animate-pulse hover:animate-none"
      >
        <Check className="mr-2 h-5 w-5" />
        Terminer mes votes
      </Button>
    </div>
  );
};