import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { EventInfoCard } from "@/components/event/EventInfoCard";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Reserver = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    const reservationData = {
      firstName: formData.get('name') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      numberOfTickets: parseInt(formData.get('guests') as string),
    };

    try {
      console.log('Envoi des données de réservation:', reservationData);

      // Vérifier la disponibilité des billets
      const { data: ticketsAvailable } = await supabase
        .rpc('check_tickets_availability', { 
          requested_tickets: reservationData.numberOfTickets 
        });

      if (!ticketsAvailable) {
        toast({
          title: "Erreur de réservation",
          description: "Désolé, il n'y a plus assez de billets disponibles.",
          variant: "destructive",
        });
        return;
      }

      // Créer la session de paiement Stripe
      console.log('Création de la session de paiement...');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: reservationData
      });

      console.log('Réponse de create-checkout:', data);

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        throw error;
      }

      if (!data?.url) {
        console.error('Pas d\'URL de paiement dans la réponse:', data);
        throw new Error('Pas d\'URL de paiement reçue');
      }

      console.log('Redirection vers:', data.url);
      // Utiliser window.location.href au lieu de assign
      window.location.href = data.url;

    } catch (error) {
      console.error('Erreur complète:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="gold-halo" />
      <div className="container max-w-2xl py-12 animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 golden-reflection">Réserver ma place</h1>
          <p className="text-gold/80">Toutes les informations de l'événement en un coup d'œil</p>
        </div>

        <div className="mb-8">
          <EventInfoCard />
        </div>

        <div className="text-center mb-8">
          <p className="text-gold/80">Rejoignez-nous pour une soirée exceptionnelle</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-xl" />
          
          <div className="relative bg-white/5 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gold/90">Prénom</Label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="Votre prénom" 
                    required 
                    className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gold/90">Nom</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    placeholder="Votre nom" 
                    required 
                    className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gold/90">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                    className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-gold/90">Nombre de personnes</Label>
                  <Input 
                    id="guests" 
                    name="guests"
                    type="number" 
                    min="1" 
                    max="10" 
                    defaultValue="1" 
                    required 
                    className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light transition-all duration-300 text-navy font-semibold py-6"
                disabled={isLoading}
              >
                {isLoading ? 'Traitement en cours...' : 'Réserver maintenant'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reserver;