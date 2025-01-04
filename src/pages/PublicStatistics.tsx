import { VotingHistoryChart } from "@/components/statistics/VotingHistoryChart";
import { VotesChart } from "@/components/admin/statistics/components/VotesChart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PublicStatistics = () => {
  const { data: stats = [] } = useQuery({
    queryKey: ['public-vote-statistics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vote_statistics')
        .select('*')
        .order('vote_count', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000,
  });

  // Transform data for VotesChart
  const chartData = stats.map(stat => ({
    name: stat.nominee_name || '',
    votes: stat.vote_count || 0
  }));

  return (
    <div className="container max-w-7xl py-24 sm:py-32 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-12 text-gold">
        Statistiques des Votes en Direct
      </h1>

      {/* Historical Chart */}
      <VotingHistoryChart />

      {/* Current Votes Distribution */}
      <VotesChart data={chartData} />
    </div>
  );
};

export default PublicStatistics;