import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/monitoring/logger';

export const getStorageFileName = (url: string): string | null => {
  try {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  } catch (error) {
    logger.error('Erreur lors de l\'extraction du nom de fichier:', error);
    return null;
  }
};

export const uploadNomineeImage = async (file: File, nomineeName: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    logger.info('Début du téléchargement:', { fileName, fileType: file.type });

    const { error: uploadError } = await supabase.storage
      .from('nominees-images')
      .upload(fileName, file, {
        cacheControl: '0',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('nominees-images')
      .getPublicUrl(fileName);

    logger.info('Image téléchargée avec succès:', { publicUrl });
    return publicUrl;
  } catch (error) {
    logger.error('Erreur lors du téléchargement:', error);
    return null;
  }
};

export const deleteNomineeImage = async (imageUrl: string): Promise<boolean> => {
  try {
    const fileName = getStorageFileName(imageUrl);
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from('nominees-images')
      .remove([fileName]);

    if (error) throw error;
    return true;
  } catch (error) {
    logger.error('Erreur lors de la suppression:', error);
    return false;
  }
};