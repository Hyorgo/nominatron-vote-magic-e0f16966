import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Trash, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      // Supprimer d'abord les nominés (à cause de la contrainte de clé étrangère)
      const { error: nomineesError } = await supabase
        .from("nominees")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Supprime tous les nominés

      if (nomineesError) throw nomineesError;

      // Ensuite supprimer les catégories
      const { error: categoriesError } = await supabase
        .from("categories")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Supprime toutes les catégories

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleteLoading}>
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              Tout supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement toutes les catégories et tous les nominés.
                Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAllData}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer tout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
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