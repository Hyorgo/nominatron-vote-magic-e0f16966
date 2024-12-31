import { Link } from "react-router-dom";
import LazyImage from "@/components/ui/lazy-image";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

interface LogoDisplayProps {
  logoUrl: string | null;
}

export const LogoDisplay = ({ logoUrl }: LogoDisplayProps) => {
  const { toast } = useToast();
  
  const handleImageError = () => {
    logger.error('Failed to load logo in navigation:', { url: logoUrl });
    toast({
      variant: "destructive",
      title: "Erreur de chargement",
      description: "Impossible de charger le logo. Veuillez réessayer plus tard.",
    });
  };

  const fallbackImage = "/placeholder.svg";
  const imageUrl = logoUrl || fallbackImage;

  return (
    <Link to="/" className="flex-shrink-0">
      <LazyImage 
        src={imageUrl}
        alt="Lyon d'Or"
        className="h-16 w-auto object-contain p-2"
        onError={handleImageError}
        fallback={
          <img 
            src={fallbackImage} 
            alt="Lyon d'Or" 
            className="h-16 w-auto object-contain p-2"
          />
        }
      />
    </Link>
  );
};