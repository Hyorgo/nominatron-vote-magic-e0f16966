import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStripeSettings } from "@/hooks/useStripeSettings";
import { StripeSettingsForm } from "./stripe/StripeSettingsForm";
import { StripeStatus } from "./stripe/StripeStatus";
import { StripeTransactions } from "./stripe/StripeTransactions";
import { Separator } from "@/components/ui/separator";

export const StripeSettingsManager = () => {
  const {
    loading,
    saving,
    settings,
    setSettings,
    saveSettings,
    testStripeConnection
  } = useStripeSettings();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuration Stripe</CardTitle>
        </CardHeader>
        <CardContent>
          Chargement des paramètres...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Stripe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StripeStatus 
          connectionStatus={settings.stripe_connection_status} 
          onTest={testStripeConnection}
          dashboardUrl={settings.stripe_dashboard_url}
        />
        <Separator />
        <StripeSettingsForm
          settings={settings}
          onSettingsChange={setSettings}
          onSave={saveSettings}
          saving={saving}
        />
        <Separator />
        <StripeTransactions />
      </CardContent>
    </Card>
  );
};