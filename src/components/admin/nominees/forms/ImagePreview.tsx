import { Image as ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string | null;
  altText: string;
}

export const ImagePreview = ({ imageUrl, altText }: ImagePreviewProps) => {
  if (!imageUrl) return null;

  return (
    <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100">
      <img
        src={imageUrl}
        alt={altText}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
          e.currentTarget.className = 'h-full w-full object-contain p-4';
        }}
      />
    </div>
  );
};