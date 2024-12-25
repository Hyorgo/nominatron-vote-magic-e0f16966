import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { register, handleSubmit, setValue } = useForm<EventConfig>();

  useEffect(() => {
    loadEventConfig();
  }, []);

  const loadEventConfig = async () => {
    try {
      // Charger la configuration des votes
      const { data: votingConfig } = await supabase
        .from('voting_config')
        .select('*')
        .single();

      // Charger les informations de l'événement
      const { data: eventInfo } = await supabase
        .from('event_information')
        .select('*')
        .single();

      if (votingConfig) {
        setValue('start_date', format(new Date(votingConfig.start_date), "yyyy-MM-dd'T'HH:mm"));
        setValue('end_date', format(new Date(votingConfig.end_date), "yyyy-MM-dd'T'HH:mm"));
      }

      if (eventInfo) {
        setValue('event_date', format(new Date(eventInfo.event_date), "yyyy-MM-dd'T'HH:mm"));
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
    setLoading(true);
    try {
      // Mettre à jour la configuration des votes
      const { error: votingError } = await supabase
        .from('voting_config')
        .upsert({
          start_date: data.start_date,
          end_date: data.end_date,
        });

      if (votingError) throw votingError;

      // Mettre à jour les informations de l'événement
      const { error: eventError } = await supabase
        .from('event_information')
        .upsert({
          event_date: data.event_date,
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
    <Card>
      <CardHeader>
        <CardTitle>Configuration de l'événement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="start_date">Date de début des votes</Label>
              <Input
                id="start_date"
                type="datetime-local"
                {...register('start_date')}
              />
            </div>

            <div>
              <Label htmlFor="end_date">Date de fin des votes</Label>
              <Input
                id="end_date"
                type="datetime-local"
                {...register('end_date')}
              />
            </div>

            <div>
              <Label htmlFor="event_date">Date de l'événement</Label>
              <Input
                id="event_date"
                type="datetime-local"
                {...register('event_date')}
              />
            </div>

            <div>
              <Label htmlFor="location">Lieu de l'événement</Label>
              <Input
                id="location"
                type="text"
                {...register('location')}
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse de l'événement</Label>
              <Input
                id="address"
                type="text"
                {...register('address')}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};