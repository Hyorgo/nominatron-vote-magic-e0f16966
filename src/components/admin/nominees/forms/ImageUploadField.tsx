import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';
import { supabase } from "@/integrations/supabase/client";
import { ImagePreviewField } from "./ImagePreviewField";
import { ImageActions } from "./ImageActions";

interface ImageUploadFieldProps {
  imageUrl: string;
  nomineeName: string;
  onImageUploaded: (url: string) => void;
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      logger.info('Début du téléchargement de l\'image', {
        fileName,
        fileSize: file.size,
        fileType: file.type
      });

      const { error: uploadError, data } = await supabase.storage
        .from('nominees-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
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
        description: "Impossible de télécharger l'image",
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