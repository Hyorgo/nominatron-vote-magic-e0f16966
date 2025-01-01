import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, ImageIcon } from "lucide-react";
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
  const [imageError, setImageError] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      logger.warn('Aucun fichier sélectionné');
      return;
    }

    // Vérification de la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive"
      });
      return;
    }

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Le fichier doit être une image",
        variant: "destructive"
      });
      return;
    }

    logger.info('Début du téléchargement de l\'image', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setIsUploading(true);
    setImageError(false);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      logger.info('Téléchargement vers Supabase Storage', {
        fileName,
        bucket: 'nominees-images'
      });

      const { error: uploadError, data } = await supabase.storage
        .from('nominees-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        logger.error('Erreur lors du téléchargement', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('nominees-images')
        .getPublicUrl(fileName);

      logger.info('URL publique générée', { publicUrl });

      // Vérifier que l'URL est accessible
      const imageResponse = await fetch(publicUrl);
      if (!imageResponse.ok) {
        throw new Error(`Impossible d'accéder à l'image: ${imageResponse.statusText}`);
      }

      onImageChange(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      logger.error("Erreur lors du téléchargement:", error);
      setImageError(true);
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
      {imageUrl && !imageError ? (
        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-gray-200">
          <img
            src={imageUrl}
            alt={nomineeName}
            className="h-full w-full object-cover"
            onError={() => {
              logger.error('Erreur de chargement de l\'image', {
                url: imageUrl
              });
              setImageError(true);
            }}
          />
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {imageError ? "Erreur de chargement de l'image" : "Aucune image"}
            </p>
          </div>
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
              {imageUrl && !imageError ? "Changer l'image" : "Ajouter une image"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};