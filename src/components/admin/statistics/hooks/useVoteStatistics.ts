import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

interface TopNominee {
  name: string;
  votes: number;
  category: string;
}

export const useVoteStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<CategoryStats[]>([]);
  const [topNominee, setTopNominee] = useState<TopNominee | null>(null);

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

  return {
    loading,
    statistics,
    topNominee,
  };
};