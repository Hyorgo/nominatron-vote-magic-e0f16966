import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { logger } from '@/services/monitoring/logger';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  onError?: () => void;
}

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  fallback, 
  onError,
  ...props 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    
    if (!src) {
      setHasError(true);
      logger.error('URL source de l\'image vide');
      onError?.();
      return;
    }

    try {
      const url = new URL(src);
      setCurrentSrc(url.toString());
      
      // Vérification de l'accessibilité de l'image
      const checkImage = async () => {
        try {
          const response = await fetch(url.toString(), { method: 'HEAD' });
          if (!response.ok) {
            throw new Error(`Image non accessible: ${response.status}`);
          }
        } catch (error) {
          logger.error('Erreur lors de la vérification de l\'image:', { src: url.toString(), error });
          setHasError(true);
          onError?.();
        }
      };

      checkImage();
    } catch (error) {
      logger.error('URL de l\'image invalide:', { src, error });
      setHasError(true);
      onError?.();
    }
  }, [src, onError]);

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    logger.error('Échec du chargement de l\'image:', { src: currentSrc });
    onError?.();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    logger.info('Image chargée avec succès:', { src: currentSrc });
  };

  if (hasError || !currentSrc) {
    return fallback || <Skeleton className={className} />;
  }

  return (
    <div className={cn("relative", className)}>
      {!isLoaded && (fallback || <Skeleton className="absolute inset-0" />)}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          !isLoaded && "opacity-0",
          isLoaded && "opacity-100",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default LazyImage;