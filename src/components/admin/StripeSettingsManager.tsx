import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStripeSettings } from "@/hooks/useStripeSettings";
import { StripeSettingsForm } from "./stripe/StripeSettingsForm";

export const StripeSettingsManager = () => {
  const {
    loading,
    saving,
    settings,
    setSettings,
    saveSettings
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
      <CardContent>
        <StripeSettingsForm
          settings={settings}
          onSettingsChange={setSettings}
          onSave={saveSettings}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
};