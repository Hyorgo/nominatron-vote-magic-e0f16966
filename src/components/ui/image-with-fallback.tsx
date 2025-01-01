import { useState } from "react";
import { logger } from '@/services/monitoring/logger';
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";
import { getStorageImageUrl } from "@/lib/storage-utils";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  showLoadingState?: boolean;
  bucket?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  className,
  bucket = 'nominees-images',
  fallback = (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-lg p-4">
      <ImageIcon className="w-8 h-8 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">Image non disponible</p>
    </div>
  ),
  showLoadingState = true,
  ...props
}: ImageWithFallbackProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Construire l'URL de l'image en utilisant la fonction utilitaire
  const imageUrl = getStorageImageUrl(bucket, src);

  const handleLoad = () => {
    logger.info('Image chargée avec succès:', { src: imageUrl });
    setIsLoading(false);
  };

  const handleError = () => {
    logger.error('Erreur de chargement de l\'image:', { src: imageUrl });
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <>
      {isLoading && showLoadingState && (
        <Skeleton className="w-full h-full absolute inset-0" />
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
};