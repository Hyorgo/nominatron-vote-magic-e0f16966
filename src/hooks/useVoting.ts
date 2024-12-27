import { useVotingConfig } from "./voting/useVotingConfig";
import { useEmailSession } from "./voting/useEmailSession";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useEmailSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: selectedNominees = {}, error: votesError } = useQuery({
    queryKey: ['previousVotes', userEmail],
    queryFn: async () => {
      if (!userEmail) {
        console.log("Pas d'email utilisateur, skip du chargement des votes");
        return {};
      }
      
      try {
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

        console.log("Votes chargés avec succès:", votesMap);
        return votesMap;
      } catch (error) {
        console.error("Erreur critique lors du chargement des votes:", error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger vos votes précédents. Veuillez réessayer.",
        });
        throw error;
      }
    },
    enabled: !!userEmail && isVotingOpen,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleNomineeSelect = async (categoryId: string, nomineeId: string) => {
    if (!isVotingOpen) {
      console.log("Les votes sont fermés");
      toast({
        variant: "destructive",
        title: "Votes fermés",
        description: "Les votes sont actuellement fermés.",
      });
      return;
    }

    if (!userEmail) {
      console.log("Utilisateur non connecté");
      toast({
        variant: "destructive",
        title: "Non connecté",
        description: "Veuillez vous connecter pour voter.",
      });
      return;
    }

    try {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['previousVotes', userEmail], (old: Record<string, string> = {}) => ({
        ...old,
        [categoryId]: nomineeId,
      }));

      // Utilisation de upsert pour gérer à la fois l'insertion et la mise à jour
      const { error } = await supabase
        .from('votes')
        .upsert(
          {
            email: userEmail,
            category_id: categoryId,
            nominee_id: nomineeId,
          },
          {
            onConflict: 'email,category_id',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;

      console.log("Vote enregistré avec succès");
      toast({
        title: "Vote enregistré",
        description: "Votre vote a été enregistré avec succès.",
      });

    } catch (error) {
      console.error("Erreur lors du vote:", error);
      // Invalider le cache en cas d'erreur
      queryClient.invalidateQueries({ queryKey: ['previousVotes', userEmail] });
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote. Veuillez réessayer.",
      });
      throw error;
    }
  };

  if (votesError) {
    console.error("Erreur de chargement des votes:", votesError);
  }

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees,
    handleNomineeSelect,
    userEmail,
  };
};