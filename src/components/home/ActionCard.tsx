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
      // Enregistrer l'email dans la base de données
      const { error: dbError } = await supabase
        .from('vote_opening_notifications')
        .insert([{ email }]);

      if (dbError) throw dbError;

      // Envoyer l'email de confirmation
      const { error: emailError } = await supabase.functions.invoke('notify-vote-opening', {
        body: { email }
      });

      if (emailError) throw emailError;

      toast({
        title: "Inscription réussie",
        description: "Vous recevrez un email de confirmation dans quelques instants.",
      });
      setEmail("");
    } catch (error) {
      console.error('Error:', error);
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
    <div className="bg-card/80 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 flex flex-col h-full border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-card/90">
      <div className="flex-grow space-y-4">
        <Icon className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <div className="mt-6">
        {showButton && (
          <Button asChild className="w-full">
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
              className="bg-white/15 border-white/20"
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
    </div>
  );
};