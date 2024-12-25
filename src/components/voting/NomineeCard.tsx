import { Check, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-lg">{nominee.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {nominee.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Button 
          onClick={onClick}
          variant={isSelected ? "secondary" : "default"}
          className="w-full transition-all duration-300"
        >
          <Vote className="mr-2 h-4 w-4" />
          {isSelected ? "Sélectionné" : "Voter"}
        </Button>
      </CardContent>
    </Card>
  );
};