import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SuccessContent } from "@/components/payment/SuccessContent";
import { ErrorContent } from "@/components/payment/ErrorContent";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const sessionId = searchParams.get('session_id');
  const isSuccess = status === 'success';

  const { data: bookingInfo, isLoading } = useQuery({
    queryKey: ['booking', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;

      // Récupérer d'abord la transaction Stripe pour avoir l'email
      const { data: transactions, error: transactionError } = await supabase
        .from('stripe_transactions')
        .select('email')
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
        .limit(1);

      if (transactionError) {
        console.error('Erreur lors de la récupération de la transaction:', transactionError);
        return null;
      }

      if (!transactions || transactions.length === 0) {
        console.error('Aucune transaction trouvée');
        return null;
      }

      // Utiliser l'email pour récupérer les informations de réservation
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', transactions[0].email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bookingError) {
        console.error('Erreur lors de la récupération de la réservation:', bookingError);
        return null;
      }

      if (!bookings || bookings.length === 0) {
        console.error('Aucune réservation trouvée');
        return null;
      }

      return bookings[0];
    },
    enabled: isSuccess && !!sessionId,
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