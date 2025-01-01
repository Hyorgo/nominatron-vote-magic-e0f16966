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
import { ImageUploadField } from "./forms/ImageUploadField";
import { getStorageFileName } from "@/lib/storage-utils";

interface EditNomineeFormProps {
  nominee: Nominee;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditNomineeForm = ({
  nominee,
  categories,
  isOpen,
  onClose,
  onUpdate
}: EditNomineeFormProps) => {
  const [formData, setFormData] = useState({
    name: nominee.name,
    description: nominee.description,
    category_id: nominee.category_id || "",
    image_url: nominee.image_url || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

  const handleImageChange = async (url: string | null) => {
    logger.info('Mise à jour de l\'image:', { url });
    
    // Si l'URL est null, cela signifie qu'on veut supprimer l'image
    if (url === null) {
      // Si il y avait une ancienne image, on la supprime du storage
      if (formData.image_url) {
        const fileName = getStorageFileName(formData.image_url);
        if (fileName) {
          logger.info('Suppression de l\'ancienne image:', fileName);
          const { error } = await supabase.storage
            .from('nominees-images')
            .remove([fileName]);
          
          if (error) {
            logger.error('Erreur lors de la suppression de l\'image:', error);
            toast({
              title: "Erreur",
              description: "Impossible de supprimer l'image",
              variant: "destructive"
            });
            return;
          }
        }
      }
      
      setFormData(prev => ({ ...prev, image_url: '' }));
      toast({
        title: "Succès",
        description: "Image supprimée avec succès"
      });
    } else {
      // Mise à jour avec la nouvelle URL
      setFormData(prev => ({ ...prev, image_url: url }));
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

          <ImageUploadField
            imageUrl={formData.image_url}
            nomineeName={formData.name}
            onImageUploaded={handleImageChange}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />

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