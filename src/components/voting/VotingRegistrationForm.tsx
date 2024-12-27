import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface VotingRegistrationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const VotingRegistrationForm = ({ onClose, onSuccess }: VotingRegistrationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Validation en cours..." : "Valider"}
      </Button>
    </form>
  );
};