import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
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

  const { data: bookingInfo, isLoading, error } = useQuery({
    queryKey: ['booking', sessionId],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('Aucun ID de session fourni');
      }

      // Utiliser une jointure pour récupérer les données en une seule requête
      const { data, error } = await supabase
        .from('stripe_transactions')
        .select(`
          email,
          status,
          bookings!inner (
            id,
            first_name,
            last_name,
            email,
            number_of_tickets,
            created_at
          )
        `)
        .eq('id', sessionId)
        .eq('status', 'succeeded')
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw new Error('Erreur lors de la récupération des informations de réservation');
      }

      if (!data) {
        throw new Error('Aucune réservation trouvée pour cette transaction');
      }

      return data.bookings;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // Considérer les données comme fraîches pendant 5 minutes
    cacheTime: 30 * 60 * 1000, // Garder les données en cache pendant 30 minutes
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    },
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
          onNavigateHome={() => navigate("/")}
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