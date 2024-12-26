import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StripeSettingsFormProps {
  settings: {
    stripe_price_id: string;
    stripe_success_url: string;
    stripe_cancel_url: string;
    stripe_price_ht: string;
    stripe_price_ttc: string;
    stripe_dashboard_url: string;
  };
  onSettingsChange: (settings: any) => void;
  onSave: () => void;
  saving: boolean;
}

export const StripeSettingsForm = ({
  settings,
  onSettingsChange,
  onSave,
  saving
}: StripeSettingsFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripe_price_ht">Prix HT (€)</Label>
                <Input
                  id="stripe_price_ht"
                  value={settings.stripe_price_ht}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, stripe_price_ht: e.target.value })
                  }
                  placeholder="160.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripe_price_ttc">Prix TTC (€)</Label>
                <Input
                  id="stripe_price_ttc"
                  value={settings.stripe_price_ttc}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, stripe_price_ttc: e.target.value })
                  }
                  placeholder="192.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripe_price_id">ID du prix Stripe</Label>
                <Input
                  id="stripe_price_id"
                  value={settings.stripe_price_id}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, stripe_price_id: e.target.value })
                  }
                  placeholder="price_..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripe_dashboard_url">URL du Dashboard Stripe</Label>
                <Input
                  id="stripe_dashboard_url"
                  value={settings.stripe_dashboard_url}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, stripe_dashboard_url: e.target.value })
                  }
                  placeholder="https://dashboard.stripe.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe_success_url">URL de succès</Label>
              <Input
                id="stripe_success_url"
                value={settings.stripe_success_url}
                onChange={(e) =>
                  onSettingsChange({ ...settings, stripe_success_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_cancel_url">URL d'annulation</Label>
              <Input
                id="stripe_cancel_url"
                value={settings.stripe_cancel_url}
                onChange={(e) =>
                  onSettingsChange({ ...settings, stripe_cancel_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
};