import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialShareProps {
  nomineeId?: string;
  nomineeName?: string;
}

export const SocialShare = ({ nomineeId, nomineeName }: SocialShareProps) => {
  const baseUrl = window.location.origin;
  const shareUrl = nomineeId 
    ? `${baseUrl}/categories?nominee=${nomineeId}`
    : baseUrl;
  const shareMessage = nomineeName
    ? `Je viens de voter pour ${nomineeName} ! Venez voter vous aussi et soutenez vos favoris ! 🏆`
    : "Je viens de voter ! Venez voter vous aussi et soutenez vos favoris ! 🏆";

  const handleShare = (platform: string) => {
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareMessage)}`;
        break;
      case "instagram":
        // Instagram n'a pas d'API de partage directe, on utilise le partage natif
        if (navigator.share) {
          navigator.share({
            title: "Votez pour vos favoris",
            text: shareMessage,
            url: window.location.origin,
          });
        }
        return;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(shareMessage)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: "Votez pour vos favoris",
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
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-none"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Partager sur Facebook</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Partager sur Facebook
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#E4405F] hover:bg-[#E4405F]/90 text-white border-none"
              onClick={() => handleShare("instagram")}
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Partager sur Instagram</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Partager sur Instagram
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white border-none"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Partager sur LinkedIn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Partager sur LinkedIn
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("native")}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Partager</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Partager avec vos amis
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};