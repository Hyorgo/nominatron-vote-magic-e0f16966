import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Loader2 } from "lucide-react";
import { logger } from "@/services/monitoring/logger";
import LazyImage from "@/components/ui/lazy-image";

export const LogoManager = ({ currentLogo, onUpdate }: { currentLogo: string, onUpdate: () => void }) => {
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

      // Vérifier la session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Session invalide. Veuillez vous reconnecter.');
      }

      // Upload to storage
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

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      logger.info('Logo téléchargé avec succès, URL:', publicUrl);

      // Update site settings
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Logo du site
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 bg-muted/50 p-4 rounded-lg">
          <div className="h-24 w-48 relative flex items-center justify-center bg-background rounded border">
            {currentLogo ? (
              <LazyImage 
                src={currentLogo} 
                alt="Logo actuel" 
                className="max-h-full max-w-full object-contain p-2"
              />
            ) : (
              <span className="text-sm text-muted-foreground">Aucun logo</span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">Logo actuel</span>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="max-w-xs"
            disabled={uploading}
          />
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Mettre à jour"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};