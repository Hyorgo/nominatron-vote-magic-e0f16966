import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EventInfoCard } from "@/components/event/EventInfoCard";
import { supabase } from "@/integrations/supabase/client";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { ReservationHeader } from "@/components/reservation/ReservationHeader";

const Reserver = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    const reservationData = {
      firstName: formData.get('name') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      numberOfTickets: parseInt(formData.get('guests') as string),
    };

    try {
      console.log('Envoi des données de réservation:', reservationData);

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

      // Stocker les informations de réservation dans le sessionStorage
      const bookingInfoString = JSON.stringify(reservationData);
      sessionStorage.setItem('bookingInfo', bookingInfoString);
      console.log('Informations stockées dans sessionStorage:', bookingInfoString);

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
      
      // Ouvrir l'URL Stripe dans un nouvel onglet
      const stripeWindow = window.open(data.url, '_blank');
      
      // Vérifier si la fenêtre s'est bien ouverte
      if (!stripeWindow) {
        toast({
          title: "Erreur",
          description: "Le blocage des popups pourrait être activé. Veuillez autoriser les popups pour ce site.",
          variant: "destructive",
        });
      }

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
        <ReservationHeader 
          title="Réserver mes places"
          subtitle="Toutes les informations de l'événement en un coup d'œil"
        />

        <div className="mb-8">
          <EventInfoCard />
        </div>

        <div className="text-center mb-8">
          <p className="text-gold/80">Rejoignez-nous pour une soirée exceptionnelle</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-xl" />
          
          <div className="relative bg-white/5 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-white/10">
            <ReservationForm 
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Reserver;