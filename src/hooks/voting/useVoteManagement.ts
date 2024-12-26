import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVoteManagement = (userEmail: string | undefined, isVotingOpen: boolean) => {
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const loadPreviousVotes = async (email: string) => {
    try {
      const { data: previousVotes, error } = await supabase
        .from('votes')
        .select('category_id, nominee_id')
        .eq('email', email);

      if (error) throw error;

      if (previousVotes && previousVotes.length > 0) {
        const votesMap = previousVotes.reduce((acc, vote) => ({
          ...acc,
          [vote.category_id]: vote.nominee_id,
        }), {});
        
        setSelectedNominees(votesMap);
        console.log("Votes précédents chargés:", votesMap);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des votes précédents:', error);
    }
  };

  const handleNomineeSelect = async (categoryId: string, nomineeId: string): Promise<void> => {
    console.log("Début du vote...", { categoryId, nomineeId, userEmail, isVotingOpen });

    if (!isVotingOpen) {
      const error = new Error("Les votes ne sont pas ouverts actuellement");
      console.error(error);
      toast({
        variant: "destructive",
        title: "Votes fermés",
        description: "Les votes ne sont pas ouverts actuellement.",
      });
      throw error;
    }

    if (!userEmail) {
      const error = new Error("Vous devez être connecté avec un email validé pour voter");
      console.error(error);
      toast({
        variant: "destructive",
        title: "Non connecté",
        description: "Vous devez être connecté avec un email validé pour voter.",
      });
      throw error;
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
        console.error('Erreur lors du vote:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement de votre vote.",
        });
        throw error;
      }

      setSelectedNominees(prev => ({
        ...prev,
        [categoryId]: nomineeId,
      }));
      
      console.log("Vote enregistré avec succès:", { categoryId, nomineeId });
      
      toast({
        title: "Vote enregistré",
        description: "Votre vote a été enregistré avec succès.",
      });
    } catch (error) {
      console.error('Erreur détaillée lors du vote:', error);
      throw error;
    }
  };

  return {
    selectedNominees,
    handleNomineeSelect,
    loadPreviousVotes,
  };
};