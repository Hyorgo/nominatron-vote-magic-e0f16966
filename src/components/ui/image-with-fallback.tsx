import { useState } from "react";
import { logger } from '@/services/monitoring/logger';
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";
import { getStorageImageUrl } from "@/lib/storage-utils";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  showLoadingState?: boolean;
  bucket?: string;
  type?: 'profile' | 'tech' | 'work' | 'default';
}

const FALLBACK_IMAGES = {
  profile: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
  work: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  default: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
};

export const ImageWithFallback = ({
  src,
  alt,
  className,
  bucket = 'nominees-images',
  type = 'default',
  fallback,
  showLoadingState = true,
  ...props
}: ImageWithFallbackProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Construire l'URL de l'image en utilisant la fonction utilitaire
  const imageUrl = getStorageImageUrl(bucket, src);

  const handleLoad = () => {
    logger.info('Image chargée avec succès:', { src: imageUrl });
    setIsLoading(false);
  };

  const handleError = () => {
    logger.error('Erreur de chargement de l\'image:', { src: imageUrl });
    setHasError(true);
    setUseFallback(true);
    setIsLoading(false);
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  const finalSrc = useFallback ? FALLBACK_IMAGES[type] : imageUrl;

  return (
    <>
      {isLoading && showLoadingState && (
        <Skeleton className="w-full h-full absolute inset-0" />
      )}
      <img
        src={finalSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
};