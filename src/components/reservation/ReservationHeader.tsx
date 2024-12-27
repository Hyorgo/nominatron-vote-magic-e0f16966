import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface ReservationHeaderProps {
  title: string;
  subtitle: string;
}

export const ReservationHeader = ({ title, subtitle }: ReservationHeaderProps) => {
  const [eventDate, setEventDate] = useState<string>("");

  useEffect(() => {
    const fetchEventDate = async () => {
      const { data } = await supabase
        .from('event_information')
        .select('event_date')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data[0]?.event_date) {
        const formattedDate = format(
          new Date(data[0].event_date),
          "EEEE d MMMM yyyy 'à' HH'h'mm",
          { locale: fr }
        );
        setEventDate(formattedDate);
      }
    };

    fetchEventDate();
  }, []);

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 golden-reflection animate-fade-in">{title}</h1>
      {eventDate && (
        <p className="text-xl sm:text-2xl text-gold mb-2 animate-fade-in whitespace-nowrap">
          {eventDate}
        </p>
      )}
      <p className="text-xl sm:text-2xl text-gold/80 animate-fade-in delay-100 whitespace-nowrap">{subtitle}</p>
    </div>
  );
};