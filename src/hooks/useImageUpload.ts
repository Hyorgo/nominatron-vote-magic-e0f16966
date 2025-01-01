import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

export const useImageUpload = (bucketName: string = 'nominees-images') => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    setIsUploading(true);
    try {
      // Validation du fichier
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux (maximum 5MB)');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      logger.info('Début du téléchargement:', { fileName, fileType: file.type });

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      logger.info('Image téléchargée avec succès:', { publicUrl });
      
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });

      return publicUrl;
    } catch (error) {
      logger.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de télécharger l'image",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      const fileName = imageUrl.split('/').pop();
      if (!fileName) return false;

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Image supprimée avec succès"
      });

      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isUploading,
    uploadImage,
    deleteImage
  };
};