import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface StripeSettingsFormProps {
  settings: {
    stripe_price_id: string;
    stripe_success_url: string;
    stripe_cancel_url: string;
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

      <Button onClick={onSave} disabled={saving}>
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
};