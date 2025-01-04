import React from "react";
import { TopNominee } from "./TopNominee";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {nominees.map((nominee, index) => (
        <TopNominee
          key={nominee.name}
          name={nominee.name}
          category={nominee.category}
          votes={nominee.votes}
          rank={index + 1}
        />
      ))}
    </div>
  );
};