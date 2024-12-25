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
      
      // Forme aléatoire
      const shapes = ["rectangle", "circle"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      confetti.className = `confetti ${shape}`;
      
      // Position aléatoire horizontale
      confetti.style.left = Math.random() * 100 + "vw";
      
      // Taille aléatoire
      const size = 6 + Math.random() * 6;
      confetti.style.width = `${size}px`;
      confetti.style.height = shape === "rectangle" ? `${size * 0.6}px` : `${size}px`;
      
      // Couleur aléatoire
      const colors = ["#D946EF", "#c9a55c", "#0EA5E9", "#ffffff"];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Rotation initiale aléatoire
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      // Vitesse de chute aléatoire
      const duration = 2 + Math.random() * 2;
      confetti.style.animation = `confettiFall ${duration}s linear forwards, confettiSway 1.5s ease-in-out infinite`;
      
      document.body.appendChild(confetti);

      // Supprimer après l'animation
      setTimeout(() => {
        confetti.remove();
      }, duration * 1000);
    };

    // Créer plusieurs confettis
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        createConfetti();
      }
    }, 100);

    // Nettoyer après 4 secondes
    setTimeout(() => {
      clearInterval(interval);
    }, 4000);

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