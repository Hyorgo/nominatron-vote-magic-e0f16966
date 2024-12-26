import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { NomineeForm } from "./nominees/NomineeForm";
import { NomineesList } from "./nominees/NomineesList";
import { Category } from "../../types/nominees";
import { PaginationControls } from "../ui/pagination-controls";

const ITEMS_PER_PAGE = 10;

export const NomineesManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const [categoriesResponse, nomineesResponse, totalCount] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase
          .from("nominees")
          .select("*")
          .range(start, end)
          .order("created_at", { ascending: false }),
        supabase.from("nominees").select("*", { count: "exact", head: true }),
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (nomineesResponse.error) throw nomineesResponse.error;

      const total = totalCount.count || 0;
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

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
      <NomineeForm categories={categories} onSubmit={addNominee} />
      <NomineesList categories={categories} onDelete={deleteNominee} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
};