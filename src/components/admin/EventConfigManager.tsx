import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { EventFormFields } from "./event/EventFormFields";

interface EventConfig {
  start_date: string;
  end_date: string;
  event_date: string;
  location: string;
  address: string;
}

export const EventConfigManager = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { isDirty } } = useForm<EventConfig>();

  const startDate = watch('start_date');
  const endDate = watch('end_date');
  const eventDate = watch('event_date');

  useEffect(() => {
    loadEventConfig();
  }, []);

  const loadEventConfig = async () => {
    try {
      const { data: votingConfigs } = await supabase
        .from('voting_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: eventInfos } = await supabase
        .from('event_information')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      const votingConfig = votingConfigs?.[0];
      const eventInfo = eventInfos?.[0];

      if (votingConfig) {
        // Convertir les dates UTC en dates locales pour l'affichage
        const localStartDate = new Date(votingConfig.start_date);
        const localEndDate = new Date(votingConfig.end_date);
        
        setValue('start_date', format(localStartDate, "yyyy-MM-dd'T'HH:mm"));
        setValue('end_date', format(localEndDate, "yyyy-MM-dd'T'HH:mm"));
      }

      if (eventInfo) {
        const localEventDate = new Date(eventInfo.event_date);
        setValue('event_date', format(localEventDate, "yyyy-MM-dd'T'HH:mm"));
        setValue('location', eventInfo.location);
        setValue('address', eventInfo.address);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la configuration",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: EventConfig) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    const event = new Date(data.event_date);

    // Convertir les dates locales en UTC pour le stockage
    const startUTC = start.toISOString();
    const endUTC = end.toISOString();
    const eventUTC = event.toISOString();

    if (end <= start) {
      toast({
        title: "Erreur de validation",
        description: "La date de fin doit être postérieure à la date de début",
        variant: "destructive",
      });
      return;
    }

    if (event <= end) {
      toast({
        title: "Attention",
        description: "L'événement devrait avoir lieu après la fin des votes",
        variant: "destructive",
      });
    }

    setLoading(true);
    try {
      const { error: votingError } = await supabase
        .from('voting_config')
        .upsert({
          start_date: startUTC,
          end_date: endUTC,
        });

      if (votingError) throw votingError;

      const { error: eventError } = await supabase
        .from('event_information')
        .upsert({
          event_date: eventUTC,
          location: data.location,
          address: data.address,
        });

      if (eventError) throw eventError;

      toast({
        title: "Succès",
        description: "La configuration a été mise à jour",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration des votes</CardTitle>
          <CardDescription>
            Définissez la période pendant laquelle les votes seront ouverts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <EventFormFields register={register} />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading || !isDirty}
                className="min-w-[150px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};