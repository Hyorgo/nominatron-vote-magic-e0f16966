import { useVotingConfig } from "./voting/useVotingConfig";
import { useVoteManagement } from "./voting/useVoteManagement";
import { useEmailSession } from "./voting/useEmailSession";
import { usePreviousVotes } from "./voting/usePreviousVotes";
import { useQuery } from "@tanstack/react-query";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useEmailSession();
  const { selectedNominees, handleNomineeSelect, loadPreviousVotes } = useVoteManagement(
    userEmail || undefined,
    isVotingOpen
  );

  // Utiliser React Query pour mettre en cache les résultats et éviter les requêtes répétées
  const { data: previousVotes } = useQuery({
    queryKey: ['previousVotes', userEmail],
    queryFn: async () => {
      if (!userEmail) return {};
      const votes = await loadPreviousVotes(userEmail);
      return votes || {};
    },
    enabled: !!userEmail,
    staleTime: 30000, // Considérer les données comme fraîches pendant 30 secondes
    gcTime: 5 * 60 * 1000, // Garder en cache pendant 5 minutes (anciennement cacheTime)
  });

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees: previousVotes || selectedNominees,
    handleNomineeSelect,
    userEmail,
  };
};