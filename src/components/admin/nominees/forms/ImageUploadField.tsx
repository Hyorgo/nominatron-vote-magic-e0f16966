import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, ImageIcon } from "lucide-react";
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
  const { uploadImage, imageError, setImageError } = useImageUpload({
    bucketName: 'nominees-images',
    onSuccess: onImageChange
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await uploadImage(file);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {imageUrl && !imageError ? (
        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-gray-200">
          <img
            src={imageUrl}
            alt={nomineeName}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {imageError ? "Erreur de chargement de l'image" : "Aucune image"}
            </p>
          </div>
        </div>
      )}
      
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
              {imageUrl && !imageError ? "Changer l'image" : "Ajouter une image"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};