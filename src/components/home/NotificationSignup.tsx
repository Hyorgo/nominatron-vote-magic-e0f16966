import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NotificationSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNotificationSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error: dbError } = await supabase
        .from('vote_opening_notifications')
        .insert([{ email }]);

      if (dbError) throw dbError;

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
  );
};