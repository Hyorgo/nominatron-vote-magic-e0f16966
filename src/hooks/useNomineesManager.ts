import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/nominees";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/services/monitoring/logger';

export const useNomineesManager = (onUpdate: () => void) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      logger.info('Début du chargement des catégories et nominés');

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");

      if (categoriesError) {
        logger.error('Erreur lors du chargement des catégories:', categoriesError);
        throw categoriesError;
      }

      const { data: nomineesData, error: nomineesError } = await supabase
        .from("nominees")
        .select("*")
        .order("created_at", { ascending: false });

      if (nomineesError) {
        logger.error('Erreur lors du chargement des nominés:', nomineesError);
        throw nomineesError;
      }

      const categoriesWithNominees = categoriesData.map((category) => ({
        ...category,
        nominees: nomineesData.filter(
          (nominee) => nominee.category_id === category.id
        ),
      }));

      logger.info('Données chargées avec succès:', {
        categoriesCount: categoriesData.length,
        nomineesCount: nomineesData.length,
      });

      setCategories(categoriesWithNominees);
    } catch (error) {
      logger.error('Erreur lors du chargement des données:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNominee = async (nominee: {
    name: string;
    description: string;
    category_id: string;
  }) => {
    try {
      logger.info('Tentative d\'ajout d\'un nominé:', nominee);
      const { error } = await supabase.from("nominees").insert([nominee]);

      if (error) {
        logger.error('Erreur lors de l\'ajout du nominé:', error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "Nominé ajouté avec succès",
      });

      onUpdate();
      await fetchData();
    } catch (error) {
      logger.error('Erreur lors de l\'ajout du nominé:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le nominé",
      });
    }
  };

  const deleteNominee = async (id: string) => {
    try {
      logger.info('Tentative de suppression du nominé:', id);
      const { error } = await supabase.from("nominees").delete().eq("id", id);

      if (error) {
        logger.error('Erreur lors de la suppression du nominé:', error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "Nominé supprimé avec succès",
      });

      onUpdate();
      await fetchData();
    } catch (error) {
      logger.error('Erreur lors de la suppression du nominé:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le nominé",
      });
    }
  };

  return {
    categories,
    loading,
    fetchData,
    addNominee,
    deleteNominee
  };
};