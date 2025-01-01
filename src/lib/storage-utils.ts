import { supabase } from "@/integrations/supabase/client";

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
 * @returns Nom du fichier
 */
export const getStorageFileName = (url: string): string => {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1];
};