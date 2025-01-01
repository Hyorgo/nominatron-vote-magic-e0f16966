import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { logger } from '@/services/monitoring/logger';

export const useNomineesCrud = (onUpdate: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      logger.info('Deleting nominee:', { nomineeId: id });
      
      const { error } = await supabase
        .from("nominees")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé supprimé avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ["nominees"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onUpdate();
    } catch (error) {
      logger.error('Error deleting nominee:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le nominé",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (nominee: {
    name: string;
    description: string;
    category_id: string;
  }) => {
    try {
      logger.info('Adding new nominee:', nominee);
      
      const { error } = await supabase.from("nominees").insert([nominee]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé ajouté avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ["nominees"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onUpdate();
    } catch (error) {
      logger.error('Error adding nominee:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le nominé",
        variant: "destructive",
      });
    }
  };

  return {
    handleDelete,
    handleSubmit,
  };
};