import { useVotingConfig } from "./voting/useVotingConfig";
import { useEmailSession } from "./voting/useEmailSession";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export const useVoting = () => {
  const { votingConfig, isVotingOpen } = useVotingConfig();
  const { userEmail } = useEmailSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});

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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Charger les votes précédents
  const { data: votes = {} } = useQuery({
    queryKey: ['previousVotes', userEmail],
    queryFn: async () => {
      if (!userEmail || !isEmailValidated) {
        console.log("Email non validé ou manquant");
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

      if (!votes || votes.length === 0) {
        console.log("Aucun vote trouvé");
        return {};
      }

      const votesMap = votes.reduce((acc, vote) => ({
        ...acc,
        [vote.category_id]: vote.nominee_id,
      }), {});

      console.log("Votes trouvés:", votesMap);
      return votesMap;
    },
    enabled: !!userEmail && !!isEmailValidated,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Mettre à jour les votes sélectionnés quand les votes sont chargés
  useEffect(() => {
    if (votes && Object.keys(votes).length > 0) {
      console.log("Mise à jour des votes sélectionnés avec:", votes);
      setSelectedNominees(votes);
    }
  }, [votes]);

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
      // Vérifier si l'email est validé
      const { data: validatedEmail, error: validationError } = await supabase
        .from('validated_emails')
        .select('email')
        .eq('email', userEmail)
        .maybeSingle();

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

      // Mettre à jour l'état local
      setSelectedNominees(prev => ({
        ...prev,
        [categoryId]: nomineeId,
      }));
      
      // Invalider le cache pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: ['previousVotes', userEmail] });
      
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
    votingConfig,
    isVotingOpen,
    selectedNominees: { ...selectedNominees, ...votes },
    handleNomineeSelect,
    userEmail,
  };
};