import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useVoting } from "@/hooks/useVoting";
import { Category } from "@/types/nominees";
import { VotingHeader } from "./voting/VotingHeader";
import { VotingDialog } from "./voting/VotingDialog";
import { VotingContent } from "./voting/VotingContent";
import { VotingCountdown } from "./voting/VotingCountdown";
import { useToast } from "./ui/use-toast";

export const VotingInterface = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const { isVotingOpen, selectedNominees, handleNomineeSelect, votingConfig, userEmail } = useVoting();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les catégories et les nominés",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategoryChange = useCallback((index: number) => {
    setCurrentCategory(index);
  }, []);

  const currentCategoryData = useMemo(() => 
    categories[currentCategory], 
    [categories, currentCategory]
  );

  if (isLoading) {
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

      {votingConfig?.end_date && (
        <div className="mb-6">
          <VotingCountdown 
            endDate={new Date(votingConfig.end_date)}
            userEmail={userEmail}
          />
        </div>
      )}

      <VotingDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {isVotingOpen && currentCategoryData && (
        <VotingContent
          currentCategory={currentCategory}
          categories={categories}
          selectedNominees={selectedNominees}
          onCategoryChange={handleCategoryChange}
          onVote={handleNomineeSelect}
        />
      )}
    </div>
  );
};