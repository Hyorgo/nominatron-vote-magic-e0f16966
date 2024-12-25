import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Home, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { useEffect } from "react";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Créer et ajouter les confettis en forme de cœur
    const createConfetti = () => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      
      // Position aléatoire horizontale
      confetti.style.left = Math.random() * window.innerWidth + "px";
      
      // Couleurs aléatoires festives
      const colors = ["#FFD700", "#FF69B4", "#00CED1", "#FF6347", "#98FB98", "#DDA0DD"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Créer le cœur avec un emoji
      confetti.innerHTML = "❤";
      confetti.style.color = color;
      
      // Taille aléatoire pour plus de variété
      const size = Math.random() * 20 + 10; // entre 10px et 30px
      confetti.style.fontSize = `${size}px`;
      
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

  const shareMessage = "Je viens de voter pour mes établissements préférés ! Venez voter vous aussi et soutenez vos favoris ! 🏆";
  const shareUrl = window.location.origin;

  const handleShare = (platform: string) => {
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareMessage)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(window.location.origin)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(shareMessage)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: "Votez pour vos établissements préférés",
            text: shareMessage,
            url: window.location.origin,
          });
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

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

      <div className="mb-12 max-w-2xl">
        <p className="mb-6 text-lg text-muted-foreground">
          Aidez vos établissements favoris à gagner en partageant et en invitant vos amis à voter ! 🌟
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-none"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="mr-2" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-none"
            onClick={() => handleShare("twitter")}
          >
            <Twitter className="mr-2" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white border-none"
            onClick={() => handleShare("linkedin")}
          >
            <Linkedin className="mr-2" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare("native")}
          >
            <Share2 className="mr-2" />
            Partager
          </Button>
        </div>
      </div>

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
