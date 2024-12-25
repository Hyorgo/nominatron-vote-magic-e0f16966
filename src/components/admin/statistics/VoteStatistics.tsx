import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VoteStatistic {
  category_id: string;
  category_name: string;
  nominee_id: string;
  nominee_name: string;
  vote_count: number;
}

interface CategoryStats {
  categoryName: string;
  totalVotes: number;
  nominees: {
    name: string;
    votes: number;
    percentage: number;
  }[];
}

export const VoteStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<CategoryStats[]>([]);
  const [topNominee, setTopNominee] = useState<{
    name: string;
    votes: number;
    category: string;
  } | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from("vote_statistics")
        .select("*")
        .order("vote_count", { ascending: false });

      if (error) throw error;

      // Organiser les données par catégorie
      const statsMap = new Map<string, CategoryStats>();
      let maxVotes = 0;
      let topNomineeData = null;

      data?.forEach((stat: VoteStatistic) => {
        if (!statsMap.has(stat.category_id)) {
          statsMap.set(stat.category_id, {
            categoryName: stat.category_name || "Inconnu",
            totalVotes: 0,
            nominees: [],
          });
        }

        const categoryStats = statsMap.get(stat.category_id)!;
        categoryStats.totalVotes += stat.vote_count || 0;

        if ((stat.vote_count || 0) > maxVotes) {
          maxVotes = stat.vote_count || 0;
          topNomineeData = {
            name: stat.nominee_name || "Inconnu",
            votes: stat.vote_count || 0,
            category: stat.category_name || "Inconnu",
          };
        }
      });

      // Calculer les pourcentages
      data?.forEach((stat: VoteStatistic) => {
        const categoryStats = statsMap.get(stat.category_id)!;
        categoryStats.nominees.push({
          name: stat.nominee_name || "Inconnu",
          votes: stat.vote_count || 0,
          percentage:
            categoryStats.totalVotes > 0
              ? ((stat.vote_count || 0) / categoryStats.totalVotes) * 100
              : 0,
        });
      });

      setStatistics(Array.from(statsMap.values()));
      setTopNominee(topNomineeData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      {/* Top Nominee */}
      {topNominee && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Nominé le plus populaire</h3>
          <p>
            {topNominee.name} ({topNominee.category}) avec {topNominee.votes}{" "}
            votes
          </p>
        </Card>
      )}

      {/* Graphique des votes par catégorie */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Distribution des votes par catégorie
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statistics.map((stat) => ({
                name: stat.categoryName,
                votes: stat.totalVotes,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tableau détaillé */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Détails des votes par catégorie
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead>Nominé</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead className="text-right">Pourcentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.map((category) =>
                category.nominees.map((nominee, index) => (
                  <TableRow key={`${category.categoryName}-${nominee.name}`}>
                    {index === 0 && (
                      <TableCell rowSpan={category.nominees.length}>
                        {category.categoryName}
                      </TableCell>
                    )}
                    <TableCell>{nominee.name}</TableCell>
                    <TableCell className="text-right">{nominee.votes}</TableCell>
                    <TableCell className="text-right">
                      {nominee.percentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};