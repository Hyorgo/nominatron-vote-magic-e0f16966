import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
  fallback = <Skeleton className="w-full h-full" />,
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
      logger.warn('Source d\'image manquante');
      setHasError(true);
      onError?.();
      return;
    }

    const validateAndLoadImage = async () => {
      try {
        const url = new URL(src);
        
        // Validation spécifique pour les URLs Supabase Storage
        if (url.hostname.includes('supabase')) {
          if (!url.pathname.includes('storage/v1/object/public')) {
            throw new Error('Format d\'URL Supabase Storage invalide');
          }
        }
        
        setCurrentSrc(url.toString());
        
        // Vérification de l'accessibilité
        const response = await fetch(url.toString(), { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Image inaccessible: ${response.status}`);
        }
      } catch (error) {
        logger.error('Erreur de validation d\'image:', { src, error });
        setHasError(true);
        onError?.();
      }
    };

    validateAndLoadImage();
  }, [src, onError]);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <>
      {!isLoaded && fallback}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${!isLoaded ? 'hidden' : ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          onError?.();
        }}
        {...props}
      />
    </>
  );
};

export default LazyImage;