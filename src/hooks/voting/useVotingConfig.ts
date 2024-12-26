import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VotingConfig {
  start_date: string;
  end_date: string;
}

export const useVotingConfig = () => {
  const [votingConfig, setVotingConfig] = useState<VotingConfig | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const { toast } = useToast();

  const loadVotingConfig = async () => {
    try {
      const { data: configs, error } = await supabase
        .from('voting_config')
        .select('start_date, end_date')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
        return;
      }

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

  useEffect(() => {
    loadVotingConfig();
  }, []);

  return {
    votingConfig,
    isVotingOpen,
  };
};