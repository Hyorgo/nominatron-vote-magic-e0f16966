import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ParticipantsTable } from "./participants/ParticipantsTable";
import { ParticipantsActions } from "./participants/ParticipantsActions";
import { useQuery } from "@tanstack/react-query";

type Participant = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
};

const ITEMS_PER_PAGE = 50;

export const VoteParticipants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: participantsData, isLoading } = useQuery({
    queryKey: ['participants', currentPage, searchTerm],
    queryFn: async () => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("validated_emails")
        .select("*", { count: 'exact' });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;

      return {
        participants: data || [],
        total: count || 0
      };
    },
    staleTime: 30000, // Cache for 30 seconds
    keepPreviousData: true
  });

  const handleEdit = async (participant: Participant) => {
    try {
      const { error } = await supabase
        .from("validated_emails")
        .update({
          first_name: participant.first_name,
          last_name: participant.last_name,
        })
        .eq("email", participant.email);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le participant a été mis à jour",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le participant",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (email: string) => {
    try {
      const { error } = await supabase
        .from("validated_emails")
        .delete()
        .eq("email", email);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le participant a été supprimé",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le participant",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      const { error } = await supabase
        .from("validated_emails")
        .delete()
        .neq("email", "dummy");

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tous les participants ont été supprimés",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les participants",
        variant: "destructive",
      });
    }
  };

  const handleExportCsv = () => {
    if (!participantsData?.participants) return;
    
    const csvContent = [
      ["Email", "Prénom", "Nom", "Date d'inscription"],
      ...participantsData.participants.map((p) => [
        p.email,
        p.first_name || "",
        p.last_name || "",
        new Date(p.created_at).toLocaleDateString("fr-FR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = participantsData ? Math.ceil(participantsData.total / ITEMS_PER_PAGE) : 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <ParticipantsActions
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onDeleteAll={handleDeleteAll}
          onExportCsv={handleExportCsv}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ParticipantsTable
          participants={participantsData?.participants || []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </Card>
  );
};