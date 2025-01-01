import { Loader2 } from "lucide-react";

export const LoadingState = ({ message = "Chargement en cours..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};