import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export const ShareButtons = () => {
  const { toast } = useToast();
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
  );
};