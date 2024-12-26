import { useVotingConfig } from "./voting/useVotingConfig";
import { useVotingSession } from "./voting/useVotingSession";
import { useVoteManagement } from "./voting/useVoteManagement";
import { useEffect, useState } from "react";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem('userEmail')
  );
  const { selectedNominees, handleNomineeSelect, loadPreviousVotes } = useVoteManagement(userEmail || undefined, isVotingOpen);

  useEffect(() => {
    // Charger l'email depuis le localStorage au démarrage
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    // Écouter les changements d'email
    const handleEmailValidated = (event: CustomEvent) => {
      setUserEmail(event.detail.email);
    };

    window.addEventListener('emailValidated', handleEmailValidated as EventListener);

    return () => {
      window.removeEventListener('emailValidated', handleEmailValidated as EventListener);
    };
  }, []);

  useEffect(() => {
    if (userEmail) {
      loadPreviousVotes(userEmail);
    }
  }, [userEmail]);

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees,
    handleNomineeSelect,
    userEmail,
  };
};