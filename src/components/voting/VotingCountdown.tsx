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

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Timer className="h-5 w-5 text-primary" />
          <div className="font-medium text-primary">
            Clôture des votes
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Les votes seront définitivement clôturés dans :
        </p>
        <div className="text-2xl font-mono font-bold text-primary">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <p className="text-sm text-muted-foreground">
          N'attendez pas la dernière minute pour voter pour vos nominés préférés !
        </p>
      </div>
    </Card>
  );
};