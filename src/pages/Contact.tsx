import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;

    try {
      // Enregistrer la tentative de contact
      const { error: contactError } = await supabase
        .from('contact_attempts')
        .insert([{ email, success: true }]);

      if (contactError) throw contactError;

      // Envoyer l'email via la fonction Edge
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ name, email, message }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-12 animate-fade-in relative z-10">
      {/* Gold halo effect */}
      <div className="gold-halo" />
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 golden-reflection">Contact</h1>
        <p className="text-gold/80">Une question ? N'hésitez pas à nous contacter</p>
      </div>

      <div className="relative">
        {/* Effet de halo derrière le formulaire */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-xl" />
        
        {/* Formulaire avec effet glassmorphism */}
        <div className="relative bg-white/5 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gold/90">Nom</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Votre nom" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gold/90">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="votre@email.com" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gold/90">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Votre message"
                className="min-h-[150px] bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light transition-all duration-300 text-navy font-semibold py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;