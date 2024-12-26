import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { SuccessContent } from "@/components/payment/SuccessContent";
import { ErrorContent } from "@/components/payment/ErrorContent";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const isSuccess = status === 'success';

  // Récupérer les informations de réservation depuis sessionStorage
  const bookingInfo = (() => {
    try {
      const storedData = sessionStorage.getItem('bookingInfo');
      console.log('Données brutes du sessionStorage:', storedData);
      
      if (!storedData) {
        console.error('Aucune information de réservation trouvée dans le sessionStorage');
        return null;
      }

      const parsedData = JSON.parse(storedData);
      console.log('Informations de réservation parsées:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de réservation:', error);
      return null;
    }
  })();

  useEffect(() => {
    if (!status) {
      navigate('/');
      return;
    }

    if (isSuccess && (!bookingInfo || Object.keys(bookingInfo).length === 0)) {
      console.error('Pas d\'informations de réservation trouvées dans le sessionStorage');
    }
  }, [isSuccess, status, navigate, bookingInfo]);

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