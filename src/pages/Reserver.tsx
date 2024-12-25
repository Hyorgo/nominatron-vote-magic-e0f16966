import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { EventInfoCard } from "@/components/event/EventInfoCard";
import { supabase } from "@/integrations/supabase/client";

const Reserver = () => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const reservationData = {
      firstName: formData.get('name') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      numberOfTickets: parseInt(formData.get('guests') as string),
    };

    try {
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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(reservationData),
        }
      );

      const { url, error } = await response.json();

      if (error) throw new Error(error);
      if (url) window.location.href = url;

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre réservation.",
        variant: "destructive",
      });
      console.error('Erreur de réservation:', error);
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
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light transition-all duration-300 text-navy font-semibold py-6"
              >
                Réserver maintenant
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reserver;