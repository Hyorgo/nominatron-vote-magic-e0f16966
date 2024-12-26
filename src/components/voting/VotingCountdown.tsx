import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { Card } from "@/components/ui/card";
import { Timer, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VotingCountdownProps {
  endDate: Date;
  userEmail?: string;
}

export const VotingCountdown = ({ endDate, userEmail }: VotingCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log("Email de l'utilisateur:", userEmail);

      if (userEmail) {
        const { data, error } = await supabase
          .from("validated_emails")
          .select("first_name")
          .eq("email", userEmail)
          .maybeSingle();
        
        if (error) {
          console.error("Erreur lors de la récupération du prénom:", error);
          return;
        }
        
        console.log("Données reçues de la base:", data);
        
        if (data?.first_name) {
          console.log("Prénom trouvé:", data.first_name);
          setFirstName(data.first_name);
        } else {
          console.log("Aucun prénom trouvé pour cet email");
        }
      } else {
        console.log("Pas d'email fourni");
      }
    };

    fetchUserInfo();
  }, [userEmail]);

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
      <div className="space-y-4">
        {firstName && (
          <div className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            <p className="text-xl font-semibold">
              Bienvenue {firstName} 👋 Nous sommes ravis de vous voir participer aux votes.
            </p>
          </div>
        )}
        
        <div className="pt-2">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-primary" />
            <div className="font-medium text-primary">
              Clôture des votes
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Les votes seront définitivement clôturés dans :
          </p>
          <div className="text-2xl font-mono font-bold text-primary mt-2">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            N'attendez pas la dernière minute pour voter pour vos nominés préférés !
          </p>
        </div>
      </div>
    </Card>
  );
};