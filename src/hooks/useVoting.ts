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
    enabled: !!userEmail && isVotingOpen,
    staleTime: Infinity, // Les données restent fraîches jusqu'à invalidation manuelle
    gcTime: Infinity, // Garde en cache jusqu'à invalidation manuelle
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false, // Désactive les tentatives de nouvelle requête en cas d'erreur
  });

  // Synchronisation des votes avec l'état local une seule fois au chargement
  useEffect(() => {
    if (votes && Object.keys(votes).length > 0) {
      console.log("Initialisation de l'état local avec les votes:", votes);
      setSelectedNominees(votes);
    }
  }, []);

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
      // Mise à jour optimiste de l'état local
      setSelectedNominees(prev => ({
        ...prev,
        [categoryId]: nomineeId,
      }));

      // Mise à jour du cache avant la requête
      queryClient.setQueryData(['previousVotes', userEmail], (oldData: any) => ({
        ...oldData,
        [categoryId]: nomineeId,
      }));

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
        // En cas d'erreur, on revient à l'état précédent
        console.error('Erreur Supabase lors du vote:', error);
        setSelectedNominees(prev => {
          const newState = { ...prev };
          delete newState[categoryId];
          return newState;
        });
        
        // On invalide le cache pour forcer un rechargement
        queryClient.invalidateQueries({ 
          queryKey: ['previousVotes', userEmail],
          exact: true 
        });

        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement de votre vote.",
        });
        return;
      }

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