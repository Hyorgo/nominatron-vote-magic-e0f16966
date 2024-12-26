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

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          first_name,
          last_name,
          email,
          number_of_tickets,
          created_at,
          stripe_transactions!inner (
            status
          )
        `)
        .eq('stripe_session_id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw new Error('Erreur lors de la récupération des informations de réservation');
      }

      if (!data) {
        throw new Error('Aucune réservation trouvée pour cette transaction');
      }

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // Considérer les données comme fraîches pendant 5 minutes
    gcTime: 30 * 60 * 1000, // Garder les données en cache pendant 30 minutes (remplace cacheTime)
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