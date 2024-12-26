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
      return data;
    },
    enabled: isSuccess && !!sessionId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    if (!status) {
      navigate('/');
    }
  }, [status, navigate]);

  // Afficher un message si aucune information de réservation n'est trouvée
  useEffect(() => {
    if (isSuccess && !bookingInfo) {
      toast({
        title: "Information",
        description: "Les informations de réservation ne sont pas disponibles.",
        variant: "default",
      });
    }
  }, [isSuccess, bookingInfo, toast]);

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