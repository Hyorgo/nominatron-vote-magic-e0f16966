import { CategoryNavigation } from "./CategoryNavigation";
import { NomineeCard } from "./NomineeCard";
import { FinishVotingButton } from "./FinishVotingButton";
import { Category } from "@/types/nominees";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="space-y-8 px-4 sm:px-0">
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold text-center golden-reflection">
          {category.name}
        </h2>
        
        <div className="flex items-center justify-center gap-4 w-full">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onCategoryChange(Math.max(0, currentCategory - 1))}
            disabled={currentCategory === 0}
            className="w-32"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => onCategoryChange(Math.min(categories.length - 1, currentCategory + 1))}
            disabled={currentCategory === categories.length - 1}
            className="w-32"
          >
            Suivant
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="w-full max-w-2xl overflow-x-auto">
          <div className="flex flex-wrap justify-center gap-2 py-4">
            {categories.map((cat, index) => (
              <Button
                key={cat.id}
                variant={currentCategory === index ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(index)}
                className="min-w-[120px]"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

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

      <FinishVotingButton 
        selectedNominees={selectedNominees}
        categories={categories}
      />
    </div>
  );
};