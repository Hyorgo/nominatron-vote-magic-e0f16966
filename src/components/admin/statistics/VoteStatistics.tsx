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
    <div className="space-y-12 p-4 sm:p-8 max-w-[1400px] mx-auto">
      {/* Header Section with enhanced styling */}
      <div className="text-center space-y-6 bg-gradient-to-br from-navy-light/30 via-navy to-navy-dark p-8 rounded-2xl border border-gold/30 shadow-xl">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold/80 via-gold to-gold/80 
                     animate-fade-in tracking-tight">
          Statistiques des Votes
        </h1>
        <p className="text-lg text-muted-foreground animate-fade-in [animation-delay:200ms] max-w-2xl mx-auto">
          Découvrez en temps réel l'évolution des votes et les tendances qui se dessinent pour chaque catégorie
        </p>
      </div>

      {/* Summary Cards with enhanced visual hierarchy */}
      <div className="animate-fade-in [animation-delay:300ms]">
        <VotesSummary
          totalVotes={summaryData.totalVotes}
          participationRate={summaryData.participationRate}
          votingTrend={summaryData.votingTrend}
          isLoading={loading}
        />
      </div>

      {topNominees.length > 0 && (
        <div className="mt-16 animate-fade-in [animation-delay:400ms]">
          <div className="flex items-center gap-3 mb-8 bg-navy-light/20 p-4 rounded-lg border border-gold/20">
            <Trophy className="h-8 w-8 text-gold animate-pulse" />
            <div>
              <h2 className="text-2xl font-semibold text-gold">
                Top des Nominés
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Les candidats les plus plébiscités toutes catégories confondues
              </p>
            </div>
          </div>
          <TopNominees nominees={topNominees} />
        </div>
      )}

      <div className="mt-16 animate-fade-in [animation-delay:600ms]">
        <div className="flex items-center gap-3 mb-8 bg-navy-light/20 p-4 rounded-lg border border-gold/20">
          <ChartBar className="h-8 w-8 text-gold" />
          <div>
            <h2 className="text-2xl font-semibold text-gold">
              Distribution des Votes
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Répartition des votes par catégorie
            </p>
          </div>
        </div>
        <VotesChart
          data={statistics.map((stat) => ({
            name: stat.categoryName,
            votes: stat.totalVotes,
          }))}
        />
      </div>

      <div className="mt-16 animate-fade-in [animation-delay:800ms]">
        <div className="flex items-center gap-3 mb-8 bg-navy-light/20 p-4 rounded-lg border border-gold/20">
          <Users className="h-8 w-8 text-gold" />
          <div>
            <h2 className="text-2xl font-semibold text-gold">
              Détails par Catégorie
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Analyse détaillée des votes pour chaque catégorie
            </p>
          </div>
        </div>
        <VotesTable statistics={statistics} />
      </div>
    </div>
  );
};