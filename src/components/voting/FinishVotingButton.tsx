import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface FinishVotingButtonProps {
  selectedNominees: Record<string, string>;
  categories: { id: string }[];
}

export const FinishVotingButton = ({ selectedNominees, categories }: FinishVotingButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFinishVoting = () => {
    const missingVotes = categories.filter(category => !selectedNominees[category.id]);
    
    if (missingVotes.length > 0) {
      toast({
        variant: "destructive",
        title: "Votes incomplets",
        description: "Veuillez voter dans toutes les catégories avant de terminer",
      });
      return;
    }

    toast({
      title: "Votes terminés",
      description: "Merci d'avoir participé aux votes !",
    });

    // Redirection vers la page de remerciement
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