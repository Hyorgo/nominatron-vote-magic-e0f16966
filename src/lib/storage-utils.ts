import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/monitoring/logger';

/**
 * Construit une URL publique pour une image stockée dans Supabase Storage
 * @param bucket - Nom du bucket ('nominees-images', 'logos', 'backgrounds')
 * @param path - Chemin du fichier dans le bucket
 * @returns URL publique de l'image
 */
export const getStorageImageUrl = (bucket: string, path: string | null): string => {
  if (!path) return '/placeholder.svg';
  
  // Si l'URL est déjà une URL publique Supabase, la retourner telle quelle
  if (path.startsWith('https://')) {
    return path;
  }

  // Construire l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl || '/placeholder.svg';
};

/**
 * Extrait le nom du fichier d'une URL Supabase Storage
 * @param url - URL complète de l'image
 * @returns Nom du fichier ou null si l'URL n'est pas valide
 */
export const getStorageFileName = (url: string | null): string | null => {
  if (!url) return null;
  
  try {
    // Si c'est une URL complète
    if (url.startsWith('https://')) {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1];
    }
    // Si c'est juste un nom de fichier
    return url;
  } catch (error) {
    logger.error('Erreur lors de l\'extraction du nom de fichier:', error);
    return null;
  }
};

/**
 * Supprime une image du stockage Supabase
 * @param bucket - Nom du bucket
 * @param imageUrl - URL de l'image à supprimer
 * @returns true si la suppression a réussi, false sinon
 */
export const deleteStorageImage = async (bucket: string, imageUrl: string | null): Promise<boolean> => {
  if (!imageUrl) return true;

  const fileName = getStorageFileName(imageUrl);
  if (!fileName) {
    logger.error('Nom de fichier invalide pour la suppression:', imageUrl);
    return false;
  }

  try {
    logger.info('Suppression de l\'image:', { bucket, fileName });
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      logger.error('Erreur lors de la suppression:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Erreur lors de la suppression:', error);
    return false;
  }
};

/**
 * Télécharge une image vers le stockage Supabase
 * @param bucket - Nom du bucket
 * @param file - Fichier à télécharger
 * @returns URL publique de l'image ou null en cas d'erreur
 */
export const uploadStorageImage = async (bucket: string, file: File): Promise<string | null> => {
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

    logger.info('Début du téléchargement:', { bucket, fileName, fileType: file.type });

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      logger.error('Erreur lors du téléchargement:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    logger.info('Image téléchargée avec succès:', { publicUrl });
    return publicUrl;
  } catch (error) {
    logger.error('Erreur lors du téléchargement:', error);
    return null;
  }
};