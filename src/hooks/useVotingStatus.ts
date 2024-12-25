import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VotingStatus {
  isVotingOpen: boolean;
  votingNotStarted: boolean;
  votingEnded: boolean;
}

export const useVotingStatus = () => {
  const [status, setStatus] = useState<VotingStatus>({
    isVotingOpen: false,
    votingNotStarted: false,
    votingEnded: false
  });

  useEffect(() => {
    checkVotingPeriod();
  }, []);

  const checkVotingPeriod = async () => {
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
        
        const nowTs = now.getTime();
        const startTs = startDate.getTime();
        const endTs = endDate.getTime();
        
        console.log("État des votes (useVotingStatus):", {
          maintenant: now.toLocaleString(),
          debut: startDate.toLocaleString(),
          fin: endDate.toLocaleString(),
          votesOuverts: nowTs >= startTs && nowTs <= endTs,
          votesNonCommences: nowTs < startTs,
          votesTermines: nowTs > endTs,
          timestamps: {
            now: nowTs,
            start: startTs,
            end: endTs
          }
        });

        // Mise à jour de la logique pour déterminer l'état des votes
        const isVotingOpen = nowTs >= startTs && nowTs <= endTs;
        const votingNotStarted = nowTs < startTs;
        const votingEnded = nowTs > endTs;
        
        setStatus({
          isVotingOpen,
          votingNotStarted,
          votingEnded
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

  return status;
};