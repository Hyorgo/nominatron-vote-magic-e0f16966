import { Check } from "lucide-react";

interface NomineeCardProps {
  nominee: {
    id: number;
    name: string;
    description: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const NomineeCard = ({ nominee, isSelected, onClick }: NomineeCardProps) => {
  return (
    <div
      className={`nominee-card animate-scale-in cursor-pointer ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute top-4 right-4">
          <Check className="h-5 w-5 text-primary" />
        </div>
      )}
      <h3 className="text-lg font-bold mb-2">{nominee.name}</h3>
      <p className="text-muted-foreground">{nominee.description}</p>
    </div>
  );
};