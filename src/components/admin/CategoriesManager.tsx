import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CategoryList } from "./categories/CategoryList";
import { CategoryForm } from "./categories/CategoryForm";
import { DeleteAllButton } from "./categories/DeleteAllButton";

interface Category {
  id: string;
  name: string;
  display_order: number;
}

export const CategoriesManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  const deleteAllData = async () => {
    setDeleteLoading(true);
    try {
      const { error: nomineesError } = await supabase
        .from("nominees")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (nomineesError) throw nomineesError;

      const { error: categoriesError } = await supabase
        .from("categories")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (categoriesError) throw categoriesError;

      toast({
        title: "Succès",
        description: "Toutes les données ont été supprimées avec succès",
      });

      onUpdate();
      await fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer toutes les données",
      });
    } finally {
      setDeleteLoading(false);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gestion des catégories</h3>
        <DeleteAllButton isLoading={deleteLoading} onDelete={deleteAllData} />
      </div>
      
      <CategoryForm
        newCategoryName={newCategoryName}
        onNameChange={setNewCategoryName}
        onSubmit={addCategory}
      />

      <CategoryList categories={categories} onDelete={deleteCategory} />
    </Card>
  );
};