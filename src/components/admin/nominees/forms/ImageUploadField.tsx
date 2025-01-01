import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';
import { ImagePreviewField } from "./ImagePreviewField";
import { ImageActions } from "./ImageActions";
import { deleteStorageImage, uploadStorageImage } from "@/lib/storage-utils";

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Si une image existe déjà, la supprimer d'abord
      if (imageUrl) {
        const success = await deleteStorageImage('nominees-images', imageUrl);
        if (!success) {
          logger.warn('Impossible de supprimer l\'ancienne image, on continue avec le téléchargement');
        }
      }

      const publicUrl = await uploadStorageImage('nominees-images', file);
      if (!publicUrl) {
        throw new Error('Échec du téléchargement de l\'image');
      }

      onImageUploaded(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      logger.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!imageUrl) return;

    setIsUploading(true);
    try {
      const success = await deleteStorageImage('nominees-images', imageUrl);
      if (!success) {
        throw new Error('Impossible de supprimer l\'image');
      }

      onImageUploaded(null);
      toast({
        title: "Succès",
        description: "Image supprimée avec succès"
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {imageUrl && (
        <ImagePreviewField
          imageUrl={imageUrl}
          altText={nomineeName}
          onDelete={handleDeleteImage}
        />
      )}
      <ImageActions
        onUploadClick={() => document.getElementById('image-upload')?.click()}
        hasImage={!!imageUrl}
        uploadId="image-upload"
        isUploading={isUploading}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
      />
    </div>
  );
};