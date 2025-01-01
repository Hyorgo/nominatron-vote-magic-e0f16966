import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';
import { supabase } from "@/integrations/supabase/client";
import { ImagePreviewField } from "./ImagePreviewField";
import { ImageActions } from "./ImageActions";
import { getStorageFileName } from "@/lib/storage-utils";

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
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux (maximum 5MB)');
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      // Si une image existe déjà, la supprimer d'abord
      if (imageUrl) {
        const oldFileName = getStorageFileName(imageUrl);
        if (oldFileName) {
          logger.info('Suppression de l\'ancienne image:', oldFileName);
          const { error: deleteError } = await supabase.storage
            .from('nominees-images')
            .remove([oldFileName]);

          if (deleteError) {
            logger.error('Erreur lors de la suppression de l\'ancienne image:', deleteError);
            // On continue malgré l'erreur pour permettre le téléchargement de la nouvelle image
          }
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      logger.info('Début du téléchargement de l\'image', {
        fileName,
        fileSize: file.size,
        fileType: file.type
      });

      const { error: uploadError } = await supabase.storage
        .from('nominees-images')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        logger.error('Erreur lors du téléchargement:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('nominees-images')
        .getPublicUrl(fileName);

      logger.info('Image téléchargée avec succès', { publicUrl });
      
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
      const fileName = getStorageFileName(imageUrl);
      if (!fileName) {
        throw new Error('Nom de fichier invalide');
      }

      logger.info('Suppression de l\'image:', fileName);
      
      const { error } = await supabase.storage
        .from('nominees-images')
        .remove([fileName]);

      if (error) {
        throw error;
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
        description: "Impossible de supprimer l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImagePreviewField
        imageUrl={imageUrl}
        altText={nomineeName}
        onDelete={imageUrl ? handleDeleteImage : undefined}
      />
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