import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SuccessContent } from "@/components/payment/SuccessContent";
import { ErrorContent } from "@/components/payment/ErrorContent";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const isSuccess = status === 'success';
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    if (!status) {
      navigate('/');
      return;
    }

    // Récupérer les informations de réservation depuis sessionStorage
    try {
      const storedData = sessionStorage.getItem('bookingInfo');
      console.log('Données brutes du sessionStorage:', storedData);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Informations de réservation parsées:', parsedData);
        setBookingInfo(parsedData);
      } else {
        console.error('Aucune information de réservation trouvée dans le sessionStorage');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de réservation:', error);
    }
  }, [status, navigate]);

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