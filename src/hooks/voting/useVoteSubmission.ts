import { supabase } from "@/integrations/supabase/client";

export const useVoteSubmission = () => {
  const submitVote = async (
    categoryId: string, 
    nomineeId: string, 
    userEmail: string
  ) => {
    console.log("Tentative de vote...", { categoryId, nomineeId, userEmail });
    
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
      throw error;
    }

    console.log("Vote enregistré avec succès:", { categoryId, nomineeId });
  };

  return { submitVote };
};