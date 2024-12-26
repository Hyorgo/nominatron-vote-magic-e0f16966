import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VotingConfig {
  start_date: string;
  end_date: string;
}

export const useVoting = () => {
  const [votingConfig, setVotingConfig] = useState<VotingConfig | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    loadVotingConfig();
    checkUserValidation();
  }, []);

  const checkUserValidation = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      
      if (email) {
        const { data: validatedEmail } = await supabase
          .from('validated_emails')
          .select('email')
          .eq('email', email)
          .single();

        if (validatedEmail) {
          setUserEmail(email);
          await loadPreviousVotes(email);
        } else {
          toast({
            variant: "destructive",
            title: "Email non validé",
            description: "Votre email n'a pas encore été validé pour voter.",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
    }
  };

  const loadVotingConfig = async () => {
    try {
      const { data: configs } = await supabase
        .from('voting_config')
        .select('start_date, end_date')
        .order('created_at', { ascending: false })
        .limit(1);

      if (configs && configs.length > 0) {
        const config = configs[0];
        const now = new Date();
        const startDate = new Date(config.start_date);
        const endDate = new Date(config.end_date);
        
        console.log("Configuration des votes:", {
          maintenant: now.toLocaleString(),
          debut: startDate.toLocaleString(),
          fin: endDate.toLocaleString(),
          votesOuverts: now >= startDate && now <= endDate
        });

        setVotingConfig(config);
        setIsVotingOpen(now >= startDate && now <= endDate);

        if (now < startDate) {
          toast({
            title: "Votes non commencés",
            description: "Les votes n'ont pas encore commencé.",
          });
        } else if (now > endDate) {
          toast({
            title: "Votes terminés",
            description: "La période de vote est terminée.",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

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
    if (!isVotingOpen) {
      toast({
        variant: "destructive",
        title: "Votes fermés",
        description: "Les votes ne sont pas ouverts actuellement.",
      });
      throw new Error("Les votes ne sont pas ouverts");
    }

    if (!userEmail) {
      toast({
        variant: "destructive",
        title: "Non connecté",
        description: "Vous devez être connecté avec un email validé pour voter.",
      });
      throw new Error("Utilisateur non connecté ou email non validé");
    }

    console.log("Début du vote...", { categoryId, nomineeId, userEmail });

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
    votingConfig,
    isVotingOpen,
    selectedNominees,
    handleNomineeSelect,
    userEmail,
  };
};