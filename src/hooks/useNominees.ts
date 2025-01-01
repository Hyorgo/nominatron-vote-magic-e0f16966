import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Nominee } from "@/types/nominees";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { logger } from '@/services/monitoring/logger';

const fetchNominees = async () => {
  const { data, error } = await supabase
    .from("nominees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const useNominees = (onUpdate: () => void) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"name" | "date">("name");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: nominees = [] } = useQuery({
    queryKey: ["nominees"],
    queryFn: fetchNominees,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const filterAndSortNominees = (nominees: Nominee[]) => {
    logger.info('Filtering and sorting nominees:', {
      searchTerm,
      sortOrder,
      totalNominees: nominees.length
    });

    return nominees
      .filter((nominee) => {
        const matchesSearch = 
          nominee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nominee.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        logger.info(`Filtering nominee ${nominee.name}:`, {
          nomineeId: nominee.id,
          matchesSearch
        });
        
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === "name") {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  };

  const handleDelete = async (id: string) => {
    try {
      logger.info('Deleting nominee:', { nomineeId: id });
      
      const { error } = await supabase
        .from("nominees")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé supprimé avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ["nominees"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onUpdate();
    } catch (error) {
      logger.error('Error deleting nominee:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le nominé",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (nominee: {
    name: string;
    description: string;
    category_id: string;
  }) => {
    try {
      logger.info('Adding new nominee:', nominee);
      
      const { error } = await supabase.from("nominees").insert([nominee]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nominé ajouté avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ["nominees"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onUpdate();
    } catch (error) {
      logger.error('Error adding nominee:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le nominé",
        variant: "destructive",
      });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    handleDelete,
    handleSubmit,
    filterAndSortNominees,
    nominees,
  };
};