import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EventConfig {
  start_date: string;
  end_date: string;
  event_date: string;
  location: string;
  address: string;
}

export const useEventConfig = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { isDirty } } = useForm<EventConfig>();

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

  return {
    loading,
    register,
    handleSubmit,
    isDirty,
    onSubmit,
    loadEventConfig,
  };
};