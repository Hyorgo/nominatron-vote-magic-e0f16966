import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
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
      if (!sessionId) {
        console.error('No session ID provided');
        return null;
      }

      console.log('Fetching transaction with session ID:', sessionId);
      
      // Récupérer la transaction Stripe correspondant au session_id
      const { data: transaction, error: transactionError } = await supabase
        .from('stripe_transactions')
        .select('email, status')
        .eq('id', sessionId)
        .single();

      if (transactionError) {
        console.error('Error fetching transaction:', transactionError);
        return null;
      }

      if (!transaction) {
        console.error('No transaction found');
        return null;
      }

      console.log('Transaction found:', transaction);

      if (transaction.status !== 'succeeded') {
        console.error('Transaction status is not succeeded:', transaction.status);
        return null;
      }

      // Utiliser l'email pour récupérer les informations de réservation
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', transaction.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (bookingError) {
        console.error('Error fetching booking:', bookingError);
        return null;
      }

      console.log('Booking found:', bookings);
      return bookings;
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