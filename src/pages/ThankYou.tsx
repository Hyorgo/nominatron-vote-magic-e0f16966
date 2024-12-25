import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Home } from "lucide-react";
import { useEffect } from "react";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Créer les confettis
    const createConfetti = () => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      
      // Position aléatoire horizontale
      confetti.style.left = Math.random() * 100 + "vw";
      
      // Couleur aléatoire
      const colors = ["#D946EF", "#c9a55c", "#0EA5E9", "#ffffff"];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      document.body.appendChild(confetti);

      // Supprimer après l'animation
      setTimeout(() => {
        confetti.remove();
      }, 2000);
    };

    // Créer plusieurs confettis
    const interval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        createConfetti();
      }
    }, 200);

    // Nettoyer après 3 secondes
    setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8 text-center animate-fade-in">
      <div className="relative animate-[bounce_2s_ease-in-out_infinite]">
        <Heart 
          size={64} 
          className="mb-6 text-[#D946EF] fill-[#D946EF]"
        />
      </div>
      <h1 className="mb-6 text-4xl font-bold golden-reflection">
        Merci pour votre participation !
      </h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Vos votes ont été enregistrés avec succès.
      </p>
      <Button 
        onClick={() => navigate("/")}
        variant="outline"
        size="lg"
      >
        <Home className="mr-2" />
        Retour à l'accueil
      </Button>
    </div>
  );
};

export default ThankYou;