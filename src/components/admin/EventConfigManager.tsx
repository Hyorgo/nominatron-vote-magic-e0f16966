import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calendar, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

  // Watch form values for validation
  const startDate = watch('start_date');
  const endDate = watch('end_date');
  const eventDate = watch('event_date');

  useEffect(() => {
    loadEventConfig();
  }, []);

  const loadEventConfig = async () => {
    try {
      const { data: votingConfig } = await supabase
        .from('voting_config')
        .select('*')
        .single();

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
    // Validate dates
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    const event = new Date(data.event_date);

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
        variant: "warning",
      });
    }

    setLoading(true);
    try {
      const { error: votingError } = await supabase
        .from('voting_config')
        .upsert({
          start_date: data.start_date,
          end_date: data.end_date,
        });

      if (votingError) throw votingError;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start_date">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Date de début des votes
                </Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  {...register('start_date')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Date de fin des votes
                </Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  {...register('end_date')}
                />
              </div>
            </div>

            <Separator className="my-6" />

            <CardTitle className="mb-4">Informations sur l'événement</CardTitle>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event_date">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Date de l'événement
                </Label>
                <Input
                  id="event_date"
                  type="datetime-local"
                  {...register('event_date')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline-block mr-2" />
                  Lieu de l'événement
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Ex: Le Grand Hôtel"
                  {...register('location')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="w-4 h-4 inline-block mr-2" />
                  Adresse complète
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Ex: 1 rue de la Paix, 75001 Paris"
                  {...register('address')}
                />
              </div>
            </div>

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