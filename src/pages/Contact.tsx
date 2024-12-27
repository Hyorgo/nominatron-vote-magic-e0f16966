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
      // Log contact attempt in Supabase
      const { error: contactError } = await supabase
        .from('contact_attempts')
        .insert([{ email, success: true }]);

      if (contactError) throw contactError;

      // Send email via Supabase Edge Function
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message }
      });

      if (emailError) {
        throw emailError;
      }

      // Send data to webhook
      const webhookResponse = await fetch('https://hook.eu1.make.com/928slfvsbqrhwa6rqq8cqyr5p6pyv5g3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      if (!webhookResponse.ok) {
        throw new Error('Webhook request failed');
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
    <div className="min-h-screen relative">
      {/* Background effects container with proper z-index */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="fuchsia-halo absolute" />
        <div className="blue-halo absolute" />
        <div className="gold-halo absolute" />
      </div>

      {/* Main content with proper spacing for fixed header */}
      <div className="container max-w-2xl pt-24 pb-8 px-4 sm:px-6 relative z-[1]">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 golden-reflection">Contact</h1>
          <p className="text-lg text-gold/80">Une question ? N'hésitez pas à nous contacter</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-xl" />
          
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-5 sm:p-6 shadow-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                  className="min-h-[120px] bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300 text-lg resize-none"
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
    </div>
  );
};

export default Contact;