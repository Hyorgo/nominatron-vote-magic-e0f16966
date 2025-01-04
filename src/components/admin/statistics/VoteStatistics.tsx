import React from "react";
import { Loader2 } from "lucide-react";
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
    <div className="space-y-8 p-4 sm:p-8 max-w-[1400px] mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-gold mb-8 text-center">
        Statistiques des Votes
      </h1>

      <VotesSummary
        totalVotes={summaryData.totalVotes}
        participationRate={summaryData.participationRate}
        votingTrend={summaryData.votingTrend}
        isLoading={loading}
      />

      {topNominees.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gold mb-6">
            Top des Nominés
          </h2>
          <TopNominees nominees={topNominees} />
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gold mb-6">
          Distribution des Votes
        </h2>
        <VotesChart
          data={statistics.map((stat) => ({
            name: stat.categoryName,
            votes: stat.totalVotes,
          }))}
        />
      </div>

      <div className="mt-12">
        <VotesTable statistics={statistics} />
      </div>
    </div>
  );
};