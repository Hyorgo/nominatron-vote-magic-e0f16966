import { Trophy } from "lucide-react";
import { ActionCard } from "./ActionCard";
import type { VotingStatus } from "@/hooks/useVotingStatus";

interface VotingCardProps {
  votingStatus: VotingStatus;
}

export const VotingCard = ({ votingStatus }: VotingCardProps) => {
  const { isVotingOpen, votingNotStarted, votingEnded } = votingStatus;

  console.log("État des votes (VotingCard):", {
    isVotingOpen,
    votingNotStarted,
    votingEnded,
  });

  const getVotingCardContent = () => {
    // Vérifions d'abord si les votes sont terminés
    if (votingEnded) {
      return {
        title: "Les votes sont terminés",
        subtitle: "Merci à tous les participants ! Les résultats seront bientôt annoncés.",
        showButton: false,
        votingNotStarted: false
      };
    }
    
    // Ensuite, vérifions si les votes n'ont pas commencé
    if (votingNotStarted) {
      return {
        title: "Les votes ne sont pas encore ouverts",
        subtitle: "Inscrivez-vous pour être notifié dès l'ouverture des votes et ne manquez pas l'occasion de soutenir vos favoris !",
        showButton: false,
        votingNotStarted: true
      };
    }
    
    // Par défaut, si les votes sont ouverts
    return {
      title: "Les votes sont ouverts !",
      subtitle: "C'est le moment de soutenir vos favoris ! Votez maintenant et faites entendre votre voix.",
      showButton: true,
      votingNotStarted: false
    };
  };

  const cardContent = getVotingCardContent();

  return (
    <ActionCard
      icon={Trophy}
      {...cardContent}
      buttonText="Voter maintenant"
      to="/categories"
    />
  );
};