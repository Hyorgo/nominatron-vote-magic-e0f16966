import { ImageIcon } from "lucide-react";
import { logger } from '@/services/monitoring/logger';
import LazyImage from "@/components/ui/lazy-image";

interface ImagePreviewProps {
  imageUrl: string;
  nomineeName: string;
  onError: () => void;
}

export const ImagePreview = ({ imageUrl, nomineeName, onError }: ImagePreviewProps) => {
  if (!imageUrl) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Aucune image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-32 w-full overflow-hidden rounded-lg">
      <LazyImage
        src={imageUrl}
        alt={nomineeName}
        className="h-full w-full object-cover"
        onError={onError}
      />
    </div>
  );
};