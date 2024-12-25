import React from "react";
import { Loader2 } from "lucide-react";
import { TopNominee } from "./components/TopNominee";
import { VotesChart } from "./components/VotesChart";
import { VotesTable } from "./components/VotesTable";
import { VotesSummary } from "./components/VotesSummary";
import { useVoteStatistics } from "./hooks/useVoteStatistics";

export const VoteStatistics = () => {
  const { loading, statistics, topNominee, summaryData } = useVoteStatistics();

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

      {topNominee && (
        <TopNominee
          name={topNominee.name}
          category={topNominee.category}
          votes={topNominee.votes}
        />
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