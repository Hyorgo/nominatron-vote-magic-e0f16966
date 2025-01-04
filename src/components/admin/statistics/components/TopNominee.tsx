import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Sparkles, PartyPopper } from "lucide-react";

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
        return "text-[#FFD700] animate-pulse"; // Or animé
      case 2:
        return "text-[#C0C0C0]"; // Argent
      case 3:
        return "text-[#CD7F32]"; // Bronze
      default:
        return "text-[#D946EF]"; // Rose magenta
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-[#FFD700] animate-bounce" />;
      case 2:
        return <PartyPopper className="h-8 w-8 text-[#C0C0C0] animate-pulse" />;
      case 3:
        return <Sparkles className="h-8 w-8 text-[#CD7F32] animate-pulse" />;
      default:
        return <Sparkles className="h-8 w-8 text-[#D946EF]" />;
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇 Champion";
      case 2:
        return "🥈 Vice-champion";
      case 3:
        return "🥉 Troisième";
      default:
        return `${rank}ème position`;
    }
  };

  return (
    <Card 
      className="group p-6 bg-gradient-to-br from-navy/80 via-navy to-navy-dark 
                hover:from-navy-dark hover:via-navy hover:to-navy-light
                transition-all duration-700 hover:scale-[1.02] hover:shadow-xl
                border border-gold/20 hover:border-gold/40 rounded-xl
                animate-fade-in cursor-pointer relative overflow-hidden"
      style={{ animationDelay: `${rank * 150}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-transparent 
                    group-hover:from-gold/10 transition-all duration-500" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative p-4 bg-gold/10 rounded-full group-hover:bg-gold/20 
                      transition-colors duration-500 transform group-hover:rotate-12">
          {getRankIcon(rank)}
          <div className="absolute -inset-1 bg-gold/20 rounded-full blur-lg 
                        group-hover:bg-gold/30 transition-colors duration-500" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className={`text-xl font-bold ${getRankColor(rank)} 
                         transition-all duration-500 group-hover:scale-105 transform-gpu`}>
            {getRankLabel(rank)}
          </h3>
          <p className="text-foreground/90 font-medium text-lg group-hover:text-foreground 
                      transition-colors duration-500">
            {name}
          </p>
          <p className="text-sm text-foreground/60 mt-1 group-hover:text-foreground/80 
                      transition-colors duration-500">
            {category}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-bold text-gold group-hover:text-gold-light 
                          transition-colors duration-500">
              {votes.toLocaleString()}
            </span>
            <span className="text-sm text-foreground/60 group-hover:text-foreground/80">votes</span>
          </div>
        </div>
      </div>
    </Card>
  );
};