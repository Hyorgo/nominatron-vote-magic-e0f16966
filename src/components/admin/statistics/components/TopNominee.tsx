import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface TopNomineeProps {
  name: string;
  category: string;
  votes: number;
  rank: number;
}

export const TopNominee = ({ name, category, votes, rank }: TopNomineeProps) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-gold";
      case 2:
        return "text-gray-300";
      case 3:
        return "text-[#CD7F32]"; // Couleur bronze
      default:
        return "text-gray-400";
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1:
        return "1ère position";
      case 2:
        return "2ème position";
      case 3:
        return "3ème position";
      default:
        return `${rank}ème position`;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-navy-light to-navy hover:from-navy hover:to-navy-dark transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gold/10 rounded-full">
          <Trophy className={`h-6 w-6 ${getRankColor(rank)}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${getRankColor(rank)}`}>
            {getRankLabel(rank)}
          </h3>
          <p className="text-foreground/90 font-medium">
            {name}
          </p>
          <p className="text-sm text-foreground/60 mt-1">
            {category}
          </p>
          <p className="mt-2 text-sm font-medium text-gold">
            {votes} votes
          </p>
        </div>
      </div>
    </Card>
  );
};