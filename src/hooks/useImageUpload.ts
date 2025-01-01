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

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      logger.error('Error validating image URL:', error);
      return false;
    }
  };

  const uploadImage = async (file: File) => {
    if (!file) {
      logger.warn('No file selected');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = fileName;

      logger.info('Starting image upload', {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        bucket: bucketName
      });

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        logger.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Validate the public URL is accessible
      const isValid = await validateImageUrl(publicUrl);
      if (!isValid) {
        throw new Error('Generated URL is not accessible');
      }

      logger.info('Image uploaded successfully', { publicUrl });
      onSuccess(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      logger.error('Image upload failed:', error);
      setImageError(true);
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