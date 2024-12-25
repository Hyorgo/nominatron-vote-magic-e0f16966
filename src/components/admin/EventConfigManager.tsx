import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEventConfig } from "@/hooks/useEventConfig";
import { EventConfigForm } from "./event/EventConfigForm";

export const EventConfigManager = () => {
  const { 
    loading, 
    register, 
    handleSubmit, 
    isDirty, 
    onSubmit, 
    loadEventConfig 
  } = useEventConfig();

  useEffect(() => {
    loadEventConfig();
  }, []);

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
          <EventConfigForm
            register={register}
            loading={loading}
            isDirty={isDirty}
            onSubmit={handleSubmit(onSubmit)}
          />
        </CardContent>
      </Card>
    </div>
  );
};