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

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    logger.error('Image failed to load:', { src });
    onError?.();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    logger.info('Image loaded successfully:', { src });
  };

  if (hasError) {
    return fallback || <Skeleton className={className} />;
  }

  return (
    <>
      {!isLoaded && (fallback || <Skeleton className={className} />)}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          !isLoaded && "opacity-0 absolute",
          isLoaded && "opacity-100",
          className
        )}
        {...props}
      />
    </>
  );
};

export default LazyImage;