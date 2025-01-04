import React from "react";
import { Loader2, PartyPopper, Sparkles } from "lucide-react";
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
      <div className="relative">
        <h1 className="text-4xl font-bold text-gold mb-12 text-center animate-fade-in flex items-center justify-center gap-4">
          Statistiques des Votes
          <Sparkles className="h-8 w-8 text-gold animate-pulse" />
        </h1>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-gold/20 via-[#D946EF]/20 to-amber-700/20 rounded-full blur-3xl -z-10" />
      </div>

      <div className="animate-fade-in [animation-delay:200ms]">
        <VotesSummary
          totalVotes={summaryData.totalVotes}
          participationRate={summaryData.participationRate}
          votingTrend={summaryData.votingTrend}
          isLoading={loading}
        />
      </div>

      {topNominees.length > 0 && (
        <div className="mt-16 animate-fade-in [animation-delay:400ms] relative">
          <div className="absolute -top-20 right-0 w-72 h-72 bg-gradient-to-bl from-gold/10 via-[#D946EF]/10 to-transparent rounded-full blur-2xl -z-10" />
          <h2 className="text-2xl font-semibold text-gold mb-8">
            Top des Nominés
          </h2>
          <TopNominees nominees={topNominees} />
        </div>
      )}

      <div className="mt-16 animate-fade-in [animation-delay:600ms] relative">
        <div className="absolute -top-10 left-0 w-64 h-64 bg-gradient-to-tr from-amber-700/10 via-gold/10 to-transparent rounded-full blur-2xl -z-10" />
        <h2 className="text-2xl font-semibold text-gold mb-8 flex items-center gap-3">
          Distribution des Votes
          <Sparkles className="h-6 w-6 text-gold animate-pulse" />
        </h2>
        <VotesChart
          data={statistics.map((stat) => ({
            name: stat.categoryName,
            votes: stat.totalVotes,
          }))}
        />
      </div>

      <div className="mt-16 animate-fade-in [animation-delay:800ms]">
        <VotesTable statistics={statistics} />
      </div>
    </div>
  );
};