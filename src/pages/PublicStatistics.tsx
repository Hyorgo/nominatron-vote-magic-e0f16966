import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, PartyPopper, Award, Star, Sparkles } from "lucide-react";
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

  const getRandomIcon = (index: number) => {
    const icons = [
      <Trophy className="h-8 w-8 text-[#FFD700] animate-bounce" />,
      <PartyPopper className="h-8 w-8 text-[#D946EF] animate-pulse" />,
      <Award className="h-8 w-8 text-[#F97316] animate-pulse" />,
      <Star className="h-8 w-8 text-[#0EA5E9] animate-pulse" />,
      <Sparkles className="h-8 w-8 text-[#8B5CF6] animate-pulse" />
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="container max-w-7xl py-24 sm:py-32 space-y-12 animate-fade-in">
      {/* En-tête festif */}
      <div className="text-center space-y-6 bg-gradient-to-br from-[#9b87f5]/30 via-[#D946EF]/20 to-[#F97316]/20 
                    p-8 rounded-2xl border border-[#D946EF]/30 shadow-xl backdrop-blur-sm
                    animate-scale-in">
        <div className="relative">
          <PartyPopper className="absolute -top-6 -left-6 h-12 w-12 text-[#D946EF] animate-bounce" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#D946EF] via-[#F97316] to-[#8B5CF6] 
                       bg-clip-text text-transparent animate-fade-in tracking-tight">
            Statistiques des Votes en Direct
          </h1>
          <Trophy className="absolute -top-6 -right-6 h-12 w-12 text-[#F97316] animate-bounce" />
        </div>
        <p className="text-lg text-muted-foreground animate-fade-in [animation-delay:200ms] max-w-2xl mx-auto">
          Découvrez en temps réel l'évolution des votes et les tendances qui se dessinent pour chaque catégorie
        </p>
      </div>

      {/* Top 5 Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8 bg-gradient-to-r from-[#9b87f5]/20 to-[#D946EF]/20 
                      p-4 rounded-lg border border-[#D946EF]/30 backdrop-blur-sm animate-fade-in">
          <Trophy className="h-8 w-8 text-[#FFD700] animate-pulse" />
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] to-[#FFA500] 
                         bg-clip-text text-transparent">
              Top 5 - Toutes Catégories
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Les nominés les plus plébiscités toutes catégories confondues
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {top5Overall.map((stat, index) => (
            <Card key={stat.nominee_name} 
                  className="group p-6 bg-gradient-to-br from-[#9b87f5]/10 via-[#D946EF]/5 to-transparent
                           hover:from-[#9b87f5]/20 hover:via-[#D946EF]/10 hover:to-transparent
                           transition-all duration-700 hover:scale-[1.02] hover:shadow-xl
                           border border-[#D946EF]/20 hover:border-[#D946EF]/40
                           animate-fade-in backdrop-blur-sm"
                  style={{ animationDelay: `${index * 150}ms` }}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[#9b87f5]/20 to-[#D946EF]/20 rounded-full
                             group-hover:from-[#9b87f5]/30 group-hover:to-[#D946EF]/30 transition-colors">
                  {getRandomIcon(index)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] 
                               bg-clip-text text-transparent group-hover:from-[#F97316] group-hover:to-[#D946EF] 
                               transition-all duration-300">
                    {stat.nominee_name}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
                    {stat.category_name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-medium text-[#8B5CF6] group-hover:text-[#D946EF] transition-colors">
                      {stat.vote_count.toLocaleString()} votes
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaders par Catégorie Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8 bg-gradient-to-r from-[#8B5CF6]/20 to-[#F97316]/20 
                      p-4 rounded-lg border border-[#F97316]/30 backdrop-blur-sm animate-fade-in">
          <Award className="h-8 w-8 text-[#F97316] animate-pulse" />
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#F97316] 
                         bg-clip-text text-transparent">
              Leaders par Catégorie
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Les nominés en tête dans chaque catégorie
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {winnersByCategory.map((stat, index) => (
            <Card key={stat.category_name} 
                  className="group p-6 bg-gradient-to-br from-[#8B5CF6]/10 via-[#F97316]/5 to-transparent
                           hover:from-[#8B5CF6]/20 hover:via-[#F97316]/10 hover:to-transparent
                           transition-all duration-500 hover:scale-[1.02] hover:shadow-xl
                           backdrop-blur-sm border border-[#F97316]/20 hover:border-[#F97316]/40
                           animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}>
              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground group-hover:text-muted-foreground/80">
                  {stat.category_name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#F97316] 
                              bg-clip-text text-transparent group-hover:from-[#F97316] group-hover:to-[#8B5CF6] 
                              transition-all duration-300">
                    {stat.nominee_name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F97316] group-hover:text-[#8B5CF6] transition-colors">
                      {stat.vote_count.toLocaleString()} votes
                    </span>
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