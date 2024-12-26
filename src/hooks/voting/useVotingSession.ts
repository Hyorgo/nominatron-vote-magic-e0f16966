import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVotingSession = () => {
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        checkUserValidation(session.user.email);
      } else {
        setUserEmail(undefined);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      checkUserValidation(session.user.email);
    }
  };

  const checkUserValidation = async (email: string) => {
    try {
      const { data: validatedEmail, error } = await supabase
        .from('validated_emails')
        .select('email')
        .eq('email', email)
        .single();

      if (error) {
        console.error("Erreur lors de la vérification de l'email:", error);
        return;
      }

      if (validatedEmail) {
        console.log("Email validé:", email);
        setUserEmail(email);
      } else {
        console.log("Email non validé:", email);
        toast({
          variant: "destructive",
          title: "Email non validé",
          description: "Votre email n'a pas encore été validé pour voter.",
        });
        setUserEmail(undefined);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
    }
  };

  return { userEmail };
};