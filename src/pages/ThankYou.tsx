import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Home } from "lucide-react";
import { useEffect } from "react";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Créer et ajouter les confettis
    const createConfetti = () => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      
      // Position aléatoire horizontale
      confetti.style.left = Math.random() * window.innerWidth + "px";
      
      // Couleurs aléatoires festives
      const colors = ["#FFD700", "#FF69B4", "#00CED1", "#FF6347", "#98FB98", "#DDA0DD"];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Rotation et délai aléatoires
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animationDelay = Math.random() * 3 + "s";
      
      document.body.appendChild(confetti);

      // Nettoyer après l'animation
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

    // Cleanup
    return () => {
      clearInterval(interval);
      const confettis = document.querySelectorAll('.confetti');
      confettis.forEach(confetti => confetti.remove());
    };
  }, []);

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8 text-center animate-fade-in">
      <div className="animate-[bounce_2s_ease-in-out_infinite]">
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