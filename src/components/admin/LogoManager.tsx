import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LogoManager = ({ currentLogo, onUpdate }: { currentLogo: string, onUpdate: () => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);

      // Upload to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(fileName);

      // Update site settings
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ setting_value: publicUrl })
        .eq('setting_name', 'header_logo');

      if (updateError) throw updateError;

      toast({
        title: "Logo mis à jour",
        description: "Le nouveau logo a été enregistré avec succès.",
      });

      onUpdate();
      setSelectedFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du logo.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo du site</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <img src={currentLogo} alt="Logo actuel" className="h-12" />
          <span className="text-sm text-muted-foreground">Logo actuel</span>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="max-w-xs"
          />
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Envoi en cours..." : "Mettre à jour"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};