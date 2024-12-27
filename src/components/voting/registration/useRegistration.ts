import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

export const useRegistration = (onClose: () => void, onSuccess?: () => void) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log("Tentative d'inscription avec:", formData);

      const { data: existingEmail, error: checkError } = await supabase
        .from("validated_emails")
        .select("*")
        .eq("email", formData.email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingEmail) {
        console.log("Email déjà validé:", formData.email);
        localStorage.setItem('userEmail', formData.email);
        window.dispatchEvent(new CustomEvent('emailValidated', { 
          detail: { email: formData.email }
        }));
        
        onClose();
        if (onSuccess) onSuccess();
      } else {
        console.log("Nouvel email, création de l'entrée");
        const { error: insertError } = await supabase
          .from("validated_emails")
          .insert([
            {
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          ]);

        if (insertError) throw insertError;
        
        localStorage.setItem('userEmail', formData.email);
        window.dispatchEvent(new CustomEvent('emailValidated', { 
          detail: { email: formData.email }
        }));
        
        onClose();
        if (onSuccess) onSuccess();
        toast({
          title: "Inscription réussie",
          description: "Vous pouvez maintenant voter pour vos favoris.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    isSubmitting,
    handleSubmit,
    handleFieldChange,
  };
};