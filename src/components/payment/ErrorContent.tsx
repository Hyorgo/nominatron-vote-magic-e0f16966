import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorContentProps {
  onNavigateHome: () => void;
}

export const ErrorContent = ({ onNavigateHome }: ErrorContentProps) => {
  return (
    <>
      <h1 className="mb-6 text-4xl font-bold text-destructive">
        Paiement non complété
      </h1>
      <p className="mb-8 text-xl text-muted-foreground">
        Une erreur est survenue lors du traitement de votre paiement.
      </p>
      <div className="mb-12 max-w-2xl">
        <div className="mb-6 p-6 rounded-lg bg-destructive/10 backdrop-blur-sm border border-destructive/20">
          <p className="text-lg">
            <span className="block mb-2 text-destructive text-2xl">❌ Erreur de paiement</span>
            <span className="block mb-2">
              Votre carte n'a pas été débitée.
            </span>
            <span className="text-muted-foreground">
              Vous pouvez réessayer votre réservation ou nous contacter si le problème persiste.
            </span>
          </p>
        </div>
      </div>
      <Button 
        onClick={onNavigateHome}
        variant="default"
        size="lg"
      >
        <Home className="mr-2" />
        Retour à l'accueil
      </Button>
    </>
  );
};