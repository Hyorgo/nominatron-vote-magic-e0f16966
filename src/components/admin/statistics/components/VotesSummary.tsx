import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Users, TrendingUp, BarChart3 } from "lucide-react";

interface VotesSummaryProps {
  totalVotes: number;
  participationRate: number;
  votingTrend: number;
  isLoading: boolean;
}

export const VotesSummary = ({
  totalVotes,
  participationRate,
  votingTrend,
  isLoading,
}: VotesSummaryProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const summaryItems = [
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      title: "Total des votes",
      value: totalVotes.toString(),
      description: "votes enregistrés",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Taux de participation",
      value: `${participationRate.toFixed(1)}%`,
      description: "des votants attendus",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "Tendance",
      value: `${votingTrend > 0 ? '+' : ''}${votingTrend}%`,
      description: "depuis hier",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryItems.map((item, index) => (
        <Card key={index} className="p-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-background/10">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {item.title}
              </p>
              <h3 className="text-2xl font-bold text-gold">
                {item.value}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};