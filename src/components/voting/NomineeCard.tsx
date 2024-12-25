import { Check, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NomineeCardProps {
  nominee: {
    id: string;
    name: string;
    description: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const NomineeCard = ({ nominee, isSelected, onClick }: NomineeCardProps) => {
  return (
    <div
      className={`relative p-6 bg-card/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-card/90 ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4">
          <Check className="h-5 w-5 text-primary" />
        </div>
      )}
      <h3 className="text-lg font-bold mb-2">{nominee.name}</h3>
      <p className="text-muted-foreground mb-4">{nominee.description}</p>
      <Button 
        onClick={onClick}
        variant={isSelected ? "secondary" : "default"}
        className="w-full"
      >
        <Vote className="mr-2 h-4 w-4" />
        {isSelected ? "Sélectionné" : "Voter"}
      </Button>
    </div>
  );
};