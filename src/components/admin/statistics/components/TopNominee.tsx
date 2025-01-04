import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Sparkles } from "lucide-react";

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
        return "text-[#FFD700]"; // Or
      case 2:
        return "text-[#C0C0C0]"; // Argent
      case 3:
        return "text-[#CD7F32]"; // Bronze
      default:
        return "text-[#D946EF]"; // Rose magenta pour les autres positions
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1:
        return "1ère position 🏆";
      case 2:
        return "2ème position ✨";
      case 3:
        return "3ème position 🌟";
      default:
        return `${rank}ème position`;
    }
  };

  return (
    <Card 
      className="group p-6 bg-gradient-to-br from-navy-light to-navy hover:from-navy hover:to-navy-dark 
                transition-all duration-500 hover:scale-[1.02] hover:shadow-xl animate-fade-in"
      style={{ animationDelay: `${rank * 150}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="relative p-3 bg-gold/10 rounded-full group-hover:bg-gold/20 transition-colors duration-300">
          {rank === 1 ? (
            <Trophy className="h-6 w-6 text-[#FFD700] animate-pulse" />
          ) : (
            <Sparkles className={`h-6 w-6 ${getRankColor(rank)} transition-transform group-hover:scale-110`} />
          )}
          <div className="absolute -inset-1 bg-gold/20 rounded-full blur-sm group-hover:bg-gold/30 transition-colors duration-300" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className={`text-lg font-semibold ${getRankColor(rank)} transition-colors duration-300 group-hover:scale-105 transform-gpu`}>
            {getRankLabel(rank)}
          </h3>
          <p className="text-foreground/90 font-medium group-hover:text-foreground transition-colors duration-300">
            {name}
          </p>
          <p className="text-sm text-foreground/60 mt-1 group-hover:text-foreground/80 transition-colors duration-300">
            {category}
          </p>
          <p className="mt-2 text-sm font-medium text-gold group-hover:text-gold-light transition-colors duration-300 flex items-center gap-2">
            <span className="inline-block animate-pulse">{votes}</span>
            <span>votes</span>
          </p>
        </div>
      </div>
    </Card>
  );
};