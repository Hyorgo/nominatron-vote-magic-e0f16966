import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Trash2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { uploadNomineeImage, deleteNomineeImage } from "@/lib/storage-utils";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

interface ImageUploadFieldProps {
  imageUrl: string;
  nomineeName: string;
  onImageUploaded: (url: string | null) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

export const ImageUploadField = ({
  imageUrl,
  nomineeName,
  onImageUploaded,
  isUploading,
  setIsUploading
}: ImageUploadFieldProps) => {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState(imageUrl);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadNomineeImage(file, nomineeName);
      if (!url) throw new Error("Échec du téléchargement de l'image");

      setPreviewUrl(url);
      onImageUploaded(url);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      logger.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    try {
      const success = await deleteNomineeImage(previewUrl);
      if (!success) throw new Error("Échec de la suppression de l'image");

      setPreviewUrl('');
      onImageUploaded(null);
      toast({
        title: "Succès",
        description: "Image supprimée avec succès"
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {previewUrl && (
        <div className="relative w-32 h-32 mx-auto">
          <ImageWithFallback
            src={previewUrl}
            alt={nomineeName || 'Image du nominé'}
            type="profile"
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2"
            onClick={handleDeleteImage}
            disabled={isUploading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
          disabled={isUploading}
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
              <span>Téléchargement en cours...</span>
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>{previewUrl ? "Changer l'image" : "Ajouter une image"}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};