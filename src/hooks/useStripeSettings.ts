import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type StripeSetting = Database['public']['Tables']['stripe_settings']['Row'];

interface StripeSettings {
  stripe_price_id: string;
  stripe_success_url: string;
  stripe_cancel_url: string;
}

export const useStripeSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StripeSettings>({
    stripe_price_id: "",
    stripe_success_url: "",
    stripe_cancel_url: "",
  });

  const loadStripeSettings = async () => {
    setLoading(true);
    try {
      const { data: stripeSettings, error } = await supabase
        .from('stripe_settings')
        .select("*");

      if (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
        throw error;
      }

      if (stripeSettings && stripeSettings.length > 0) {
        const settingsObject: StripeSettings = {
          stripe_price_id: "",
          stripe_success_url: "",
          stripe_cancel_url: "",
        };

        stripeSettings.forEach((setting: StripeSetting) => {
          if (setting.setting_name in settingsObject) {
            settingsObject[setting.setting_name as keyof StripeSettings] = setting.setting_value;
          }
        });

        setSettings(settingsObject);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres Stripe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les paramètres Stripe",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_name: key,
        setting_value: value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('stripe_settings')
          .upsert(update, { onConflict: 'setting_name' });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Les paramètres Stripe ont été mis à jour",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres Stripe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadStripeSettings();
  }, []);

  return {
    loading,
    saving,
    settings,
    setSettings,
    saveSettings,
  };
};