import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface ImageActionsProps {
  onUploadClick: () => void;
  hasImage: boolean;
  uploadId: string;
  isUploading?: boolean;
}

export const ImageActions = ({
  onUploadClick,
  hasImage,
  uploadId,
  isUploading
}: ImageActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={uploadId}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isUploading}
        onClick={onUploadClick}
      >
        <ImageIcon className="mr-2 h-4 w-4" />
        {hasImage ? "Changer l'image" : "Ajouter une image"}
      </Button>
    </div>
  );
};