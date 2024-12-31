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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Type de fichier invalide",
          description: "Veuillez sélectionner une image",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
      });
      return;
    }

    try {
      setUploading(true);
      logger.info('Début de l\'upload du logo');

      // Upload du fichier
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Erreur d'upload: ${uploadError.message}`);
      }

      if (!uploadData?.path) {
        throw new Error('Aucune donnée reçue de l\'upload');
      }

      logger.info('Fichier uploadé avec succès:', { path: uploadData.path });

      // Génération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(uploadData.path);

      if (!publicUrl) {
        throw new Error('Impossible de générer l\'URL publique');
      }

      // Vérification de l'accessibilité de l'image
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`L'URL du logo n'est pas accessible: ${response.status}`);
      }

      // Mise à jour des paramètres du site
      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({
          setting_name: 'header_logo',
          setting_value: publicUrl
        });

      if (upsertError) {
        throw new Error(`Erreur de mise à jour des paramètres: ${upsertError.message}`);
      }

      logger.info('Logo mis à jour avec succès:', { url: publicUrl });
      
      toast({
        title: "Logo mis à jour",
        description: "Le nouveau logo a été enregistré avec succès",
      });

      setSelectedFile(null);
      onSuccess?.();

    } catch (error) {
      logger.error('Erreur lors de l\'upload du logo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'upload",
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