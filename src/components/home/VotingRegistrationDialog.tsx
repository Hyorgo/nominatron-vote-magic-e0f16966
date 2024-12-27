import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface VotingRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VotingRegistrationDialog = ({ 
  open, 
  onOpenChange 
}: VotingRegistrationDialogProps) => {
  const [formData, setFormData] = useState({
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
      // Vérifier si l'email existe déjà dans validated_emails
      const { data: existingEmail } = await supabase
        .from("validated_emails")
        .select("*")
        .eq("email", formData.email)
        .maybeSingle();

      if (existingEmail) {
        // Email déjà validé, vérifier s'il y a des votes existants
        const { data: existingVotes } = await supabase
          .from("votes")
          .select("*")
          .eq("email", formData.email);

        localStorage.setItem('userEmail', formData.email);
        onOpenChange(false);

        if (existingVotes && existingVotes.length > 0) {
          toast({
            title: "Votes existants détectés",
            description: "Vous pouvez maintenant modifier vos votes.",
          });
        } else {
          toast({
            title: "Email vérifié",
            description: "Vous pouvez maintenant voter pour vos favoris.",
          });
        }
        navigate("/categories");
      } else {
        // Ajouter le nouvel email validé
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
        onOpenChange(false);
        toast({
          title: "Inscription réussie",
          description: "Vous pouvez maintenant voter pour vos favoris.",
        });
        navigate("/categories");
      }
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscription pour voter</DialogTitle>
          <DialogDescription>
            Veuillez renseigner vos informations pour participer aux votes.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};