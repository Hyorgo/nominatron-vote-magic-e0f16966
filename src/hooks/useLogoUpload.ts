import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

interface UseLogoUploadProps {
  onSuccess?: () => void;
}

export const useLogoUpload = ({ onSuccess }: UseLogoUploadProps = {}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      logger.warn('Aucun fichier sélectionné');
      return;
    }

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      logger.warn('Fichier trop volumineux:', { size: file.size });
      toast({
        variant: "destructive",
        title: "Fichier trop volumineux",
        description: "Le fichier ne doit pas dépasser 5MB",
      });
      return;
    }

    logger.info('Fichier sélectionné:', { name: file.name, size: file.size });
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      logger.warn('Aucun fichier sélectionné pour l\'upload');
      return;
    }

    try {
      setUploading(true);
      logger.info('Début de l\'upload du logo:', { fileName: selectedFile.name });

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      // Upload du fichier vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, selectedFile, {
          cacheControl: '0',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Erreur d'upload: ${uploadError.message}`);
      }

      if (!uploadData?.path) {
        throw new Error('Aucune donnée reçue de l\'upload');
      }

      logger.info('Fichier uploadé avec succès:', { path: uploadData.path });

      // Récupération de l'URL publique avec getPublicUrl
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(uploadData.path);

      if (!publicUrl) {
        throw new Error('Impossible de générer l\'URL publique');
      }

      // Test de l'URL avant de la sauvegarder
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`L'URL du logo n'est pas accessible: ${response.status}`);
        }
      } catch (error) {
        logger.error('Erreur lors de la vérification de l\'URL:', error);
        throw new Error('L\'URL du logo générée n\'est pas accessible');
      }

      // Mise à jour des paramètres du site avec la nouvelle URL
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({
          setting_name: 'header_logo',
          setting_value: publicUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_name'
        });

      if (upsertError) {
        throw new Error(`Erreur de mise à jour des paramètres: ${upsertError.message}`);
      }

      logger.info('Paramètres du logo mis à jour avec succès avec l\'URL:', publicUrl);

      toast({
        title: "Logo mis à jour",
        description: "Le nouveau logo a été enregistré avec succès",
      });

      setSelectedFile(null);
      onSuccess?.();
    } catch (error) {
      logger.error('Échec de l\'upload du logo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du logo",
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    selectedFile,
    uploading,
    handleFileChange,
    handleUpload
  };
};