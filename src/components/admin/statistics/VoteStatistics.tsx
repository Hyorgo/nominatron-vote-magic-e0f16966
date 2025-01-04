import React from "react";
import { Loader2, ChartBar, Trophy, Users } from "lucide-react";
import { TopNominees } from "./components/TopNominees";
import { VotesChart } from "./components/VotesChart";
import { VotesTable } from "./components/VotesTable";
import { VotesSummary } from "./components/VotesSummary";
import { useVoteStatistics } from "./hooks/useVoteStatistics";

export const VoteStatistics = () => {
  const { loading, statistics, topNominees, summaryData } = useVoteStatistics();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-[1400px] mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gold mb-4 animate-fade-in 
                     bg-gradient-to-r from-gold/20 via-gold to-gold/20 
                     bg-clip-text text-transparent">
          Statistiques des Votes
        </h1>
        <p className="text-muted-foreground animate-fade-in [animation-delay:200ms]">
          Découvrez les tendances et résultats des votes en temps réel
        </p>
      </div>

      <div className="animate-fade-in [animation-delay:200ms] 
                    bg-gradient-to-br from-navy-light/50 via-navy to-navy-dark 
                    rounded-xl border border-gold/20 p-6 shadow-xl">
        <VotesSummary
          totalVotes={summaryData.totalVotes}
          participationRate={summaryData.participationRate}
          votingTrend={summaryData.votingTrend}
          isLoading={loading}
        />
      </div>

      {topNominees.length > 0 && (
        <div className="mt-16 animate-fade-in [animation-delay:400ms]">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-6 w-6 text-gold animate-pulse" />
            <h2 className="text-2xl font-semibold text-gold">
              Top des Nominés
            </h2>
          </div>
          <TopNominees nominees={topNominees} />
        </div>
      )}

      <div className="mt-16 animate-fade-in [animation-delay:600ms]">
        <div className="flex items-center gap-3 mb-8">
          <ChartBar className="h-6 w-6 text-gold" />
          <h2 className="text-2xl font-semibold text-gold">
            Distribution des Votes
          </h2>
        </div>
        <VotesChart
          data={statistics.map((stat) => ({
            name: stat.categoryName,
            votes: stat.totalVotes,
          }))}
        />
      </div>

      <div className="mt-16 animate-fade-in [animation-delay:800ms]">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-6 w-6 text-gold" />
          <h2 className="text-2xl font-semibold text-gold">
            Détails par Catégorie
          </h2>
        </div>
        <VotesTable statistics={statistics} />
      </div>
    </div>
  );
};