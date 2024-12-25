import { Loader2 } from "lucide-react";
import { TopNominee } from "./components/TopNominee";
import { VotesChart } from "./components/VotesChart";
import { VotesTable } from "./components/VotesTable";
import { useVoteStatistics } from "./hooks/useVoteStatistics";

export const VoteStatistics = () => {
  const { loading, statistics, topNominee } = useVoteStatistics();

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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