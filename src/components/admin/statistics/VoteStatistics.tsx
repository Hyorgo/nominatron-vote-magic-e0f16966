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
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <VotesSummary
        totalVotes={summaryData.totalVotes}
        participationRate={summaryData.participationRate}
        votingTrend={summaryData.votingTrend}
        isLoading={loading}
      />

      {topNominees.length > 0 && (
        <TopNominees nominees={topNominees} />
      )}

      <VotesChart
        data={statistics.map((stat) => ({
          name: stat.categoryName,
          votes: stat.totalVotes,
        }))}
      />

      <VotesTable statistics={statistics} />
    </div>
  );
};