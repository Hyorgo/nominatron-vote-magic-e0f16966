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
  const [selectedNominees, setSelectedNominees] = useState<Record<number, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadVotingConfig();
  }, []);

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
        
        console.log("Dates de vote:", {
          maintenant: now.toLocaleString(),
          debut: startDate.toLocaleString(),
          fin: endDate.toLocaleString(),
          votesOuverts: now >= startDate && now <= endDate
        });

        setVotingConfig(config);
        setIsVotingOpen(now >= startDate && now <= endDate);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

  const handleNomineeSelect = (categoryId: number, nomineeId: number) => {
    if (!isVotingOpen) return;

    setSelectedNominees((prev) => ({
      ...prev,
      [categoryId]: nomineeId,
    }));
    
    toast({
      title: "Vote enregistré",
      description: "Votre choix a été sauvegardé",
    });
  };

  return {
    votingConfig,
    isVotingOpen,
    selectedNominees,
    handleNomineeSelect,
  };
};