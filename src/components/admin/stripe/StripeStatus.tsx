import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface StripeStatusProps {
  connectionStatus: string;
  onTest: () => Promise<void>;
  dashboardUrl: string;
}

export const StripeStatus = ({ connectionStatus, onTest, dashboardUrl }: StripeStatusProps) => {
  const isConnected = connectionStatus === 'connected';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">État de la connexion</h3>
          <Badge variant={isConnected ? "success" : "destructive"}>
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onTest} variant="outline">
            Tester la connexion
          </Button>
          {dashboardUrl && (
            <Button 
              variant="outline" 
              onClick={() => window.open(dashboardUrl, '_blank')}
            >
              Dashboard Stripe <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {!isConnected && (
        <Alert variant="destructive">
          <AlertDescription>
            La connexion avec Stripe n'est pas établie. Veuillez vérifier vos paramètres.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};