import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Award, PartyPopper, Sparkles } from "lucide-react";

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
        return "text-gold bg-gold/10";
      case 2:
        return "text-[#D946EF] bg-[#D946EF]/10";
      case 3:
        return "text-amber-700 bg-amber-700/10";
      default:
        return "text-gray-400 bg-gray-400/10";
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <>
            <Trophy className="h-6 w-6" />
            <Sparkles className="h-5 w-5 absolute -top-1 -right-1 text-gold animate-pulse" />
            <PartyPopper className="h-4 w-4 absolute -bottom-1 -right-1 text-[#D946EF] animate-bounce" />
          </>
        );
      case 2:
        return (
          <>
            <Star className="h-6 w-6" />
</lov-replace>

<lov-search>
            <PartyPopper className="h-4 w-4 absolute -bottom-1 -right-1 text-[#D946EF] animate-bounce" />
</lov-search>
<lov-replace>
            <Sparkles className="h-4 w-4 absolute -bottom-1 -right-1 text-gold animate-pulse" />
          </>
        );
      case 3:
        return (
          <>
            <Award className="h-6 w-6" />
            <Sparkles className="h-5 w-5 absolute -top-1 -right-1 text-amber-700 animate-pulse" />
            <PartyPopper className="h-4 w-4 absolute -bottom-1 -right-1 text-[#D946EF] animate-bounce" />
          </>
        );
      default:
        return <Trophy className="h-6 w-6" />;
    }
  };

  return (
    <Card className={`group p-6 bg-gradient-to-br from-navy-light to-navy hover:from-navy hover:to-navy-dark transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-in overflow-hidden relative`}>
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-gradient-to-tr from-[#D946EF]/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${getRankColor(rank)} transition-colors duration-300 group-hover:scale-110 relative`}>
          {getRankIcon(rank)}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${getRankColor(rank).split(' ')[0]} transition-colors`}>
            {getRankLabel(rank)}
          </h3>
          <p className="text-foreground/90 font-medium group-hover:text-foreground transition-colors">
            {name}
          </p>
          <p className="text-sm text-foreground/60 mt-1 group-hover:text-foreground/80 transition-colors">
            {category}
          </p>
          <p className="mt-2 text-sm font-medium text-gold group-hover:text-gold-light transition-colors flex items-center gap-2">
            {votes} votes
            <Sparkles className="h-4 w-4 text-gold animate-pulse" />
          </p>
        </div>
      </div>
    </Card>
  );
};