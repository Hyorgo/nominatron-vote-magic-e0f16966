import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { EventFormFields } from "./EventFormFields";

interface EventConfigFormProps {
  register: any;
  loading: boolean;
  isDirty: boolean;
  onSubmit: (data: any) => void;
}

export const EventConfigForm = ({ 
  register, 
  loading, 
  isDirty, 
  onSubmit 
}: EventConfigFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
  );
};