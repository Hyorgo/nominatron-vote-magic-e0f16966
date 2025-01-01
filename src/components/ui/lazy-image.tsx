import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { logger } from '@/services/monitoring/logger';
import { Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    if (!src) {
      logger.warn('Missing image source');
      setHasError(true);
      onError?.();
      return;
    }

    const loadImage = async () => {
      try {
        // Si l'URL est déjà une URL publique Supabase complète, l'utiliser directement
        if (src.includes('storage.googleapis.com') || src.includes('supabase.co/storage/v1/object/public')) {
          setImageSrc(src);
        } else {
          // Sinon, essayer de construire l'URL publique
          const { data } = supabase.storage
            .from('nominees-images')
            .getPublicUrl(src.split('/').pop() || src);
          
          if (data?.publicUrl) {
            setImageSrc(data.publicUrl);
          } else {
            throw new Error('Unable to get public URL');
          }
        }

        logger.info('Image source set:', { src: imageSrc });
      } catch (error) {
        logger.error('Error processing image URL:', error);
        setHasError(true);
        onError?.();
      }
    };

    loadImage();
  }, [src, onError]);

  const handleLoad = () => {
    logger.info('Image loaded successfully:', { src: imageSrc });
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    logger.error('Image load error:', { src: imageSrc });
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-lg">
        <ImageIcon className="w-8 h-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Image non disponible</p>
      </div>
    );
  }

  return (
    <>
      {!isLoaded && fallback}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${!isLoaded ? 'hidden' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
};

export default LazyImage;