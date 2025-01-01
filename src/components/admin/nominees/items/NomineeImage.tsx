import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { logger } from '@/services/monitoring/logger';

interface NomineeImageProps {
  imageUrl: string | null;
  nomineeName: string;
}

export const NomineeImage = ({ imageUrl, nomineeName }: NomineeImageProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error('Erreur de chargement de l\'image', {
      nomineeName,
      imageUrl
    });
    e.currentTarget.src = '/placeholder.svg';
    e.currentTarget.className = 'w-full h-full object-contain p-4';
  };

  return (
    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
      <ImageWithFallback
        src={imageUrl || ''}
        alt={nomineeName}
        type="profile"
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    </div>
  );
};