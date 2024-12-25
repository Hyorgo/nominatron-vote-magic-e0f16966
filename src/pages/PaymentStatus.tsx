import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Home } from "lucide-react";
import { useEffect } from "react";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const isSuccess = status === 'success';

  useEffect(() => {
    // Créer et ajouter les confettis en forme de cœur si paiement réussi
    if (isSuccess) {
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

      // Créer plusieurs confettis
      for (let i = 0; i < 50; i++) {
        createConfetti();
      }

      // Créer de nouveaux confettis toutes les 3 secondes
      const interval = setInterval(() => {
        for (let i = 0; i < 10; i++) {
          createConfetti();
        }
      }, 3000);

      return () => {
        clearInterval(interval);
        const confettis = document.querySelectorAll('.confetti');
        confettis.forEach(confetti => confetti.remove());
      };
    }
  }, [isSuccess]);

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8 text-center animate-fade-in">
      {isSuccess ? (
        <>
          <div className="animate-[bounce_2s_ease-in-out_infinite]">
            <Heart size={64} className="mb-6 text-[#D946EF] fill-[#D946EF]" />
          </div>
          <h1 className="mb-6 text-4xl font-bold golden-reflection">
            Paiement confirmé !
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Votre réservation a été enregistrée avec succès.
          </p>
          <div className="mb-12 max-w-2xl">
            <div className="mb-6 p-6 rounded-lg bg-secondary/30 backdrop-blur-sm border border-primary/20">
              <p className="text-lg">
                <span className="block mb-2 text-primary text-2xl">🎉 Merci pour votre confiance ! 🎉</span>
                <span className="golden-reflection block mb-2">
                  Un email de confirmation vous sera envoyé prochainement
                </span>
                <span className="text-muted-foreground">
                  avec tous les détails de votre réservation.
                </span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="mb-6 text-4xl font-bold text-destructive">
            Paiement non complété
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Une erreur est survenue lors du traitement de votre paiement.
          </p>
          <div className="mb-12 max-w-2xl">
            <div className="mb-6 p-6 rounded-lg bg-destructive/10 backdrop-blur-sm border border-destructive/20">
              <p className="text-lg">
                <span className="block mb-2 text-destructive text-2xl">❌ Erreur de paiement</span>
                <span className="block mb-2">
                  Votre carte n'a pas été débitée.
                </span>
                <span className="text-muted-foreground">
                  Vous pouvez réessayer votre réservation ou nous contacter si le problème persiste.
                </span>
              </p>
            </div>
          </div>
        </>
      )}

      <Button 
        onClick={() => navigate("/")}
        variant="default"
        size="lg"
      >
        <Home className="mr-2" />
        Retour à l'accueil
      </Button>
    </div>
  );
};

export default PaymentStatus;