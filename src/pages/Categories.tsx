import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    fetchCategoriesAndNominees();
  }, []);

  const fetchCategoriesAndNominees = async () => {
    try {
      // Charger les catégories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");

      if (categoriesError) throw categoriesError;

      // Charger les nominés
      const { data: nomineesData, error: nomineesError } = await supabase
        .from("nominees")
        .select("*");

      if (nomineesError) throw nomineesError;

      setCategories(categoriesData);
      setNominees(nomineesData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
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
        <TabsList className="w-full justify-start mb-8 bg-background/50 backdrop-blur-sm">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

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
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {nominee.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {nominee.description}
                    </p>
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