import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ImagePreviewFieldProps {
  imageUrl: string | null;
  altText: string;
  className?: string;
}

export const ImagePreviewField = ({
  imageUrl,
  altText,
  className = "h-32 w-full"
}: ImagePreviewFieldProps) => {
  if (!imageUrl) return null;

  return (
    <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${className}`}>
      <ImageWithFallback
        src={imageUrl}
        alt={altText}
        type="profile"
        className="h-full w-full object-cover"
      />
    </div>
  );
};