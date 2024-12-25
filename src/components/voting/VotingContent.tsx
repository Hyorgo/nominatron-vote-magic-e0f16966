import { CategoryNavigation } from "./CategoryNavigation";
import { NomineeCard } from "./NomineeCard";
import { Category } from "@/types/nominees";
import { useToast } from "@/hooks/use-toast";

interface VotingContentProps {
  currentCategory: number;
  categories: Category[];
  selectedNominees: Record<string, string>;
  onCategoryChange: (index: number) => void;
  onVote: (categoryId: string, nomineeId: string) => void;
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

  const handleVote = async (categoryId: string, nomineeId: string) => {
    await onVote(categoryId, nomineeId);
    toast({
      title: "Vote enregistré !",
      description: `Votre choix a été sauvegardé avec succès${currentCategory < categories.length - 1 ? ". Passage à la catégorie suivante..." : " !"}`,
    });

    if (currentCategory < categories.length - 1) {
      setTimeout(() => {
        onCategoryChange(currentCategory + 1);
      }, 500);
    }
  };

  return (
    <>
      <CategoryNavigation
        categoryName={category.name}
        currentIndex={currentCategory}
        totalCategories={categories.length}
        votedCategories={Object.keys(selectedNominees).length}
        onPrevious={() => onCategoryChange(Math.max(0, currentCategory - 1))}
        onNext={() => onCategoryChange(Math.min(categories.length - 1, currentCategory + 1))}
        onSelectCategory={onCategoryChange}
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
  );
};