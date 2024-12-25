import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  buttonText: string;
  to: string;
  showButton?: boolean;
}

export const ActionCard = ({ icon: Icon, title, subtitle, buttonText, to, showButton = true }: ActionCardProps) => {
  return (
    <div className="bg-card rounded-lg p-6 text-center space-y-4">
      <Icon className="w-12 h-12 mx-auto text-primary" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">
        {subtitle}
      </p>
      {showButton && (
        <Button asChild>
          <Link to={to}>{buttonText}</Link>
        </Button>
      )}
    </div>
  );
};