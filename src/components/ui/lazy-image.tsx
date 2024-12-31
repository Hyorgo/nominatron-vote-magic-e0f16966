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
    // Reset states when src changes
    setIsLoaded(false);
    setHasError(false);
    
    if (!src) {
      setHasError(true);
      logger.error('Empty image source URL');
      onError?.();
      return;
    }

    try {
      // Try to create a URL object to validate the URL
      const url = new URL(src);
      setCurrentSrc(url.toString());
    } catch (error) {
      logger.error('Invalid image URL:', { src, error });
      setHasError(true);
      onError?.();
    }
  }, [src, onError]);

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    logger.error('Image failed to load:', { src: currentSrc });
    onError?.();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    logger.info('Image loaded successfully:', { src: currentSrc });
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