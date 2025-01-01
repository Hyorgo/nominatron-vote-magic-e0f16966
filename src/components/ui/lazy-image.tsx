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
        // Si c'est déjà une URL complète, on l'utilise directement
        if (src.startsWith('http')) {
          logger.info('Using direct URL:', { src });
          setImageSrc(src);
          return;
        }

        // Sinon, on considère que c'est un nom de fichier
        const fileName = src.split('/').pop();
        if (!fileName) {
          throw new Error('Invalid file name');
        }

        logger.info('Getting public URL for file:', { fileName });
        
        const { data } = supabase.storage
          .from('nominees-images')
          .getPublicUrl(fileName);

        if (!data?.publicUrl) {
          throw new Error('Failed to get public URL');
        }

        logger.info('Generated public URL:', { publicUrl: data.publicUrl });
        setImageSrc(data.publicUrl);
      } catch (error) {
        logger.error('Error processing image URL:', { error, originalSrc: src });
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