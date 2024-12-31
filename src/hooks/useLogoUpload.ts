import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/services/monitoring/logger";

export const useLogoUpload = (onUpdate: () => void) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "Le fichier ne doit pas dépasser 5MB.",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      logger.info('Début du téléchargement du logo', { fileName: selectedFile.name });

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Session invalide. Veuillez vous reconnecter.');
      }

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, selectedFile, {
          cacheControl: '0',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Erreur lors du téléchargement: ${uploadError.message}`);
      }

      if (!uploadData) {
        throw new Error('Aucune donnée reçue après le téléchargement');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      logger.info('Logo téléchargé avec succès, URL:', publicUrl);

      const { error: updateError } = await supabase
        .from('site_settings')
        .upsert({
          setting_name: 'header_logo',
          setting_value: publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        throw new Error(`Erreur lors de la mise à jour des paramètres: ${updateError.message}`);
      }

      toast({
        title: "Logo mis à jour",
        description: "Le nouveau logo a été enregistré avec succès.",
      });

      onUpdate();
      setSelectedFile(null);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du logo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du logo.",
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