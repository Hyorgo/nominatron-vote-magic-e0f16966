import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SuccessContent } from "@/components/payment/SuccessContent";
import { ErrorContent } from "@/components/payment/ErrorContent";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const sessionId = searchParams.get('session_id');
  const isSuccess = status === 'success';
  const { toast } = useToast();
  
  // Récupérer les informations de réservation du sessionStorage
  const [bookingInfo, setBookingInfo] = useState(() => {
    const stored = sessionStorage.getItem('bookingInfo');
    if (stored) {
      console.log('Informations de réservation trouvées:', JSON.parse(stored));
      return JSON.parse(stored);
    }
    console.log('Aucune information de réservation trouvée dans le sessionStorage');
    return null;
  });

  // Vérifier le statut de la transaction dans Supabase
  const { data: transactionData, isLoading } = useQuery({
    queryKey: ['transaction', sessionId],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('Aucun ID de session fourni');
      }

      const { data, error } = await supabase
        .from('stripe_transactions')
        .select('status')
        .eq('id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw new Error('Erreur lors de la récupération des informations de transaction');
      }

      console.log('Données de transaction:', data);

      // Si la transaction est réussie, envoyer l'email de confirmation
      if (data?.status === 'succeeded' && bookingInfo) {
        try {
          console.log('Envoi de l\'email de confirmation...');
          const { error: emailError } = await supabase.functions.invoke('send-booking-confirmation', {
            body: {
              ...bookingInfo,
              sessionId,
              status: 'succeeded'
            }
          });

          if (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
            toast({
              title: "Attention",
              description: "La réservation est confirmée mais l'email de confirmation n'a pas pu être envoyé.",
              variant: "destructive",
            });
          } else {
            console.log('Email de confirmation envoyé avec succès');
            toast({
              title: "Succès",
              description: "Un email de confirmation vous a été envoyé.",
            });
          }
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        }
      }

      return data;
    },
    enabled: isSuccess && !!sessionId,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (!status) {
      navigate('/');
    }
  }, [status, navigate]);

  if (isLoading) {
    return (
      <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8 text-center animate-fade-in">
      {isSuccess ? (
        <SuccessContent 
          bookingInfo={bookingInfo}
          onNavigateHome={() => {
            sessionStorage.removeItem('bookingInfo'); // Nettoyer le storage après utilisation
            navigate("/");
          }}
        />
      ) : (
        <ErrorContent 
          onNavigateHome={() => navigate("/")}
        />
      )}
    </div>
  );
};

export default PaymentStatus;