import { useVotingConfig } from "./voting/useVotingConfig";
import { useVoteManagement } from "./voting/useVoteManagement";
import { useEmailSession } from "./voting/useEmailSession";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useEmailSession();
  const queryClient = useQueryClient();
  const { selectedNominees, handleNomineeSelect } = useVoteManagement(
    userEmail || undefined,
    isVotingOpen
  );

  // Vérifier si l'email est validé
  const { data: isEmailValidated } = useQuery({
    queryKey: ['emailValidation', userEmail],
    queryFn: async () => {
      if (!userEmail) return false;
      const { data } = await supabase
        .from('validated_emails')
        .select('email')
        .eq('email', userEmail)
        .maybeSingle();
      return !!data;
    },
    enabled: !!userEmail,
    staleTime: 5 * 60 * 1000, // Cache valide pendant 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  // Charger les votes précédents
  const { data: previousVotes = {} } = useQuery({
    queryKey: ['previousVotes', userEmail],
    queryFn: async () => {
      if (!userEmail || !isEmailValidated) return {};
      
      console.log("Chargement des votes pour:", userEmail);
      const { data: votes } = await supabase
        .from('votes')
        .select('category_id, nominee_id')
        .eq('email', userEmail);

      if (!votes) return {};

      return votes.reduce((acc, vote) => ({
        ...acc,
        [vote.category_id]: vote.nominee_id,
      }), {});
    },
    enabled: !!userEmail && !!isEmailValidated,
    staleTime: 30000, // Cache valide pendant 30 secondes
    gcTime: 5 * 60 * 1000,
  });

  // Précharger les données quand l'email est validé
  if (isEmailValidated && userEmail) {
    queryClient.prefetchQuery({
      queryKey: ['previousVotes', userEmail],
      queryFn: async () => {
        const { data: votes } = await supabase
          .from('votes')
          .select('category_id, nominee_id')
          .eq('email', userEmail);
        return votes || [];
      },
    });
  }

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees: previousVotes,
    handleNomineeSelect,
    userEmail,
  };
};