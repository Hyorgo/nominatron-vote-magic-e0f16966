import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ImagePreviewFieldProps {
  imageUrl: string;
  altText: string;
  onDelete?: () => void;
}

export const ImagePreviewField = ({ imageUrl, altText, onDelete }: ImagePreviewFieldProps) => {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <ImageWithFallback
        src={imageUrl}
        alt={altText}
        type="profile"
        className="w-full h-full object-cover rounded-lg"
      />
      {imageUrl && onDelete && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};