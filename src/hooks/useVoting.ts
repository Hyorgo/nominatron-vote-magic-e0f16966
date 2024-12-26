import { useVotingConfig } from "./voting/useVotingConfig";
import { useEmailSession } from "./voting/useEmailSession";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useEmailSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});

  // Optimisation du chargement des votes avec staleTime et cacheTime
  const { data: votes = {} } = useQuery({
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
    enabled: !!userEmail,
    staleTime: 30000, // Les données restent fraîches pendant 30 secondes
    gcTime: 5 * 60 * 1000, // Garde en cache pendant 5 minutes
    refetchOnWindowFocus: false,
  });

  // Synchronisation des votes avec l'état local
  useEffect(() => {
    if (votes && Object.keys(votes).length > 0) {
      console.log("Mise à jour de l'état local avec les votes:", votes);
      setSelectedNominees(prevState => ({
        ...prevState,
        ...votes
      }));
    }
  }, [votes]);

  const handleNomineeSelect = useCallback(async (categoryId: string, nomineeId: string) => {
    console.log("Tentative de vote...", { categoryId, nomineeId, userEmail, isVotingOpen });

    if (!isVotingOpen) {
      toast({
        variant: "destructive",
        title: "Votes fermés",
        description: "Les votes ne sont pas ouverts actuellement.",
      });
      return;
    }

    if (!userEmail) {
      toast({
        variant: "destructive",
        title: "Non connecté",
        description: "Vous devez être connecté avec un email validé pour voter.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('votes')
        .upsert(
          {
            category_id: categoryId,
            nominee_id: nomineeId,
            email: userEmail
          },
          {
            onConflict: 'category_id,email'
          }
        );

      if (error) {
        console.error('Erreur Supabase lors du vote:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement de votre vote.",
        });
        return;
      }

      // Mise à jour optimiste de l'état local
      setSelectedNominees(prev => ({
        ...prev,
        [categoryId]: nomineeId,
      }));

      // Invalider uniquement la requête spécifique
      await queryClient.invalidateQueries({ 
        queryKey: ['previousVotes', userEmail],
        exact: true,
      });

      console.log("Vote enregistré avec succès:", { categoryId, nomineeId });
      
      toast({
        title: "Vote enregistré",
        description: "Votre vote a été enregistré avec succès.",
      });
    } catch (error) {
      console.error('Erreur détaillée lors du vote:', error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "La connexion au serveur a échoué. Veuillez vérifier votre connexion internet.",
      });
    }
  }, [isVotingOpen, userEmail, queryClient, toast]);

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees,
    handleNomineeSelect,
    userEmail,
  };
};