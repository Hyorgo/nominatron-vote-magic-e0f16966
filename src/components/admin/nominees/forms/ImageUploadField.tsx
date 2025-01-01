import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploadFieldProps {
  imageUrl: string;
  nomineeName: string;
  onImageChange: (url: string) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

export const ImageUploadField = ({
  imageUrl,
  nomineeName,
  onImageChange,
  isUploading,
  setIsUploading
}: ImageUploadFieldProps) => {
  const { uploadImage } = useImageUpload({
    bucketName: 'nominees-images',
    onSuccess: onImageChange
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await uploadImage(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <ImagePreview
        imageUrl={imageUrl}
        nomineeName={nomineeName}
        onError={() => onImageChange("")}
      />
      
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isUploading}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {imageUrl ? "Changer l'image" : "Ajouter une image"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};