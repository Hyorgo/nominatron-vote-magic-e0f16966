import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon, Star } from "lucide-react";
import { NotificationSignup } from "./NotificationSignup";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  buttonText?: string;
  to?: string;
  showButton?: boolean;
  votingNotStarted?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  showStar?: boolean;
}

export const ActionCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  buttonText, 
  to, 
  showButton = true,
  votingNotStarted = false,
  onClick,
  children,
  showStar = false
}: ActionCardProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-md backdrop-saturate-150 rounded-lg p-4 md:p-6 flex flex-col h-full border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-card/90 relative">
      {showStar && (
        <div className="absolute top-3 right-3">
          <Star className="w-6 h-6 text-gold fill-gold" />
        </div>
      )}
      <div className="flex-grow space-y-3 md:space-y-4">
        <Icon className="w-8 h-8 md:w-12 md:h-12 mx-auto text-primary" />
        <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <div className="mt-4 md:mt-6">
        {showButton && buttonText && (
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
        {children}
        {votingNotStarted && <NotificationSignup />}
      </div>
    </div>
  );
};