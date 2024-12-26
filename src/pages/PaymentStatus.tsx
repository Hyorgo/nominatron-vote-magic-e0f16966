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

    let confettiInterval: NodeJS.Timeout;
    const confettiTimeout = setTimeout(() => {
      // Nettoyer tous les confettis après 10 secondes
      const confettis = document.querySelectorAll('.confetti');
      confettis.forEach(confetti => confetti.remove());
      if (confettiInterval) clearInterval(confettiInterval);
    }, 10000);

    const createConfetti = () => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * window.innerWidth + "px";
      const colors = ["#FFD700", "#FF69B4", "#00CED1", "#FF6347", "#98FB98", "#DDA0DD"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.innerHTML = "❤";
      confetti.style.color = color;
      const size = Math.random() * 20 + 10;
      confetti.style.fontSize = `${size}px`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animationDelay = Math.random() * 3 + "s";
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 5000);
    };

    for (let i = 0; i < 50; i++) {
      createConfetti();
    }

    confettiInterval = setInterval(() => {
      for (let i = 0; i < 10; i++) {
        createConfetti();
      }
    }, 3000);

    return () => {
      if (confettiInterval) clearInterval(confettiInterval);
      if (confettiTimeout) clearTimeout(confettiTimeout);
      const confettis = document.querySelectorAll('.confetti');
      confettis.forEach(confetti => confetti.remove());
    };
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