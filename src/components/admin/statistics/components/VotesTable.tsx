import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

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
  const [voteCount, setVoteCount] = useState<number>(1);

  const addVotes = async (categoryName: string, nomineeName: string, numberOfVotes: number) => {
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

      // Préparer les votes à insérer
      const votesToInsert = Array.from({ length: numberOfVotes }, (_, index) => ({
        nominee_id: nominee.id,
        category_id: nominee.category_id,
        email: `admin_vote_${Date.now()}_${index}@example.com`
      }));

      // Ajouter les votes
      const { error } = await supabase
        .from('votes')
        .insert(votesToInsert);

      if (error) throw error;

      toast({
        title: "Votes ajoutés",
        description: `${numberOfVotes} vote(s) ont été ajoutés pour ${nomineeName}`,
      });

      // Attendre un peu pour laisser le temps aux triggers de mettre à jour les statistiques
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Erreur lors de l\'ajout des votes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter les votes",
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52" align="end">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Ajouter des votes</h4>
                          <p className="text-sm text-muted-foreground">
                            Nombre de votes à ajouter
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Input
                              type="number"
                              min="1"
                              value={voteCount}
                              onChange={(e) => setVoteCount(parseInt(e.target.value) || 1)}
                              className="col-span-2 h-8"
                            />
                            <Button
                              size="sm"
                              onClick={() => addVotes(stat.categoryName, nominee.name, voteCount)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};