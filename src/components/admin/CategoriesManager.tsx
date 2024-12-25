import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Trash } from "lucide-react";

interface Category {
  id: string;
  name: string;
  display_order: number;
}

export const CategoriesManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les catégories",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const { error } = await supabase.from("categories").insert([
        {
          name: newCategoryName,
          display_order: categories.length + 1,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Catégorie ajoutée avec succès",
      });

      setNewCategoryName("");
      onUpdate();
      await fetchCategories();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });

      onUpdate();
      await fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Gestion des catégories</h3>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nom de la nouvelle catégorie"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button onClick={addCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 bg-background rounded-lg"
          >
            <span>{category.name}</span>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteCategory(category.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};