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
      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux (maximum 5MB)');
      }

      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      logger.info('Début du téléchargement de l\'image', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Vérifier si le bucket existe et est accessible
      const { data: bucketInfo, error: bucketError } = await supabase.storage
        .getBucket('nominees-images');

      if (bucketError) {
        logger.error('Erreur lors de la vérification du bucket:', {
          error: bucketError,
          bucket: 'nominees-images'
        });
        throw new Error('Le système de stockage est temporairement indisponible. Veuillez réessayer plus tard.');
      }

      if (!bucketInfo) {
        logger.error('Bucket non trouvé:', {
          bucket: 'nominees-images'
        });
        throw new Error('Configuration de stockage incorrecte. Veuillez contacter l\'administrateur.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('nominees-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        logger.error('Erreur lors du téléchargement:', {
          error: uploadError,
          fileName,
          bucket: 'nominees-images'
        });
        
        if (uploadError.message.includes('Permission denied')) {
          throw new Error('Accès au stockage refusé. Veuillez vérifier vos permissions.');
        } else if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Espace de stockage non trouvé. Veuillez contacter l\'administrateur.');
        } else {
          throw new Error('Erreur lors du téléchargement. Veuillez réessayer.');
        }
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
        description: error.message || "Impossible de télécharger l'image. Veuillez réessayer.",
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