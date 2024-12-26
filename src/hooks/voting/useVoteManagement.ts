import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVoteManagement = (userEmail: string | undefined, isVotingOpen: boolean) => {
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const loadPreviousVotes = async (email: string): Promise<Record<string, string>> => {
    try {
      console.log("Tentative de chargement des votes pour:", email);
      
      // First check if email is validated
      const { data: validatedEmail, error: validationError } = await supabase
        .from('validated_emails')
        .select('email')
        .eq('email', email)
        .single();

      if (validationError || !validatedEmail) {
        console.error('Email non validé:', validationError);
        toast({
          variant: "destructive",
          title: "Accès non autorisé",
          description: "Votre email n'a pas été validé pour voter.",
        });
        return {};
      }

      const { data: previousVotes, error } = await supabase
        .from('votes')
        .select('category_id, nominee_id')
        .eq('email', email);

      if (error) {
        console.error('Erreur Supabase:', error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger vos votes précédents. Veuillez réessayer.",
        });
        return {};
      }

      if (previousVotes && previousVotes.length > 0) {
        const votesMap = previousVotes.reduce((acc, vote) => ({
          ...acc,
          [vote.category_id]: vote.nominee_id,
        }), {});
        
        setSelectedNominees(votesMap);
        console.log("Votes précédents chargés avec succès:", votesMap);
        return votesMap;
      }
      
      return {};
    } catch (error) {
      console.error('Erreur lors du chargement des votes précédents:', error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "La connexion au serveur a échoué. Veuillez vérifier votre connexion internet.",
      });
      return {};
    }
  };

  const handleNomineeSelect = async (categoryId: string, nomineeId: string): Promise<void> => {
    console.log("Début du vote...", { categoryId, nomineeId, userEmail, isVotingOpen });

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
      // First check if email is validated
      const { data: validatedEmail, error: validationError } = await supabase
        .from('validated_emails')
        .select('email')
        .eq('email', userEmail)
        .single();

      if (validationError || !validatedEmail) {
        toast({
          variant: "destructive",
          title: "Accès non autorisé",
          description: "Votre email n'a pas été validé pour voter.",
        });
        return;
      }

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
    loadPreviousVotes,
  };
};