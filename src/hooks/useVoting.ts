import { useVotingConfig } from "./voting/useVotingConfig";
import { useEmailSession } from "./voting/useEmailSession";
import { useVoteManagement } from "./voting/useVoteManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useEmailSession();
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});
  
  // Chargement des votes précédents
  const { data: previousVotes } = useQuery({
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
  });

  // Synchronisation des votes précédents avec l'état local
  useEffect(() => {
    if (previousVotes) {
      console.log("Mise à jour des votes sélectionnés:", previousVotes);
      setSelectedNominees(previousVotes);
    }
  }, [previousVotes]);

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
      // Mise à jour optimiste
      setSelectedNominees(prev => ({
        ...prev,
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
        // Annulation de la mise à jour optimiste en cas d'erreur
        setSelectedNominees(prev => {
          const newState = { ...prev };
          delete newState[categoryId];
          return newState;
        });
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