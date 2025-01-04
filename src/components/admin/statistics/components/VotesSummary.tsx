import React from "react";
import { Card } from "@/components/ui/card";
import { Award, Users, TrendingUp } from "lucide-react";

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
  const summaryItems = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Total des votes",
      value: totalVotes.toLocaleString(),
      description: "votes enregistrés",
      color: "text-[#F97316] bg-[#F97316]/10",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Taux de participation",
      value: `${participationRate.toFixed(1)}%`,
      description: "des votants attendus",
      color: "text-[#D946EF] bg-[#D946EF]/10",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Tendance",
      value: `${votingTrend > 0 ? '+' : ''}${votingTrend}%`,
      description: "depuis hier",
      trend: votingTrend > 0 ? "up" : "down",
      color: "text-gold bg-gold/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryItems.map((item, index) => (
        <Card 
          key={index} 
          className="group p-6 bg-navy/50 backdrop-blur-sm hover:bg-navy/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${item.color} group-hover:scale-110 transition-all duration-300`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60 group-hover:text-foreground/80 transition-colors">
                {item.title}
              </p>
              <h3 className="text-2xl font-bold text-gold mt-1 group-hover:text-gold-light transition-colors flex items-center gap-2">
                {item.value}
                <span className="inline-block text-lg">
                  {item.trend === "up" ? "🎉" : ""}
                </span>
              </h3>
              <p className="text-xs text-foreground/60 mt-1 group-hover:text-foreground/80 transition-colors">
                {item.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};