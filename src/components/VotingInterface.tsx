import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CategoryNavigation } from "./voting/CategoryNavigation";
import { NomineeCard } from "./voting/NomineeCard";
import { useVoting } from "@/hooks/useVoting";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VotingRegistrationForm } from "./voting/VotingRegistrationForm";
import { Category, Nominee } from "@/types/nominees";
import { useToast } from "@/hooks/use-toast";

export const VotingInterface = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const { isVotingOpen, selectedNominees, handleNomineeSelect } = useVoting();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const handleVote = async (categoryId: string, nomineeId: string) => {
    await handleNomineeSelect(categoryId, nomineeId);
    toast({
      title: "Vote enregistré !",
      description: `Votre choix a été sauvegardé avec succès${currentCategory < categories.length - 1 ? ". Passage à la catégorie suivante..." : " !"}`,
    });

    if (currentCategory < categories.length - 1) {
      setTimeout(() => {
        setCurrentCategory(prev => prev + 1);
      }, 500);
    }
  };

  const getVotedCategoriesCount = () => {
    return Object.keys(selectedNominees).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const category = categories[currentCategory];

  if (!category) {
    return (
      <div className="text-center py-8">
        Aucune catégorie disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8 animate-fade-in">
      <div className="text-center mb-8">
        {isVotingOpen ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Découvrez les nominés et votez pour vos favoris dans chaque catégorie
            </h2>
            <Button 
              variant="default" 
              size="lg" 
              className="mb-8"
              onClick={() => setDialogOpen(true)}
            >
              Voter maintenant
            </Button>
          </>
        ) : (
          <h2 className="text-2xl font-bold mb-4">
            Les votes ne sont pas encore ouverts. Revenez bientôt pour découvrir les nominés et voter pour vos favoris.
          </h2>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscription pour voter</DialogTitle>
            <DialogDescription>
              Veuillez renseigner vos informations pour participer aux votes.
            </DialogDescription>
          </DialogHeader>
          <VotingRegistrationForm onClose={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {isVotingOpen && (
        <>
          <CategoryNavigation
            categoryName={category.name}
            currentIndex={currentCategory}
            totalCategories={categories.length}
            votedCategories={getVotedCategoriesCount()}
            onPrevious={() => setCurrentCategory((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentCategory((prev) => Math.min(categories.length - 1, prev + 1))}
            onSelectCategory={(index) => setCurrentCategory(index)}
            categories={categories}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.nominees.map((nominee) => (
              <NomineeCard
                key={nominee.id}
                nominee={nominee}
                isSelected={selectedNominees[category.id] === nominee.id}
                onClick={() => handleVote(category.id, nominee.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};