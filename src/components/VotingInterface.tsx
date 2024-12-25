import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryNavigation } from "./voting/CategoryNavigation";
import { NomineeCard } from "./voting/NomineeCard";
import { useVoting } from "@/hooks/useVoting";

interface Nominee {
  id: number;
  name: string;
  description: string;
}

interface Category {
  id: number;
  name: string;
  nominees: Nominee[];
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Meilleur Restaurant",
    nominees: [
      { id: 1, name: "Le Gourmet", description: "Cuisine française raffinée" },
      { id: 2, name: "Sushi Master", description: "Sushi et cuisine japonaise" },
      { id: 3, name: "La Trattoria", description: "Authentique cuisine italienne" },
      { id: 4, name: "Le Bistrot", description: "Cuisine traditionnelle" },
      { id: 5, name: "L'Innovation", description: "Cuisine fusion moderne" },
    ],
  },
];

export const VotingInterface = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const { isVotingOpen, selectedNominees, handleNomineeSelect } = useVoting();

  const category = mockCategories[currentCategory];

  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-center mb-8">
        {isVotingOpen ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Découvrez les nominés et votez pour vos favoris dans chaque catégorie
            </h2>
            <Button variant="default" size="lg" className="mb-8">
              Voter maintenant
            </Button>
          </>
        ) : (
          <h2 className="text-2xl font-bold mb-4">
            Les votes ne sont pas encore ouverts. Revenez bientôt pour découvrir les nominés et voter pour vos favoris.
          </h2>
        )}
      </div>

      {isVotingOpen && (
        <>
          <CategoryNavigation
            categoryName={category.name}
            currentIndex={currentCategory}
            totalCategories={mockCategories.length}
            onPrevious={() => setCurrentCategory((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentCategory((prev) => Math.min(mockCategories.length - 1, prev + 1))}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.nominees.map((nominee) => (
              <NomineeCard
                key={nominee.id}
                nominee={nominee}
                isSelected={selectedNominees[category.id] === nominee.id}
                onClick={() => handleNomineeSelect(category.id, nominee.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};