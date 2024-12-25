import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { NotificationSignup } from "./NotificationSignup";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  buttonText: string;
  to?: string;
  showButton?: boolean;
  votingNotStarted?: boolean;
  onClick?: () => void;
}

export const ActionCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  buttonText, 
  to, 
  showButton = true,
  votingNotStarted = false,
  onClick 
}: ActionCardProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 flex flex-col h-full border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-card/90">
      <div className="flex-grow space-y-4">
        <Icon className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <div className="mt-6">
        {showButton && (
          onClick ? (
            <Button onClick={onClick} className="w-full">
              {buttonText}
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link to={to || "#"}>{buttonText}</Link>
            </Button>
          )
        )}
        {votingNotStarted && <NotificationSignup />}
      </div>
    </div>
  );
};