import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface TopNomineeData {
  name: string;
  category: string;
  votes: number;
}

interface TopNomineesProps {
  nominees: TopNomineeData[];
}

export const TopNominees = ({ nominees }: TopNomineesProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {nominees.map((nominee, index) => (
        <Card 
          key={nominee.name} 
          className={`p-6 bg-gradient-to-br from-navy-light to-navy animate-fade-in ${
            index === 0 ? 'md:col-span-3 lg:col-span-1' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-full">
              <Trophy className={`h-6 w-6 ${index === 0 ? 'text-gold' : index === 1 ? 'text-gray-300' : 'text-amber-700'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gold">
                {index === 0 ? 'Plus populaire' : index === 1 ? '2ème position' : '3ème position'}
              </h3>
              <p className="text-foreground/80">
                <span className="font-medium text-gold">{nominee.name}</span>
                <span className="mx-2 text-foreground/60">•</span>
                <span className="text-foreground/80">{nominee.category}</span>
              </p>
              <p className="mt-1 text-sm text-foreground/60">
                {nominee.votes} votes
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};