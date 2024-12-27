import { Trophy } from "lucide-react";
import { ActionCard } from "./ActionCard";
import type { VotingStatus } from "@/hooks/useVotingStatus";
import { useState, useEffect } from "react";
import { VotingRegistrationDialog } from "./VotingRegistrationDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface VotingCardProps {
  votingStatus: VotingStatus;
}

export const VotingCard = ({ votingStatus }: VotingCardProps) => {
  const { isVotingOpen, votingNotStarted, votingEnded } = votingStatus;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      checkExistingVotes(storedEmail);
      setUserEmail(storedEmail);
    }
  }, []);

  const checkExistingVotes = async (email: string) => {
    try {
      const { data: votes } = await supabase
        .from('votes')
        .select('id')
        .eq('email', email)
        .limit(1);
      
      setHasVoted(votes && votes.length > 0);
    } catch (error) {
      console.error("Erreur lors de la vérification des votes:", error);
    }
  };

  const handleModifyVotes = () => {
    navigate('/categories');
  };

  const getVotingCardContent = () => {
    if (votingEnded) {
      return {
        title: "Les votes sont terminés",
        subtitle: "Merci à tous les participants ! Les résultats seront bientôt annoncés.",
        showButton: false,
        votingNotStarted: false
      };
    }
    
    if (votingNotStarted) {
      return {
        title: "Les votes ne sont pas encore ouverts",
        subtitle: "Inscrivez-vous pour être notifié dès l'ouverture des votes et ne manquez pas l'occasion de soutenir vos favoris !",
        showButton: false,
        votingNotStarted: true
      };
    }
    
    return {
      title: "Les votes sont ouverts !",
      subtitle: hasVoted 
        ? "Vous avez déjà voté. Vous pouvez modifier vos votes si vous le souhaitez."
        : "C'est le moment de soutenir vos favoris ! Votez maintenant et faites entendre votre voix.",
      showButton: true,
      votingNotStarted: false
    };
  };

  const cardContent = getVotingCardContent();

  return (
    <>
      <ActionCard
        icon={Trophy}
        {...cardContent}
        buttonText={hasVoted ? undefined : "Voter maintenant"}
        onClick={hasVoted ? undefined : () => setDialogOpen(true)}
      >
        {hasVoted && (
          <Button 
            onClick={handleModifyVotes}
            className="w-full mt-4"
          >
            Modifier mes votes
          </Button>
        )}
      </ActionCard>
      <VotingRegistrationDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      />
    </>
  );
};