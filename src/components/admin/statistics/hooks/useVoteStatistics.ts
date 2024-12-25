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

interface VotesSummaryData {
  totalVotes: number;
  participationRate: number;
  votingTrend: number;
}

export const useVoteStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<CategoryStats[]>([]);
  const [topNominees, setTopNominees] = useState<TopNominee[]>([]);
  const [summaryData, setSummaryData] = useState<VotesSummaryData>({
    totalVotes: 0,
    participationRate: 0,
    votingTrend: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const calculateVotingTrend = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data: todayVotes } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .gte('created_at', new Date().toISOString().split('T')[0]);

    const { data: yesterdayVotes } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .gte('created_at', yesterday.toISOString().split('T')[0])
      .lt('created_at', new Date().toISOString().split('T')[0]);

    const todayCount = todayVotes?.length || 0;
    const yesterdayCount = yesterdayVotes?.length || 0;

    if (yesterdayCount === 0) return 0;
    return ((todayCount - yesterdayCount) / yesterdayCount) * 100;
  };

  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from("vote_statistics")
        .select("*")
        .order("vote_count", { ascending: false });

      if (error) throw error;

      // Process statistics
      const statsMap = new Map<string, CategoryStats>();
      let totalVotesCount = 0;

      // Prepare top nominees array
      const allNominees = data?.map((stat: VoteStatistic) => ({
        name: stat.nominee_name || "Inconnu",
        votes: stat.vote_count || 0,
        category: stat.category_name || "Inconnu",
      })) || [];

      // Sort by votes and take top 3
      const topThreeNominees = allNominees
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 3);

      data?.forEach((stat: VoteStatistic) => {
        if (!statsMap.has(stat.category_id)) {
          statsMap.set(stat.category_id, {
            categoryName: stat.category_name || "Inconnu",
            totalVotes: 0,
            nominees: [],
          });
        }

        const categoryStats = statsMap.get(stat.category_id)!;
        const voteCount = stat.vote_count || 0;
        categoryStats.totalVotes += voteCount;
        totalVotesCount += voteCount;

        categoryStats.nominees.push({
          name: stat.nominee_name || "Inconnu",
          votes: voteCount,
          percentage:
            categoryStats.totalVotes > 0
              ? (voteCount / categoryStats.totalVotes) * 100
              : 0,
        });
      });

      // Calculate voting trend
      const trend = await calculateVotingTrend();

      // Fetch total expected voters
      const { count: totalExpectedVoters } = await supabase
        .from('validated_emails')
        .select('*', { count: 'exact' });

      setStatistics(Array.from(statsMap.values()));
      setTopNominees(topThreeNominees);
      setSummaryData({
        totalVotes: totalVotesCount,
        participationRate: totalExpectedVoters ? (totalVotesCount / totalExpectedVoters) * 100 : 0,
        votingTrend: trend,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    statistics,
    topNominees,
    summaryData,
  };
};
