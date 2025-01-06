import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AddNomineeForm } from "./nominees/AddNomineeForm";
import { NomineesList } from "./nominees/NomineesList";
import { Category } from "@/types/nominees";

export const NomineesManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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
      <h3 className="text-lg font-semibold mb-4">Gestion des nominés</h3>
      <AddNomineeForm categories={categories} onSubmit={addNominee} />
      <NomineesList categories={categories} onDelete={deleteNominee} />
    </Card>
  );
};