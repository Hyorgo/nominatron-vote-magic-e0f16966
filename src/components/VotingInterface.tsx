import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useVoting } from "@/hooks/useVoting";
import { Category } from "@/types/nominees";
import { VotingHeader } from "./voting/VotingHeader";
import { VotingDialog } from "./voting/VotingDialog";
import { VotingContent } from "./voting/VotingContent";

export const VotingInterface = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const { isVotingOpen, selectedNominees, handleNomineeSelect } = useVoting();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesResponse, nomineesResponse] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("nominees").select("*"),
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (nomineesResponse.error) throw nomineesResponse.error;

      const categoriesWithNominees = categoriesResponse.data.map((category) => ({
        ...category,
        nominees: nomineesResponse.data.filter(
          (nominee) => nominee.category_id === category.id
        ),
      }));

      setCategories(categoriesWithNominees);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-8">
        Aucune catégorie disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8 animate-fade-in">
      <VotingHeader 
        isVotingOpen={isVotingOpen}
        onOpenDialog={() => setDialogOpen(true)}
      />

      <VotingDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {isVotingOpen && (
        <VotingContent
          currentCategory={currentCategory}
          categories={categories}
          selectedNominees={selectedNominees}
          onCategoryChange={setCurrentCategory}
          onVote={handleNomineeSelect}
        />
      )}
    </div>
  );
};