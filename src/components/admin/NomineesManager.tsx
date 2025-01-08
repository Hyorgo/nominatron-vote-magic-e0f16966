import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CategoryList } from "./categories/CategoryList";
import { CategoryForm } from "./categories/CategoryForm";
import { DeleteAllButton } from "./categories/DeleteAllButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AddNomineeForm } from "./nominees/AddNomineeForm";
import { NomineesList } from "./nominees/NomineesList";
import type { Category, Nominee } from "@/types/nominees";

export const NomineesManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNominee, setEditingNominee] = useState<Nominee | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesResponse, nomineesResponse] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase
          .from("nominees")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (nomineesResponse.error) throw nomineesResponse.error;

      const categoriesWithNominees = categoriesResponse.data.map((category) => ({
        ...category,
        nominees: nomineesResponse.data.filter(
          (nominee) => nominee.category_id === category.id
        ),
      }));

      setCategories(categoriesWithNominees);
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

  const addNominee = async (nominee: {
    name: string;
    description: string;
    category_id: string;
  }) => {
    try {
      const { error } = await supabase.from("nominees").insert([nominee]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé ajouté avec succès",
      });

      onUpdate();
      await fetchData();
    } catch (error) {
      console.error("Erreur lors de l'ajout du nominé:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le nominé",
      });
    }
  };

  const updateNominee = async (nominee: Nominee) => {
    try {
      const { error } = await supabase
        .from("nominees")
        .update({
          name: nominee.name,
          description: nominee.description,
          category_id: nominee.category_id,
          image_url: nominee.image_url
        })
        .eq("id", nominee.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé mis à jour avec succès",
      });

      setEditingNominee(null);
      onUpdate();
      await fetchData();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nominé:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le nominé",
      });
    }
  };

  const deleteNominee = async (id: string) => {
    try {
      const { error } = await supabase.from("nominees").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé supprimé avec succès",
      });

      onUpdate();
      await fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression du nominé:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le nominé",
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Gestion des nominés</h3>
        <DeleteAllButton isLoading={loading} onDelete={deleteNominee} />
      </div>
      
      <CategoryForm
        newCategoryName=""
        onNameChange={() => {}}
        onSubmit={() => {}}
      />

      <NomineesList 
        categories={categories} 
        onDelete={deleteNominee}
        onEdit={setEditingNominee}
      />
      
      <Dialog open={!!editingNominee} onOpenChange={() => setEditingNominee(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {editingNominee && (
            <AddNomineeForm
              categories={categories}
              onSubmit={(nominee) => updateNominee({ ...nominee, id: editingNominee.id, image_url: editingNominee.image_url })}
              initialValues={editingNominee}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};