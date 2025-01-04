import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { TopNomineesSection } from "@/components/statistics/TopNomineesSection";
import { CategoryLeadersSection } from "@/components/statistics/CategoryLeadersSection";
import BackgroundHalos from "@/components/effects/BackgroundHalos";
import BokehEffect from "@/components/effects/BokehEffect";

interface VoteStats {
  nominee_name: string;
  category_name: string;
  vote_count: number;
  trend?: "up" | "down" | null;
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

      const newStats = (data as VoteStats[] || []).map((stat) => {
        const previousCount = previousStats[stat.nominee_name] || 0;
        const trend = stat.vote_count > previousCount ? 'up' as const : 
                     stat.vote_count < previousCount ? 'down' as const : 
                     null;
        return { ...stat, trend };
      });

      const newPreviousStats = Object.fromEntries(
        newStats.map((stat) => [stat.nominee_name, stat.vote_count])
      );
      setPreviousStats(newPreviousStats);

      return newStats;
    },
    refetchInterval: 5000,
  });

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

  const top5Overall = stats?.slice(0, 5) || [];

  const winnersByCategory = (stats || []).reduce<VoteStats[]>((acc, curr) => {
    const existingCategory = acc.find(item => item.category_name === curr.category_name);
    if (!existingCategory) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundHalos />
      <BokehEffect />
      <div className="container max-w-7xl py-24 sm:py-32 space-y-12 animate-fade-in relative z-10">
        <StatisticsHeader 
          title="Statistiques des Votes en Direct"
          subtitle="Découvrez en temps réel l'évolution des votes et les tendances qui se dessinent pour chaque catégorie"
        />
        
        <TopNomineesSection topNominees={top5Overall} />
        
        <CategoryLeadersSection leaders={winnersByCategory} />
      </div>
    </div>
  );
};

export default PublicStatistics;