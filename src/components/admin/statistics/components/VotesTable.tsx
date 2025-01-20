import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CategoryStats {
  categoryName: string;
  totalVotes: number;
  nominees: {
    name: string;
    votes: number;
    percentage: number;
  }[];
}

interface VotesTableProps {
  statistics: CategoryStats[];
}

export const VotesTable = ({ statistics }: VotesTableProps) => {
  const { toast } = useToast();

  const addVote = async (categoryName: string, nomineeName: string) => {
    try {
      // Récupérer l'ID du nominé et de la catégorie
      const { data: nominee } = await supabase
        .from('nominees')
        .select('id, category_id')
        .eq('name', nomineeName)
        .single();

      if (!nominee) {
        throw new Error('Nominé non trouvé');
      }

      // Ajouter un vote
      const { error } = await supabase
        .from('votes')
        .insert({
          nominee_id: nominee.id,
          category_id: nominee.category_id,
          email: `admin_vote_${Date.now()}@example.com`
        });

      if (error) throw error;

      toast({
        title: "Vote ajouté",
        description: `Un vote a été ajouté pour ${nomineeName}`,
      });

      // Attendre un peu pour laisser le temps aux triggers de mettre à jour les statistiques
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Erreur lors de l\'ajout du vote:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le vote",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Catégorie</TableHead>
            <TableHead>Nominé</TableHead>
            <TableHead className="text-right">Votes</TableHead>
            <TableHead className="text-right">Pourcentage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statistics.map((stat) =>
            stat.nominees.map((nominee, nomineeIndex) => (
              <TableRow key={`${stat.categoryName}-${nominee.name}`}>
                {nomineeIndex === 0 && (
                  <TableCell rowSpan={stat.nominees.length} className="align-top">
                    {stat.categoryName}
                  </TableCell>
                )}
                <TableCell>{nominee.name}</TableCell>
                <TableCell className="text-right">{nominee.votes}</TableCell>
                <TableCell className="text-right">
                  {nominee.percentage.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addVote(stat.categoryName, nominee.name)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un vote
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};