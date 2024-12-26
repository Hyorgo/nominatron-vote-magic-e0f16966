import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VotingConfig {
  start_date: string;
  end_date: string;
}

export const useVotingConfig = () => {
  const { toast } = useToast();

  const { data: votingConfig, isLoading } = useQuery({
    queryKey: ['votingConfig'],
    queryFn: async () => {
      console.log("Chargement de la configuration des votes...");
      const { data: configs, error } = await supabase
        .from('voting_config')
        .select('start_date, end_date')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
        throw error;
      }

      if (configs) {
        const now = new Date();
        const startDate = new Date(configs.start_date);
        const endDate = new Date(configs.end_date);
        
        console.log("Configuration des votes:", {
          maintenant: now.toLocaleString(),
          debut: startDate.toLocaleString(),
          fin: endDate.toLocaleString(),
          votesOuverts: now >= startDate && now <= endDate
        });

        return configs;
      }
      return null;
    },
    staleTime: Infinity, // La config ne change pas souvent
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const isVotingOpen = (() => {
    if (!votingConfig) return false;
    
    const now = new Date();
    const startDate = new Date(votingConfig.start_date);
    const endDate = new Date(votingConfig.end_date);
    
    return now >= startDate && now <= endDate;
  })();

  return {
    votingConfig,
    isVotingOpen,
    isLoading
  };
};