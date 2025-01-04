import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Trophy, Star, Award, PartyPopper, Sparkles } from "lucide-react";
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
    if (trend === 'up') return <ArrowUp className="text-green-500 animate-bounce" />;
    if (trend === 'down') return <ArrowDown className="text-red-500 animate-bounce" />;
    return null;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="relative">
            <Trophy className="h-8 w-8 text-gold animate-pulse" />
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-gold animate-pulse" />
            <PartyPopper className="h-5 w-5 absolute -bottom-1 -right-1 text-[#D946EF] animate-bounce" />
          </div>
        );
      case 1:
        return (
          <div className="relative">
            <Star className="h-8 w-8 text-[#D946EF] animate-pulse" />
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-[#D946EF] animate-pulse" />
          </div>
        );
      case 2:
        return (
          <div className="relative">
            <Award className="h-8 w-8 text-amber-700 animate-pulse" />
            <PartyPopper className="h-5 w-5 absolute -top-2 -right-2 text-amber-700 animate-bounce" />
          </div>
        );
      default:
        return <Trophy className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="container max-w-7xl py-24 sm:py-32 space-y-8 animate-fade-in">
      <div className="relative">
        <h1 className="text-4xl font-bold text-center mb-12 text-gold flex items-center justify-center gap-4">
          <PartyPopper className="h-8 w-8 text-[#D946EF] animate-bounce" />
          Statistiques des Votes en Direct
          <Sparkles className="h-8 w-8 text-gold animate-pulse" />
        </h1>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-gold/20 via-[#D946EF]/20 to-amber-700/20 rounded-full blur-3xl -z-10" />
      </div>

      <div className="space-y-6 animate-fade-in [animation-delay:200ms]">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          Top 5 - Toutes Catégories
          <PartyPopper className="h-6 w-6 text-[#D946EF] animate-bounce" />
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {top5Overall.map((stat, index) => (
            <Card 
              key={stat.nominee_name} 
              className="group p-6 bg-gradient-to-br from-navy-light to-navy hover:from-navy hover:to-navy-dark transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden relative"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-gradient-to-tr from-[#D946EF]/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-navy-dark/50 transition-colors duration-300 group-hover:scale-110">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gold group-hover:text-gold-light transition-colors">
                    {stat.nominee_name}
                  </h3>
                  <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                    {stat.category_name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-medium text-gold-light">
                      {stat.vote_count} votes
                    </span>
                    <TrendIcon trend={stat.trend} />
                    <Sparkles className="h-4 w-4 text-gold animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6 animate-fade-in [animation-delay:400ms] relative">
        <div className="absolute -top-20 right-0 w-72 h-72 bg-gradient-to-bl from-gold/10 via-[#D946EF]/10 to-transparent rounded-full blur-2xl -z-10" />
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          Leaders par Catégorie
          <Sparkles className="h-6 w-6 text-gold animate-pulse" />
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {winnersByCategory.map((stat) => (
            <Card 
              key={stat.category_name} 
              className="group p-6 bg-navy/30 backdrop-blur-sm hover:bg-navy/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="space-y-2">
                <h3 className="font-medium text-gold/80 group-hover:text-gold transition-colors">
                  {stat.category_name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
                    {stat.nominee_name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gold-light">{stat.vote_count} votes</span>
                    <TrendIcon trend={stat.trend} />
                    <Sparkles className="h-4 w-4 text-gold animate-pulse" />
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