import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ParticipantsTable } from "./participants/ParticipantsTable";
import { ParticipantsActions } from "./participants/ParticipantsActions";

type Participant = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
};

export const VoteParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const loadParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from("validated_emails")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des participants:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des participants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

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

      loadParticipants();
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

      loadParticipants();
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
        .neq("email", "dummy"); // Delete all records

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tous les participants ont été supprimés",
      });

      loadParticipants();
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
    // Prepare CSV data
    const csvContent = [
      ["Email", "Prénom", "Nom", "Date d'inscription"],
      ...participants.map((p) => [
        p.email,
        p.first_name || "",
        p.last_name || "",
        new Date(p.created_at).toLocaleDateString("fr-FR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <ParticipantsActions
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onDeleteAll={handleDeleteAll}
          onExportCsv={handleExportCsv}
        />

        <ParticipantsTable
          participants={filteredParticipants}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </Card>
  );
};