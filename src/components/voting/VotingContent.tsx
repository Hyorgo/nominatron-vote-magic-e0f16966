import { CategoryNavigation } from "./CategoryNavigation";
import { NomineeCard } from "./NomineeCard";
import { FinishVotingButton } from "./FinishVotingButton";
import { Category } from "@/types/nominees";
import { useToast } from "@/hooks/use-toast";
import { Tabs } from "@/components/ui/tabs";
import { CategoryTabs } from "./CategoryTabs";
import { useEffect } from "react";

interface VotingContentProps {
  currentCategory: number;
  categories: Category[];
  selectedNominees: Record<string, string>;
  onCategoryChange: (index: number) => void;
  onVote: (categoryId: string, nomineeId: string) => Promise<void>;
}

export const VotingContent = ({
  currentCategory,
  categories,
  selectedNominees,
  onCategoryChange,
  onVote,
}: VotingContentProps) => {
  const { toast } = useToast();
  const category = categories[currentCategory];

  // Log l'état initial et les changements
  useEffect(() => {
    if (category) {
      console.log("Catégorie actuelle:", {
        id: category.id,
        name: category.name,
        selectedNomineeId: selectedNominees[category.id]
      });
    }
  }, [category, selectedNominees]);

  const handleVote = async (nomineeId: string) => {
    try {
      console.log("Tentative de vote pour:", { 
        categoryId: category.id, 
        nomineeId,
        currentCategory,
        currentSelectedNominee: selectedNominees[category.id]
      });
      
      await onVote(category.id, nomineeId);
      
      // Passer à la catégorie suivante si ce n'est pas la dernière
      if (currentCategory < categories.length - 1) {
        setTimeout(() => {
          onCategoryChange(currentCategory + 1);
        }, 1500);
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        variant: "destructive",
        title: "Erreur lors du vote",
        description: "Une erreur est survenue lors de l'enregistrement de votre vote. Veuillez réessayer."
      });
    }
  };

  const handleTabChange = (categoryId: string) => {
    const newIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (newIndex !== -1) {
      onCategoryChange(newIndex);
    }
  };

  if (!category) {
    return null;
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center golden-reflection">
          Votez pour vos établissements préférés
        </h2>

        <Tabs
          value={category.id}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <CategoryTabs 
            categories={categories} 
            currentCategory={category.id}
            selectedNominees={selectedNominees}
          />
        </Tabs>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.nominees.map((nominee) => {
          const isSelected = selectedNominees[category.id] === nominee.id;
          console.log(`Nominee ${nominee.id} selected:`, isSelected);
          
          return (
            <NomineeCard
              key={nominee.id}
              nominee={nominee}
              isSelected={isSelected}
              onClick={() => handleVote(nominee.id)}
            />
          );
        })}
      </div>

      <FinishVotingButton 
        selectedNominees={selectedNominees}
        categories={categories}
      />
    </div>
  );
};