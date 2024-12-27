import { useVotingConfig } from "./voting/useVotingConfig";
import { useEmailSession } from "./voting/useEmailSession";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useEmailSession();
  const queryClient = useQueryClient();

  const { data: selectedNominees = {} } = useQuery({
    queryKey: ['previousVotes', userEmail],
    queryFn: async () => {
      if (!userEmail) {
        console.log("Pas d'email utilisateur, skip du chargement des votes");
        return {};
      }
      
      console.log("Chargement des votes pour:", userEmail);
      const { data: votes, error } = await supabase
        .from('votes')
        .select('category_id, nominee_id')
        .eq('email', userEmail);

      if (error) {
        console.error("Erreur lors du chargement des votes:", error);
        throw error;
      }

      const votesMap = votes?.reduce((acc, vote) => ({
        ...acc,
        [vote.category_id]: vote.nominee_id,
      }), {}) || {};

      console.log("Votes chargés:", votesMap);
      return votesMap;
    },
    enabled: !!userEmail && isVotingOpen,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  const handleNomineeSelect = async (categoryId: string, nomineeId: string) => {
    if (!isVotingOpen) {
      console.log("Les votes sont fermés");
      return;
    }

    if (!userEmail) {
      console.log("Utilisateur non connecté");
      return;
    }

    try {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['previousVotes', userEmail], (old: Record<string, string> = {}) => ({
        ...old,
        [categoryId]: nomineeId,
      }));

      // Enregistrement du vote
      const { error } = await supabase
        .from('votes')
        .upsert({
          email: userEmail,
          category_id: categoryId,
          nominee_id: nomineeId,
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement du vote:", error);
        // Invalider le cache en cas d'erreur
        queryClient.invalidateQueries({ queryKey: ['previousVotes', userEmail] });
        throw error;
      }

      console.log("Vote enregistré avec succès");
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      throw error;
    }
  };

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees,
    handleNomineeSelect,
    userEmail,
  };
};