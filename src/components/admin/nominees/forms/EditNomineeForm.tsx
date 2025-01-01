import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Category, Nominee } from "@/types/nominees";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { logger } from '@/services/monitoring/logger';
import { ImageUploadField } from "./ImageUploadField";
import { NomineeFormFields } from "./NomineeFormFields";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    logger.info('Début de la mise à jour du nominé', {
      nomineeId: nominee.id,
      formData
    });

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

      if (error) {
        logger.error('Erreur lors de la mise à jour', error);
        throw error;
      }

      logger.info('Nominé mis à jour avec succès');
      toast({
        title: "Succès",
        description: "Nominé mis à jour avec succès"
      });
      onUpdate();
      onClose();
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du nominé:', error);
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
          <NomineeFormFields
            formData={formData}
            onFormChange={handleFormChange}
            categories={categories}
          />

          <ImageUploadField
            imageUrl={formData.image_url}
            nomineeName={formData.name}
            onImageChange={(url) => handleFormChange('image_url', url)}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isSubmitting}
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