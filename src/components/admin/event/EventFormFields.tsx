import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin } from "lucide-react";

interface EventFormFieldsProps {
  register: any;
}

export const EventFormFields = ({ register }: EventFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="start_date" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Date de début des votes
        </Label>
        <Input
          id="start_date"
          type="datetime-local"
          {...register('start_date')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end_date" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Date de fin des votes
        </Label>
        <Input
          id="end_date"
          type="datetime-local"
          {...register('end_date')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event_date" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Date de l'événement
        </Label>
        <Input
          id="event_date"
          type="datetime-local"
          {...register('event_date')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
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
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
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
  );
};