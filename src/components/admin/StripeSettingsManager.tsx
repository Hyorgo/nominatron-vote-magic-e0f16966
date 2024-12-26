import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type StripeSetting = Database['public']['Tables']['stripe_settings']['Row'];

export const StripeSettingsManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    stripe_price_id: "",
    stripe_success_url: "",
    stripe_cancel_url: "",
  });

  useEffect(() => {
    loadStripeSettings();
  }, []);

  const loadStripeSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stripe_settings')
        .select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        const settingsMap = data.reduce((acc: Record<string, string>, curr: StripeSetting) => {
          acc[curr.setting_name] = curr.setting_value;
          return acc;
        }, {});

        console.log("Paramètres Stripe chargés:", settingsMap);

        setSettings({
          stripe_price_id: settingsMap.stripe_price_id || "",
          stripe_success_url: settingsMap.stripe_success_url || "",
          stripe_cancel_url: settingsMap.stripe_cancel_url || "",
        });
      } else {
        console.log("Aucun paramètre Stripe trouvé");
        toast({
          title: "Information",
          description: "Aucun paramètre Stripe n'a été configuré",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres Stripe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres Stripe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_name: key,
        setting_value: value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('stripe_settings')
          .upsert(update, { onConflict: "setting_name" });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Les paramètres Stripe ont été mis à jour",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres Stripe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stripe_price_id">ID du prix Stripe</Label>
          <Input
            id="stripe_price_id"
            value={settings.stripe_price_id}
            onChange={(e) =>
              setSettings({ ...settings, stripe_price_id: e.target.value })
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
              setSettings({ ...settings, stripe_success_url: e.target.value })
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
              setSettings({ ...settings, stripe_cancel_url: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>
  );
};