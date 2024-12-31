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
      logger.warn('No file selected');
      return;
    }

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      logger.warn('File too large:', { size: file.size });
      toast({
        variant: "destructive",
        title: "Fichier trop volumineux",
        description: "Le fichier ne doit pas dépasser 5MB",
      });
      return;
    }

    logger.info('File selected:', { name: file.name, size: file.size });
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      logger.warn('No file selected for upload');
      return;
    }

    try {
      setUploading(true);
      logger.info('Starting logo upload:', { fileName: selectedFile.name });

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, selectedFile, {
          cacheControl: '0',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      if (!uploadData) {
        throw new Error('No data received from upload');
      }

      logger.info('File uploaded successfully:', { path: uploadData.path });

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

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
        throw new Error(`Settings update error: ${upsertError.message}`);
      }

      logger.info('Logo settings updated successfully');

      toast({
        title: "Logo mis à jour",
        description: "Le nouveau logo a été enregistré avec succès",
      });

      setSelectedFile(null);
      onSuccess?.();
    } catch (error) {
      logger.error('Logo upload failed:', error);
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