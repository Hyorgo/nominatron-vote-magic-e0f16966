import { CategoryNavigation } from "./CategoryNavigation";
import { NomineeCard } from "./NomineeCard";
import { FinishVotingButton } from "./FinishVotingButton";
import { Category } from "@/types/nominees";
import { useToast } from "@/hooks/use-toast";
import { Tabs } from "@/components/ui/tabs";
import { CategoryTabs } from "./CategoryTabs";

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

  const handleVote = async (categoryId: string, nomineeId: string) => {
    try {
      console.log("Début du vote...", { categoryId, nomineeId });
      
      // Attendre explicitement que le vote soit enregistré
      await onVote(categoryId, nomineeId);
      console.log("Vote enregistré avec succès");
      
      // Afficher la notification de succès
      toast({
        title: "Vote enregistré !",
        description: `Votre choix a été sauvegardé avec succès${
          currentCategory < categories.length - 1 ? ". Passage à la catégorie suivante..." : " !"
        }`,
      });

      // Passer à la catégorie suivante si ce n'est pas la dernière
      if (currentCategory < categories.length - 1) {
        setTimeout(() => {
          onCategoryChange(currentCategory + 1);
        }, 1000); // Augmenté à 1000ms pour plus de stabilité
      }
    } catch (error) {
      console.error("Erreur détaillée lors du vote:", error);
      toast({
        variant: "destructive",
        title: "Erreur lors du vote",
        description: "Impossible d'enregistrer votre vote pour le moment. Veuillez réessayer.",
      });
    }
  };

  const handleTabChange = (categoryId: string) => {
    const newIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (newIndex !== -1) {
      onCategoryChange(newIndex);
    }
  };

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