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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: existingEmail } = await supabase
        .from("validated_emails")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (existingEmail) {
        // Store the email in localStorage for persistence
        localStorage.setItem('userEmail', formData.email);
        
        // Emit a custom event to notify other components
        window.dispatchEvent(new CustomEvent('emailValidated', { 
          detail: { email: formData.email }
        }));
        
        onClose();
        toast({
          title: "Email déjà enregistré",
          description: "Vos votes précédents ont été restaurés.",
        });
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
        
        // Store the email in localStorage for persistence
        localStorage.setItem('userEmail', formData.email);
        
        // Emit a custom event to notify other components
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
        description: "Une erreur est survenue lors de la validation.",
      });
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
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
        />
      </div>
      <Button type="submit" className="w-full">
        Valider
      </Button>
    </form>
  );
};