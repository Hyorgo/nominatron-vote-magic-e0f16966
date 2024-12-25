import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface VotingConfig {
  start_date: string;
  end_date: string;
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
  // ... autres catégories
];

export const VotingInterface = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [selectedNominees, setSelectedNominees] = useState<Record<number, number>>({});
  const [votingConfig, setVotingConfig] = useState<VotingConfig | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVotingConfig();
  }, []);

  const loadVotingConfig = async () => {
    try {
      const { data: config } = await supabase
        .from('voting_config')
        .select('start_date, end_date')
        .single();

      if (config) {
        setVotingConfig(config);
        const now = new Date();
        const startDate = new Date(config.start_date);
        const endDate = new Date(config.end_date);
        setIsVotingOpen(now >= startDate && now <= endDate);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

  const handleNomineeSelect = (categoryId: number, nomineeId: number) => {
    if (!isVotingOpen) return;

    setSelectedNominees((prev) => ({
      ...prev,
      [categoryId]: nomineeId,
    }));
    
    toast({
      title: "Vote enregistré",
      description: "Votre choix a été sauvegardé",
    });
  };

  const category = mockCategories[currentCategory];

  return (
    <div className="container py-8 animate-fade-in">
      <div className="text-center mb-8">
        {isVotingOpen ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Découvrez les nominés et votez pour vos favoris dans chaque catégorie</h2>
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
          <div className="category-nav mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentCategory((prev) => Math.max(0, prev - 1))}
              disabled={currentCategory === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <h2 className="text-xl font-bold">{category.name}</h2>
              <p className="text-sm text-muted-foreground">
                Catégorie {currentCategory + 1} sur {mockCategories.length}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentCategory((prev) => Math.min(mockCategories.length - 1, prev + 1))}
              disabled={currentCategory === mockCategories.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.nominees.map((nominee) => (
              <div
                key={nominee.id}
                className={`nominee-card animate-scale-in ${
                  selectedNominees[category.id] === nominee.id ? "selected" : ""
                }`}
                onClick={() => handleNomineeSelect(category.id, nominee.id)}
              >
                {selectedNominees[category.id] === nominee.id && (
                  <div className="absolute top-4 right-4">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2">{nominee.name}</h3>
                <p className="text-muted-foreground">{nominee.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};