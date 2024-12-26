import { useState } from "react";
import { useVotesCache } from "./useVotesCache";
import { useVoteNotifications } from "./useVoteNotifications";
import { useVoteSubmission } from "./useVoteSubmission";

export const useVoteManagement = (
  userEmail: string | undefined | null, 
  isVotingOpen: boolean
) => {
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});
  const { updateVoteCache, invalidateVoteCache } = useVotesCache(userEmail);
  const { 
    notifyVoteSuccess, 
    notifyVoteError, 
    notifyVotingClosed, 
    notifyNotAuthenticated 
  } = useVoteNotifications();
  const { submitVote } = useVoteSubmission();

  const handleNomineeSelect = async (categoryId: string, nomineeId: string): Promise<void> => {
    if (!isVotingOpen) {
      notifyVotingClosed();
      return;
    }

    if (!userEmail) {
      notifyNotAuthenticated();
      return;
    }

    try {
      // Mise à jour optimiste de l'état local
      setSelectedNominees(prev => ({
        ...prev,
        [categoryId]: nomineeId,
      }));

      // Mise à jour du cache
      updateVoteCache(categoryId, nomineeId);

      // Soumission du vote
      await submitVote(categoryId, nomineeId, userEmail);
      notifyVoteSuccess();
    } catch (error) {
      // Rollback en cas d'erreur
      setSelectedNominees(prev => {
        const newState = { ...prev };
        delete newState[categoryId];
        return newState;
      });
      
      invalidateVoteCache();
      notifyVoteError(error as Error);
    }
  };

  return {
    selectedNominees,
    handleNomineeSelect,
  };
};