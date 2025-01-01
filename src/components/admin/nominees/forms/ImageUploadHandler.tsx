import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

interface ImageUploadHandlerProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      logger.info('Début du téléchargement de l\'image', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Vérifier si le bucket existe
      const { data: bucketInfo, error: bucketError } = await supabase.storage
        .getBucket('nominees-images');

      if (bucketError) {
        logger.error('Erreur lors de la vérification du bucket:', bucketError);
        throw new Error('Erreur d\'accès au bucket de stockage');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('nominees-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        logger.error('Erreur lors du téléchargement:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('nominees-images')
        .getPublicUrl(fileName);

      logger.info('Image téléchargée avec succès:', {
        fileName,
        publicUrl
      });

      return publicUrl;
    } catch (error) {
      logger.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image. Veuillez réessayer.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadImage
  };
};

export const ImageUploadHandler = ({ onImageUploaded, currentImageUrl }: ImageUploadHandlerProps) => {
  const { isUploading, uploadImage } = useImageUpload();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const publicUrl = await uploadImage(file);
    if (publicUrl) {
      onImageUploaded(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
      id="image-upload-edit"
    />
  );
};