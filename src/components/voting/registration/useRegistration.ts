import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: existingEmail } = await supabase
        .from("validated_emails")
        .select("*")
        .eq("email", formData.email)
        .maybeSingle();

      if (existingEmail) {
        localStorage.setItem('userEmail', formData.email);
        onClose();

        const { data: existingVotes } = await supabase
          .from("votes")
          .select("*")
          .eq("email", formData.email);

        if (existingVotes && existingVotes.length > 0) {
          toast({
            title: "Votes existants détectés",
            description: "Vous pouvez maintenant modifier vos votes.",
          });
        } else {
          toast({
            title: "🎉 Inscription réussie !",
            description: "C'est parti ! Votez pour vos favoris dans chaque catégorie. Votre voix compte !",
          });
        }
        navigate("/categories");
      } else {
        const { error } = await supabase
          .from("validated_emails")
          .insert([
            {
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          ]);

        if (error) throw error;
        
        localStorage.setItem('userEmail', formData.email);
        onClose();
        toast({
          title: "🎉 Inscription réussie !",
          description: "C'est parti ! Votez pour vos favoris dans chaque catégorie. Votre voix compte !",
        });
        if (onSuccess) onSuccess();
        navigate("/categories");
      }
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation.",
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