import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Trophy, ChartBar, Users } from "lucide-react";
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

      const newStats = (data as RawVoteStats[] || []).map((stat): VoteStats => {
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

  const TrendIcon = ({ trend }: { trend?: "up" | "down" | null }) => {
    if (trend === 'up') return <ArrowUp className="text-green-500" />;
    if (trend === 'down') return <ArrowDown className="text-red-500" />;
    return null;
  };

  return (
    <div className="container max-w-7xl py-24 sm:py-32 space-y-12 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-6 bg-gradient-to-br from-navy-light/30 via-navy to-navy-dark p-8 rounded-2xl border border-gold/30 shadow-xl">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold/80 via-gold to-gold/80 
                     animate-fade-in tracking-tight">
          Statistiques des Votes en Direct
        </h1>
        <p className="text-lg text-muted-foreground animate-fade-in [animation-delay:200ms] max-w-2xl mx-auto">
          Découvrez en temps réel l'évolution des votes et les tendances qui se dessinent pour chaque catégorie
        </p>
      </div>

      {/* Top 5 Overall Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8 bg-navy-light/20 p-4 rounded-lg border border-gold/20">
          <Trophy className="h-8 w-8 text-gold animate-pulse" />
          <div>
            <h2 className="text-2xl font-semibold text-gold">Top 5 - Toutes Catégories</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Les nominés les plus plébiscités toutes catégories confondues
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {top5Overall.map((stat, index) => (
            <Card key={stat.nominee_name} 
                  className="group p-6 bg-gradient-to-br from-navy/80 via-navy to-navy-dark 
                           hover:from-navy-dark hover:via-navy hover:to-navy-light
                           transition-all duration-700 hover:scale-[1.02] hover:shadow-xl
                           border border-gold/20 hover:border-gold/40">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold/10 rounded-full group-hover:bg-gold/20 transition-colors">
                  <Trophy className={`h-6 w-6 ${index === 0 ? 'text-gold animate-pulse' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gold group-hover:text-gold-light transition-colors">
                    {stat.nominee_name}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
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

      {/* Winners by Category Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8 bg-navy-light/20 p-4 rounded-lg border border-gold/20">
          <ChartBar className="h-8 w-8 text-gold" />
          <div>
            <h2 className="text-2xl font-semibold text-gold">Leaders par Catégorie</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Les nominés en tête dans chaque catégorie
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {winnersByCategory.map((stat) => (
            <Card key={stat.category_name} 
                  className="group p-6 bg-gradient-to-br from-navy/30 via-navy/50 to-navy/30
                           hover:from-navy/40 hover:via-navy/60 hover:to-navy/40
                           transition-all duration-500 hover:scale-[1.02] hover:shadow-xl
                           backdrop-blur-sm border border-gold/20 hover:border-gold/40">
              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground group-hover:text-muted-foreground/80">
                  {stat.category_name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gold group-hover:text-gold-light transition-colors">
                    {stat.nominee_name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/80">{stat.vote_count} votes</span>
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