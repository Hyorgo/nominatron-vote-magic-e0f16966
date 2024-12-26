import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/nominees";

const fetchCategoriesData = async () => {
  const [categoriesResponse, nomineesResponse] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("nominees").select("*"),
  ]);

  if (categoriesResponse.error) throw categoriesResponse.error;
  if (nomineesResponse.error) throw nomineesResponse.error;

  return categoriesResponse.data.map((category) => ({
    ...category,
    nominees: nomineesResponse.data.filter(
      (nominee) => nominee.category_id === category.id
    ),
  }));
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
    meta: {
      errorHandler: (error: Error) => {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les catégories et les nominés",
        });
      }
    }
  });

  if (error && error instanceof Error) {
    error.message && toast({
      variant: "destructive",
      title: "Erreur",
      description: error.message
    });
  }

  return {
    categories,
    isLoading,
    fetchCategories,
  };
};