import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { calculateTimeLeft } from "@/lib/utils";
import { WelcomeMessage } from "./welcome/WelcomeMessage";
import { TimeDisplay } from "./countdown/TimeDisplay";
import { supabase } from "@/integrations/supabase/client";

interface VotingCountdownProps {
  endDate: Date;
  userEmail?: string | null;
}

export const VotingCountdown = ({ endDate, userEmail }: VotingCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));
  const [firstName, setFirstName] = useState<string>();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userEmail) return;

      try {
        const { data: profiles } = await supabase
          .from("validated_emails")
          .select("first_name")
          .eq("email", userEmail)
          .single();

        if (profiles?.first_name) {
          setFirstName(profiles.first_name);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };

    loadUserProfile();
  }, [userEmail]);

  if (timeLeft.total <= 0) {
    return (
      <Card className="p-6 text-center bg-destructive/10 border-destructive">
        <p className="text-lg font-semibold text-destructive">
          La période de vote est terminée
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <WelcomeMessage firstName={firstName} />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">
          Temps restant pour voter
        </h3>
        <TimeDisplay
          days={timeLeft.days}
          hours={timeLeft.hours}
          minutes={timeLeft.minutes}
          seconds={timeLeft.seconds}
        />
      </div>
    </Card>
  );
};