import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useVoteManagement = (userEmail: string | undefined, isVotingOpen: boolean) => {
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleNomineeSelect = async (categoryId: string, nomineeId: string): Promise<void> => {
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
  };

  return {
    selectedNominees,
    handleNomineeSelect,
  };
};