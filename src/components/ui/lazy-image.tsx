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
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setImageSrc(null);

    const loadImage = async () => {
      try {
        if (!src) {
          logger.warn('No image source provided');
          throw new Error('No image source');
        }

        logger.info('Loading image:', { originalSrc: src });

        // Si c'est une URL complète, on l'utilise directement
        if (src.startsWith('http')) {
          logger.info('Using complete URL:', { src });
          setImageSrc(src);
          return;
        }

        // Sinon, on génère l'URL publique via Supabase
        const fileName = src.split('/').pop();
        if (!fileName) {
          throw new Error('Invalid file name');
        }

        logger.info('Generating public URL for:', { fileName });
        const { data } = supabase.storage
          .from('nominees-images')
          .getPublicUrl(fileName);

        if (!data?.publicUrl) {
          throw new Error('Failed to generate public URL');
        }

        logger.info('Successfully generated public URL:', { publicUrl: data.publicUrl });
        setImageSrc(data.publicUrl);
      } catch (error) {
        logger.error('Error processing image:', { error, src });
        setHasError(true);
        onError?.();
      }
    };

    loadImage();
  }, [src, onError]);

  const handleLoad = () => {
    logger.info('Image loaded successfully:', { src: imageSrc });
    setIsLoaded(true);
  };

  const handleError = () => {
    logger.error('Image failed to load:', { src: imageSrc });
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-lg p-4">
        <ImageIcon className="w-8 h-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Image non disponible</p>
      </div>
    );
  }

  return (
    <>
      {!isLoaded && fallback}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} ${!isLoaded ? 'hidden' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </>
  );
};

export default LazyImage;