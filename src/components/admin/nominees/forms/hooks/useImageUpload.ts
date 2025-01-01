import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

interface UploadResult {
  publicUrl: string | null;
  error: Error | null;
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): Error | null => {
    if (file.size > 5 * 1024 * 1024) {
      return new Error('Le fichier est trop volumineux (maximum 5MB)');
    }
    if (!file.type.startsWith('image/')) {
      return new Error('Le fichier doit être une image');
    }
    return null;
  };

  const uploadImage = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    try {
      const validationError = validateFile(file);
      if (validationError) {
        throw validationError;
      }

      logger.info('Début du téléchargement', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
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
      
      return { publicUrl, error: null };
    } catch (error) {
      logger.error('Erreur lors du téléchargement:', error);
      return { publicUrl: null, error: error as Error };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadImage
  };
};