import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Nominee } from "@/types/nominees";

export const useNominees = (onUpdate: () => void) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"name" | "date">("name");
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("nominees")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le nominé",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Nominé supprimé avec succès",
    });
    onUpdate();
  };

  const handleSubmit = async (nominee: {
    name: string;
    description: string;
    category_id: string;
  }) => {
    const { error } = await supabase.from("nominees").insert([nominee]);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le nominé",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Nominé ajouté avec succès",
    });
    onUpdate();
  };

  const filterAndSortNominees = (nominees: Nominee[]) => {
    return nominees
      .filter(
        (nominee) =>
          nominee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nominee.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "name") {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  };

  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    handleDelete,
    handleSubmit,
    filterAndSortNominees,
  };
};