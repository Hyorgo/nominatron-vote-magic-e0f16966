import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface TopNomineeProps {
  name: string;
  category: string;
  votes: number;
}

export const TopNominee = ({ name, category, votes }: TopNomineeProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-navy-light to-navy animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gold/10 rounded-full">
          <Trophy className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gold">Nominé le plus populaire</h3>
          <p className="text-foreground/80">
            <span className="font-medium text-gold">{name}</span>
            <span className="mx-2 text-foreground/60">•</span>
            <span className="text-foreground/80">{category}</span>
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            {votes} votes
          </p>
        </div>
      </div>
    </Card>
  );
};