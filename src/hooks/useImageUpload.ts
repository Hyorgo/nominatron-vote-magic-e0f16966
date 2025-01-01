import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

interface UseImageUploadOptions {
  bucketName: string;
  onSuccess: (url: string) => void;
}

export const useImageUpload = ({ bucketName, onSuccess }: UseImageUploadOptions) => {
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!file) {
      logger.warn('Aucun fichier sélectionné');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      logger.info('Début du téléchargement', {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        bucket: bucketName
      });

      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        logger.error('Erreur lors du téléchargement', uploadError);
        throw uploadError;
      }

      logger.info('Image téléchargée avec succès', { data });

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Vérifier que l'image est accessible
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = () => {
          setImageError(true);
          reject(new Error("Impossible de charger l'image"));
        };
        img.src = publicUrl;
      });

      onSuccess(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      logger.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    uploadImage,
    imageError,
    setImageError
  };
};