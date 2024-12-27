import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const downloadCalendarEvent = () => {
    // Créer le contenu du fichier ICS
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${format(eventDate, "yyyyMMdd'T'HHmmss")}
DTEND:${format(new Date(eventDate.getTime() + 4 * 60 * 60 * 1000), "yyyyMMdd'T'HHmmss")}
SUMMARY:Soirée des Trophées
DESCRIPTION:Rejoignez-nous pour une soirée exceptionnelle
LOCATION:${eventInfo.location} - ${eventInfo.address}
END:VEVENT
END:VCALENDAR`;

    // Créer un blob et un lien de téléchargement
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'evenement.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white relative">
      <Star className="absolute top-4 right-4 text-gold fill-gold" size={24} />
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

        <Button 
          variant="outline" 
          className="w-full border-gold/20 text-gold hover:bg-gold/10 hover:text-gold"
          onClick={downloadCalendarEvent}
        >
          <Download className="w-4 h-4" />
          Ajouter à mon calendrier
        </Button>
      </CardContent>
    </Card>
  );
};