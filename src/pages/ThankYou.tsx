import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Home, Share2, Facebook, Instagram, Linkedin } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ThankYou = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confettiCount, setConfettiCount] = useState<number>(0);

  const createConfetti = useCallback(() => {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * window.innerWidth}px`;
    const colors = ["#FFD700", "#FF69B4", "#00CED1", "#FF6347", "#98FB98", "#DDA0DD"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.innerHTML = "❤";
    confetti.style.color = color;
    confetti.style.fontSize = `${Math.random() * 20 + 10}px`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animationDelay = `${Math.random() * 3}s`;
    document.body.appendChild(confetti);
    setConfettiCount(prev => prev + 1);

    setTimeout(() => {
      confetti.remove();
      setConfettiCount(prev => prev - 1);
    }, 5000);
  }, []);

  useEffect(() => {
    // Initial confetti burst
    const initialConfettiCount = 50;
    for (let i = 0; i < initialConfettiCount; i++) {
      createConfetti();
    }

    // Periodic confetti creation
    const confettiInterval = setInterval(() => {
      if (confettiCount < 100) { // Limit maximum confetti
        for (let i = 0; i < 10; i++) {
          createConfetti();
        }
      }
    }, 3000);

    return () => {
      clearInterval(confettiInterval);
      const confettis = document.querySelectorAll('.confetti');
      confettis.forEach(confetti => confetti.remove());
    };
  }, [createConfetti, confettiCount]);

  const shareMessage = "Je viens de voter pour mes établissements préférés ! Venez voter vous aussi et soutenez vos favoris ! 🏆";
  const shareUrl = window.location.origin;

  const handleShare = useCallback(async (platform: string) => {
    try {
      switch (platform) {
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`,
            "_blank",
            "width=600,height=400"
          );
          break;
        case "instagram":
          if (navigator.share) {
            await navigator.share({
              title: "Votez pour vos établissements préférés",
              text: shareMessage,
              url: shareUrl,
            });
          }
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareMessage)}`,
            "_blank",
            "width=600,height=400"
          );
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: "Votez pour vos établissements préférés",
              text: shareMessage,
              url: shareUrl,
            });
          }
      }
      toast({
        title: "Partage réussi !",
        description: "Merci d'avoir partagé notre événement.",
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        title: "Erreur de partage",
        description: "Une erreur est survenue lors du partage.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-8 text-center animate-fade-in">
      <div className="animate-[bounce_2s_ease-in-out_infinite]">
        <Heart 
          size={64} 
          className="mb-6 text-[#D946EF] fill-[#D946EF]"
          aria-hidden="true"
        />
      </div>
      <h1 className="mb-6 text-4xl font-bold golden-reflection">
        Merci pour votre participation !
      </h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Vos votes ont été enregistrés avec succès.
      </p>

      <div className="mb-12 max-w-2xl w-full">
        <div className="mb-6 p-6 rounded-lg bg-secondary/30 backdrop-blur-sm border border-primary/20">
          <p className="text-lg font-medium">
            <span className="block mb-2 text-primary text-2xl">🌟 Faites la différence ! 🌟</span>
            <span className="golden-reflection">
              Aidez vos établissements favoris à gagner
            </span>
            <br />
            <span className="text-muted-foreground">
              en partageant et en invitant vos amis à voter !
            </span>
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-none"
            onClick={() => handleShare("facebook")}
            aria-label="Partager sur Facebook"
          >
            <Facebook className="mr-2" aria-hidden="true" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            className="bg-[#E4405F] hover:bg-[#E4405F]/90 text-white border-none"
            onClick={() => handleShare("instagram")}
            aria-label="Partager sur Instagram"
          >
            <Instagram className="mr-2" aria-hidden="true" />
            Instagram
          </Button>
          
          <Button
            variant="outline"
            className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white border-none"
            onClick={() => handleShare("linkedin")}
            aria-label="Partager sur LinkedIn"
          >
            <Linkedin className="mr-2" aria-hidden="true" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare("native")}
            aria-label="Partager via le menu natif"
          >
            <Share2 className="mr-2" aria-hidden="true" />
            Partager
          </Button>
        </div>
      </div>

      <Button 
        onClick={() => navigate("/")}
        variant="default"
        size="lg"
        className="min-w-[200px]"
      >
        <Home className="mr-2" aria-hidden="true" />
        Retour à l'accueil
      </Button>
    </div>
  );
};

export default ThankYou;