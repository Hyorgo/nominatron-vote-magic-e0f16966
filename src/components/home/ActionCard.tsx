import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  buttonText: string;
  to: string;
  showButton?: boolean;
  votingNotStarted?: boolean;
}

export const ActionCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  buttonText, 
  to, 
  showButton = true,
  votingNotStarted = false 
}: ActionCardProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNotificationSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('vote_opening_notifications')
        .insert([{ email }]);

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Vous serez notifié par email lors de l'ouverture des votes.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 text-center space-y-4">
      <Icon className="w-12 h-12 mx-auto text-primary" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">
        {subtitle}
      </p>
      {showButton && (
        <Button asChild>
          <Link to={to}>{buttonText}</Link>
        </Button>
      )}
      {votingNotStarted && (
        <form onSubmit={handleNotificationSignup} className="space-y-2">
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "En cours..." : "M'avertir de l'ouverture"}
          </Button>
        </form>
      )}
    </div>
  );
};