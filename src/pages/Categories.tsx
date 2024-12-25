import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CategoryTabs } from "@/components/voting/CategoryTabs";
import { NomineesList } from "@/components/voting/NomineesList";
import { FinishVotingButton } from "@/components/voting/FinishVotingButton";
import { Category } from "@/types/categories";
import { Nominee } from "@/types/nominees";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNominees, setSelectedNominees] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCategoriesAndNominees();
    fetchUserVotes();
  }, []);

  const fetchCategoriesAndNominees = async () => {
    try {
      const [categoriesResponse, nomineesResponse] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("nominees").select("*"),
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (nomineesResponse.error) throw nomineesResponse.error;

      setCategories(categoriesResponse.data);
      setNominees(nomineesResponse.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const { data: votesData, error } = await supabase
        .from("votes")
        .select("nominee_id, category_id");

      if (error) throw error;

      const votesMap: Record<string, string> = {};
      votesData?.forEach((vote) => {
        if (vote.category_id) {
          votesMap[vote.category_id] = vote.nominee_id;
        }
      });
      setSelectedNominees(votesMap);
    } catch (error) {
      console.error("Erreur lors du chargement des votes:", error);
    }
  };

  const handleVote = async (nomineeId: string, categoryId: string) => {
    try {
      if (selectedNominees[categoryId] === nomineeId) {
        return;
      }

      const { error } = await supabase
        .from("votes")
        .upsert({
          nominee_id: nomineeId,
          category_id: categoryId,
          email: 'user@example.com' // À remplacer par l'email de l'utilisateur connecté
        }, {
          onConflict: 'category_id,email'
        });

      if (error) throw error;

      setSelectedNominees(prev => ({
        ...prev,
        [categoryId]: nomineeId
      }));

      toast({
        title: "Vote enregistré",
        description: "Votre choix a été sauvegardé",
      });
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 golden-reflection">
        Catégories
      </h1>

      <Tabs defaultValue={categories[0]?.id} className="w-full">
        <CategoryTabs categories={categories} />

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <NomineesList
              nominees={nominees}
              categoryId={category.id}
              selectedNomineeId={selectedNominees[category.id]}
              onVote={handleVote}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Ajout d'une marge en bas pour éviter que le bouton soit caché */}
      <div className="mb-32">
        <FinishVotingButton 
          selectedNominees={selectedNominees}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default Categories;