import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const handleEdit = async () => {
    if (!editingParticipant) return;

    try {
      const { error } = await supabase
        .from("validated_emails")
        .update({
          first_name: editingParticipant.first_name,
          last_name: editingParticipant.last_name,
        })
        .eq("email", editingParticipant.email);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le participant a été mis à jour",
      });

      loadParticipants();
      setIsEditDialogOpen(false);
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

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Participants aux votes</h3>
          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="Rechercher..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Tout supprimer</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera définitivement tous les participants. Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll}>
                    Supprimer tout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredParticipants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucun participant trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredParticipants.map((participant) => (
                  <TableRow key={participant.email}>
                    <TableCell>{participant.email}</TableCell>
                    <TableCell>{participant.first_name || "-"}</TableCell>
                    <TableCell>{participant.last_name || "-"}</TableCell>
                    <TableCell>
                      {new Date(participant.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingParticipant(participant)}
                            >
                              Modifier
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier le participant</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label htmlFor="first_name">Prénom</label>
                                <Input
                                  id="first_name"
                                  value={editingParticipant?.first_name || ""}
                                  onChange={(e) =>
                                    setEditingParticipant(prev => ({
                                      ...prev!,
                                      first_name: e.target.value
                                    }))
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="last_name">Nom</label>
                                <Input
                                  id="last_name"
                                  value={editingParticipant?.last_name || ""}
                                  onChange={(e) =>
                                    setEditingParticipant(prev => ({
                                      ...prev!,
                                      last_name: e.target.value
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleEdit}>Enregistrer</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                            >
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action supprimera définitivement ce participant. Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(participant.email)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};