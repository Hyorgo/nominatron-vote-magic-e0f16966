import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEmailSession = () => {
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem('userEmail')
  );

  const { data: isEmailValidated } = useQuery({
    queryKey: ['emailValidation', userEmail],
    queryFn: async () => {
      if (!userEmail) return false;
      
      console.log("Vérification de la validation de l'email:", userEmail);
      const { data, error } = await supabase
        .from('validated_emails')
        .select('email')
        .eq('email', userEmail)
        .single();

      if (error) {
        console.error("Erreur lors de la vérification de l'email:", error);
        return false;
      }

      return !!data;
    },
    enabled: !!userEmail,
    staleTime: 5 * 60 * 1000, // Cache de 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    const handleEmailValidated = (event: CustomEvent) => {
      setUserEmail(event.detail.email);
    };

    window.addEventListener('emailValidated', handleEmailValidated as EventListener);

    return () => {
      window.removeEventListener('emailValidated', handleEmailValidated as EventListener);
    };
  }, []);

  return { 
    userEmail,
    isEmailValidated 
  };
};