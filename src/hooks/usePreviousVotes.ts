import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePreviousVotes = (email: string, onVotesLoaded: (votes: Record<string, string>) => void) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadPreviousVotes = async () => {
      if (email) {
        try {
          const { data: previousVotes, error } = await supabase
            .from("votes")
            .select("category_id, nominee_id")
            .eq("email", email);

          if (error) throw error;

          if (previousVotes) {
            const votesMap = previousVotes.reduce((acc, vote) => ({
              ...acc,
              [vote.category_id]: vote.nominee_id,
            }), {});
            
            onVotesLoaded(votesMap);
            
            toast({
              title: "Votes précédents chargés",
              description: "Vos votes précédents ont été restaurés.",
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement des votes:", error);
        }
      }
    };

    loadPreviousVotes();
  }, [email, onVotesLoaded, toast]);
};