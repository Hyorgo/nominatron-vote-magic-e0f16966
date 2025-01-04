import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface VoteStats {
  nominee_name: string;
  category_name: string;
  vote_count: number;
  trend?: "up" | "down" | null;
}

interface RawVoteStats {
  nominee_name: string;
  category_name: string;
  vote_count: number;
}

const PublicStatistics = () => {
  const [previousStats, setPreviousStats] = useState<Record<string, number>>({});

  const { data: stats = [], refetch } = useQuery<VoteStats[]>({
    queryKey: ['public-vote-statistics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vote_statistics')
        .select('nominee_name, category_name, vote_count')
        .order('vote_count', { ascending: false });

      if (error) throw error;

      // Calculate trends by comparing with previous stats
      const newStats = (data as RawVoteStats[] || []).map((stat): VoteStats => {
        const previousCount = previousStats[stat.nominee_name] || 0;
        const trend = stat.vote_count > previousCount ? 'up' as const : 
                     stat.vote_count < previousCount ? 'down' as const : 
                     null;
        return { ...stat, trend };
      });

      // Update previous stats for next comparison
      const newPreviousStats = Object.fromEntries(
        newStats.map((stat) => [stat.nominee_name, stat.vote_count])
      );
      setPreviousStats(newPreviousStats);

      return newStats;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('vote-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Get top 5 overall
  const top5Overall = stats?.slice(0, 5) || [];

  // Get winners by category
  const winnersByCategory = (stats || []).reduce<VoteStats[]>((acc, curr) => {
    const existingCategory = acc.find(item => item.category_name === curr.category_name);
    if (!existingCategory) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const TrendIcon = ({ trend }: { trend?: "up" | "down" | null }) => {
    if (trend === 'up') return <ArrowUp className="text-green-500" />;
    if (trend === 'down') return <ArrowDown className="text-red-500" />;
    return null;
  };

  return (
    <div className="container max-w-7xl py-24 sm:py-32 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-12 text-gold">
        Statistiques des Votes en Direct
      </h1>

      {/* Top 5 Overall */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Top 5 - Toutes Catégories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {top5Overall.map((stat, index) => (
            <Card key={stat.nominee_name} className="p-6 bg-navy/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold/10 rounded-full">
                  <Trophy className={`h-6 w-6 ${index === 0 ? 'text-gold' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gold">
                    {stat.nominee_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.category_name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-medium">{stat.vote_count} votes</span>
                    <TrendIcon trend={stat.trend} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Winners by Category */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Leaders par Catégorie</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {winnersByCategory.map((stat) => (
            <Card key={stat.category_name} className="p-6 bg-navy/30 backdrop-blur-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground">
                  {stat.category_name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gold">
                    {stat.nominee_name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span>{stat.vote_count} votes</span>
                    <TrendIcon trend={stat.trend} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicStatistics;