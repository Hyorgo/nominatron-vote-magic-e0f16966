import { Skeleton } from "@/components/ui/skeleton";
import LazyImage from "@/components/ui/lazy-image";
import { logger } from '@/services/monitoring/logger';
import { useToast } from "@/hooks/use-toast";

interface LogoPreviewProps {
  currentLogo: string;
}

export const LogoPreview = ({ currentLogo }: LogoPreviewProps) => {
  const { toast } = useToast();
  
  const handleImageError = () => {
    logger.error('Failed to load logo image:', { url: currentLogo });
    toast({
      variant: "destructive",
      title: "Erreur de chargement",
      description: "Impossible de charger l'image du logo. Vérifiez que l'URL est valide.",
    });
  };

  return (
    <div className="flex items-center space-x-4 bg-muted/50 p-4 rounded-lg">
      <div className="h-24 w-48 relative flex items-center justify-center bg-background rounded border">
        {currentLogo ? (
          <LazyImage 
            src={currentLogo} 
            alt="Logo actuel" 
            className="max-h-full max-w-full object-contain p-2"
            fallback={<Skeleton className="h-full w-full" />}
            onError={handleImageError}
          />
        ) : (
          <span className="text-sm text-muted-foreground">Aucun logo</span>
        )}
      </div>
      <span className="text-sm text-muted-foreground">Logo actuel</span>
    </div>
  );
};