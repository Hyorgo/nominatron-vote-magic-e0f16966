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
      console.log("Chargement des paramètres Stripe...");
      const { data, error } = await supabase
        .from('stripe_settings')
        .select("*");

      if (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log("Données Stripe reçues:", data);
        const settingsMap = data.reduce((acc: Record<string, string>, curr: StripeSetting) => {
          acc[curr.setting_name] = curr.setting_value;
          return acc;
        }, {});

        console.log("Paramètres transformés:", settingsMap);

        setSettings({
          stripe_price_id: settingsMap.stripe_price_id || "",
          stripe_success_url: settingsMap.stripe_success_url || "",
          stripe_cancel_url: settingsMap.stripe_cancel_url || "",
        });
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
      console.log("Sauvegarde des paramètres:", settings);
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