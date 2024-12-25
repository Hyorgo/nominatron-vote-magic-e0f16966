import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Vote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface Nominee {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category_id: string | null;
}

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
      // Si on clique sur le même nominé déjà sélectionné, on ne fait rien
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

  const midPoint = Math.ceil(categories.length / 2);
  const firstRow = categories.slice(0, midPoint);
  const secondRow = categories.slice(midPoint);

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 golden-reflection">
        Catégories
      </h1>

      <Tabs defaultValue={categories[0]?.id} className="w-full">
        <div className="space-y-2 mb-8">
          <TabsList className="w-full justify-start bg-background/50 backdrop-blur-sm">
            {firstRow.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsList className="w-full justify-start bg-background/50 backdrop-blur-sm">
            {secondRow.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nominees
                .filter((nominee) => nominee.category_id === category.id)
                .map((nominee) => (
                  <div
                    key={nominee.id}
                    className="nominee-card group hover:scale-105 transition-all duration-300"
                  >
                    {nominee.image_url && (
                      <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                        <img
                          src={nominee.image_url}
                          alt={nominee.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {nominee.name}
                      </h3>
                      {selectedNominees[category.id] === nominee.id && (
                        <Star className="h-5 w-5 text-gold fill-gold animate-scale-in" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {nominee.description}
                    </p>
                    <Button 
                      onClick={() => handleVote(nominee.id, category.id)}
                      variant={selectedNominees[category.id] === nominee.id ? "secondary" : "default"}
                      className="w-full"
                    >
                      <Vote className="mr-2 h-4 w-4" />
                      {selectedNominees[category.id] === nominee.id ? "Sélectionné" : "Voter"}
                    </Button>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Categories;