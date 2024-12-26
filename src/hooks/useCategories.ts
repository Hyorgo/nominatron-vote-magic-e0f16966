import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/nominees";

interface QueryError extends Error {
  meta?: {
    errorHandler?: (error: Error) => void;
  };
}

const fetchCategoriesData = async () => {
  try {
    console.log("Début du chargement des catégories...");
    const [categoriesResponse, nomineesResponse] = await Promise.all([
      supabase.from("categories").select("*").order("display_order"),
      supabase.from("nominees").select("*"),
    ]);

    if (categoriesResponse.error) {
      console.error("Erreur lors du chargement des catégories:", categoriesResponse.error);
      throw new Error(`Erreur de chargement des catégories: ${categoriesResponse.error.message}`);
    }
    if (nomineesResponse.error) {
      console.error("Erreur lors du chargement des nominés:", nomineesResponse.error);
      throw new Error(`Erreur de chargement des nominés: ${nomineesResponse.error.message}`);
    }

    console.log("Données des catégories reçues:", categoriesResponse.data);
    console.log("Données des nominés reçues:", nomineesResponse.data);

    const categories = categoriesResponse.data.map((category) => ({
      ...category,
      nominees: nomineesResponse.data.filter(
        (nominee) => nominee.category_id === category.id
      ),
    }));

    console.log("Catégories avec nominés:", categories);
    return categories;
  } catch (error) {
    console.error("Erreur dans fetchCategoriesData:", error);
    throw error;
  }
};

export const useCategories = () => {
  const { toast } = useToast();

  const { 
    data: categories = [], 
    isLoading,
    refetch: fetchCategories,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesData,
    staleTime: 1000 * 60 * 5, // Cache valide pendant 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorHandler: (error: Error) => {
        console.error("Erreur dans useCategories:", error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les catégories et les nominés. Veuillez réessayer.",
        });
      }
    }
  });

  // Gestion des erreurs via la propriété error
  if (error) {
    const queryError = error as QueryError;
    if (queryError.meta?.errorHandler) {
      queryError.meta.errorHandler(error);
    }
  }

  return {
    categories,
    isLoading,
    fetchCategories,
  };
};