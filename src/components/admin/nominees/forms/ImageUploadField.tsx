import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { logger } from '@/services/monitoring/logger';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadFieldProps {
  imageUrl: string;
  nomineeName: string;
  onImageChange: (url: string) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

export const ImageUploadField = ({
  imageUrl,
  nomineeName,
  onImageChange,
  isUploading,
  setIsUploading
}: ImageUploadFieldProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      logger.warn('Aucun fichier sélectionné');
      return;
    }

    logger.info('Début du téléchargement de l\'image', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      logger.info('Téléchargement vers Supabase Storage', {
        filePath,
        bucket: 'nominees-images'
      });

      const { error: uploadError, data } = await supabase.storage
        .from('nominees-images')
        .upload(filePath, file);

      if (uploadError) {
        logger.error('Erreur lors du téléchargement', uploadError);
        throw uploadError;
      }

      logger.info('Image téléchargée avec succès', { data });

      const { data: { publicUrl } } = supabase.storage
        .from('nominees-images')
        .getPublicUrl(filePath);

      logger.info('URL publique générée', { publicUrl });

      onImageChange(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      logger.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {imageUrl && (
        <div className="relative h-32 w-full overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={nomineeName}
            className="h-full w-full object-cover"
            onError={(e) => {
              logger.error('Erreur de chargement de l\'image', {
                url: imageUrl
              });
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isUploading}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {imageUrl ? "Changer l'image" : "Ajouter une image"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};