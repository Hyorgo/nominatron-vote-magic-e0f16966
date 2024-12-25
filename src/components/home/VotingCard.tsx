import { Trophy } from "lucide-react";
import { ActionCard } from "./ActionCard";
import type { VotingStatus } from "@/hooks/useVotingStatus";
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface VotingCardProps {
  votingStatus: VotingStatus;
}

export const VotingCard = ({ votingStatus }: VotingCardProps) => {
  const { isVotingOpen, votingNotStarted, votingEnded } = votingStatus;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Vérifier si l'email existe déjà dans validated_emails
      const { data: existingEmail } = await supabase
        .from("validated_emails")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (existingEmail) {
        // Email déjà validé, fermer le dialogue et rediriger
        setDialogOpen(false);
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
        
        setDialogOpen(false);
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
    }
  };

  const getVotingCardContent = () => {
    if (votingEnded) {
      return {
        title: "Les votes sont terminés",
        subtitle: "Merci à tous les participants ! Les résultats seront bientôt annoncés.",
        showButton: false,
        votingNotStarted: false
      };
    }
    
    if (votingNotStarted) {
      return {
        title: "Les votes ne sont pas encore ouverts",
        subtitle: "Inscrivez-vous pour être notifié dès l'ouverture des votes et ne manquez pas l'occasion de soutenir vos favoris !",
        showButton: false,
        votingNotStarted: true
      };
    }
    
    return {
      title: "Les votes sont ouverts !",
      subtitle: "C'est le moment de soutenir vos favoris ! Votez maintenant et faites entendre votre voix.",
      showButton: true,
      votingNotStarted: false
    };
  };

  const cardContent = getVotingCardContent();

  return (
    <>
      <ActionCard
        icon={Trophy}
        {...cardContent}
        buttonText="Voter maintenant"
        onClick={() => setDialogOpen(true)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
        </DialogContent>
      </Dialog>
    </>
  );
};