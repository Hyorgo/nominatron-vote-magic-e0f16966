import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { Card } from "@/components/ui/card";
import { Timer } from "lucide-react";

interface VotingCountdownProps {
  endDate: Date;
}

export const VotingCountdown = ({ endDate }: VotingCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const totalSeconds = Math.max(0, differenceInSeconds(endDate, now));
      
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      setTimeLeft({ hours, minutes, seconds });
    };

    // Mettre à jour immédiatement
    updateCountdown();
    
    // Mettre à jour toutes les secondes
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <div className="flex items-center gap-3">
        <Timer className="h-5 w-5 text-primary" />
        <div className="text-sm font-medium">
          Temps restant : 
          <span className="ml-2 font-mono">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    </Card>
  );
};