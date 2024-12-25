import { Card } from "@/components/ui/card";

interface TopNomineeProps {
  name: string;
  category: string;
  votes: number;
}

export const TopNominee = ({ name, category, votes }: TopNomineeProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Nominé le plus populaire</h3>
      <p>
        {name} ({category}) avec {votes} votes
      </p>
    </Card>
  );
};