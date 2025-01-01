import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

interface UseImageUploadOptions {
  bucketName: string;
  onSuccess: (url: string) => void;
}

export const useImageUpload = ({ bucketName, onSuccess }: UseImageUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!file) {
      logger.warn('No file selected for upload');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      logger.info('Starting image upload', {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        bucket: bucketName
      });

      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        logger.error('Upload error:', uploadError);
        throw uploadError;
      }

      logger.info('File uploaded successfully', { data });

      // Construct the public URL correctly
      const { data: publicUrlData } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to generate public URL');
      }

      const publicUrl = publicUrlData.publicUrl;

      // Verify the URL is accessible
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Generated URL is not accessible: ${publicUrl}`);
      }

      logger.info('Image URL generated and verified', { publicUrl });

      onSuccess(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      logger.error('Image upload failed:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading
  };
};