import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Nominee } from "@/types/nominees";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { logger } from '@/services/monitoring/logger';
import { ImagePreview } from "./forms/ImagePreview";
import { UploadButton } from "./forms/UploadButton";

interface EditNomineeFormProps {
  nominee: Nominee;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditNomineeForm = ({ nominee, categories, isOpen, onClose, onUpdate }: EditNomineeFormProps) => {
  const [formData, setFormData] = useState({
    name: nominee.name,
    description: nominee.description,
    category_id: nominee.category_id || "",
    image_url: nominee.image_url || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Log l'URL de l'image actuelle au chargement du composant
  logger.info('URL de l\'image actuelle:', {
    nomineeId: nominee.id,
    imageUrl: nominee.image_url
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      logger.info('Début du téléchargement de l\'image', {
        fileName,
        fileSize: file.size,
        fileType: file.type
      });

      // Vérifier si le bucket existe et est accessible
      const { data: bucketInfo, error: bucketError } = await supabase.storage
        .getBucket('nominees-images');

      if (bucketError) {
        logger.error('Erreur lors de la vérification du bucket:', bucketError);
        throw new Error('Erreur d\'accès au bucket de stockage');
      }

      logger.info('Bucket info:', bucketInfo);

      const { error: uploadError } = await supabase.storage
        .from('nominees-images')
        .upload(fileName, file);

      if (uploadError) {
        logger.error('Erreur lors du téléchargement:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('nominees-images')
        .getPublicUrl(fileName);

      logger.info('Image téléchargée avec succès:', {
        fileName,
        publicUrl
      });

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      logger.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    logger.info('Soumission du formulaire avec les données:', formData);
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('nominees')
        .update({
          name: formData.name,
          description: formData.description,
          category_id: formData.category_id,
          image_url: formData.image_url
        })
        .eq('id', nominee.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé mis à jour avec succès"
      });
      onUpdate();
      onClose();
    } catch (error) {
      logger.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le nominé",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le nominé</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nom du nominé"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <Textarea
            placeholder="Description du nominé"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-4">
            {formData.image_url && (
              <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={formData.image_url}
                  alt={formData.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    logger.error('Erreur de chargement de l\'image dans le preview:', {
                      imageUrl: formData.image_url
                    });
                    e.currentTarget.src = '/placeholder.svg';
                    e.currentTarget.className = 'h-full w-full object-contain p-4';
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
                id="image-upload-edit"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isUploading}
                onClick={() => document.getElementById('image-upload-edit')?.click()}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    {formData.image_url ? "Changer l'image" : "Ajouter une image"}
                  </>
                )}
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde en cours...
              </>
            ) : (
              "Sauvegarder les modifications"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};