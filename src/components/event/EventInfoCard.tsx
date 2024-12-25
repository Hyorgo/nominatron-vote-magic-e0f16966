import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";

export const EventInfoCard = () => {
  const { data: eventInfo, isLoading } = useQuery({
    queryKey: ['eventInfo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_information')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white/5 h-32 rounded-lg" />;
  }

  if (!eventInfo) {
    return null;
  }

  const eventDate = new Date(eventInfo.event_date);

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">
              {format(eventDate, "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{eventInfo.location}</p>
            <p className="text-white/80">{eventInfo.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};