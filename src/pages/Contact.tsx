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
      const { error: contactError } = await supabase
        .from('contact_attempts')
        .insert([{ email, success: true }]);

      if (contactError) throw contactError;

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message envoyé !",
        description: "Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.",
        variant: "default",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 sm:py-12 px-4 sm:px-6 animate-fade-in relative">
      <div className="gold-halo" />
      
      <div className="text-center mb-8 sm:mb-12 relative z-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 golden-reflection animate-fade-in">Contact</h1>
        <p className="text-lg sm:text-xl text-gold/80 animate-fade-in delay-100">Une question ? N'hésitez pas à nous contacter</p>
      </div>

      <div className="relative z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-xl" />
        
        <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gold/90 text-lg">Nom</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Votre nom" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300 h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gold/90 text-lg">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="votre@email.com" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300 h-12 text-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gold/90 text-lg">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Votre message"
                className="min-h-[150px] sm:min-h-[200px] bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300 text-lg resize-none"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light transition-all duration-300 text-navy font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
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