import { useState } from "react";
import { logger } from '@/services/monitoring/logger';
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  showLoadingState?: boolean;
}

export const ImageWithFallback = ({
  src,
  alt,
  className,
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

  const handleLoad = () => {
    logger.info('Image chargée avec succès:', { src });
    setIsLoading(false);
  };

  const handleError = () => {
    logger.error('Erreur de chargement de l\'image:', { src });
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
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
};