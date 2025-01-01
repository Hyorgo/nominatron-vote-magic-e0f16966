import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';
import { Nominee } from "@/types/nominees";

interface UseNomineeFormProps {
  nominee: Nominee;
  onUpdate: () => void;
  onClose: () => void;
}

export const useNomineeForm = ({ nominee, onUpdate, onClose }: UseNomineeFormProps) => {
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

  return {
    formData,
    isUploading,
    setIsUploading,
    isSubmitting,
    handleFormChange,
    handleSubmit
  };
};