import { Category } from "@/types/nominees";
import { VotingContainer } from "./content/VotingContainer";
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
  const category = categories[currentCategory];

  useEffect(() => {
    if (category) {
      console.log("État actuel:", {
        categoryId: category.id,
        categoryName: category.name,
        selectedNomineeId: selectedNominees[category.id],
        allSelectedNominees: selectedNominees,
        nominees: category.nominees.map(n => ({
          id: n.id,
          name: n.name,
          isSelected: selectedNominees[category.id] === n.id
        }))
      });
    }
  }, [category, selectedNominees]);

  const handleTabChange = (categoryId: string) => {
    const newIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (newIndex !== -1) {
      onCategoryChange(newIndex);
    }
  };

  const handleVote = async (nomineeId: string) => {
    if (!category) return;
    
    try {
      await onVote(category.id, nomineeId);
      
      if (currentCategory < categories.length - 1) {
        setTimeout(() => {
          onCategoryChange(currentCategory + 1);
        }, 1000);
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      throw error;
    }
  };

  if (!category) {
    return null;
  }

  return (
    <VotingContainer
      categories={categories}
      currentCategory={category}
      selectedNominees={selectedNominees}
      onTabChange={handleTabChange}
      onVote={handleVote}
    />
  );
};