import { Button } from "@/components/ui/button";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface UploadButtonProps {
  hasImage: boolean;
  isUploading: boolean;
  onClick: () => void;
}

export const UploadButton = ({ hasImage, isUploading, onClick }: UploadButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-32 border-dashed"
      disabled={isUploading}
      onClick={onClick}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Téléchargement en cours...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {hasImage ? (
            <>
              <ImageIcon className="h-6 w-6" />
              <span>Changer l'image</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span>Cliquez ou déposez une image ici</span>
            </>
          )}
        </div>
      )}
    </Button>
  );
};