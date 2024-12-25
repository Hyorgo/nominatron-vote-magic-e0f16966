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
    image_url?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const NomineeCard = ({ nominee, isSelected, onClick }: NomineeCardProps) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg",
        "border border-border/50 hover:border-primary/50",
        "animate-fade-in",
        isSelected && "ring-2 ring-primary ring-offset-2 bg-primary/5"
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg animate-scale-in z-10">
          <Check className="h-4 w-4" />
        </div>
      )}
      
      {nominee.image_url && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={nominee.image_url}
            alt={nominee.name}
            className={cn(
              "object-cover w-full h-full transition-transform duration-300",
              "group-hover:scale-105",
              isSelected && "brightness-110"
            )}
          />
          {isSelected && (
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] transition-opacity duration-300" />
          )}
        </div>
      )}
      
      <CardHeader>
        <CardTitle 
          className={cn(
            "text-lg transition-colors duration-300",
            "group-hover:text-primary",
            isSelected && "text-primary"
          )}
        >
          {nominee.name}
        </CardTitle>
        <CardDescription 
          className={cn(
            "line-clamp-2",
            isSelected && "text-foreground/80"
          )}
        >
          {nominee.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Button 
          onClick={onClick}
          variant={isSelected ? "secondary" : "default"}
          className={cn(
            "w-full transition-all duration-300",
            "group-hover:shadow-md",
            isSelected && "bg-primary/20 hover:bg-primary/30"
          )}
        >
          <Vote className={cn(
            "mr-2 h-4 w-4 transition-transform duration-300",
            isSelected && "rotate-12"
          )} />
          {isSelected ? "Sélectionné" : "Voter"}
        </Button>
      </CardContent>
    </Card>
  );
};