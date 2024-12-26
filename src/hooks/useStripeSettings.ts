import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';
import { stripeService } from '@/services/stripeService';
import { StripeSettings, defaultStripeSettings } from '@/types/stripe';

export const useStripeSettings = () => {
  const { toast } = useToast();
  const { checkSession } = useAuthSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StripeSettings>(defaultStripeSettings);

  const loadStripeSettings = useCallback(async () => {
    try {
      const hasValidSession = await checkSession();
      if (!hasValidSession) {
        setLoading(false);
        return;
      }

      const stripeSettings = await stripeService.loadSettings();

      if (stripeSettings && stripeSettings.length > 0) {
        const settingsObject = { ...defaultStripeSettings };
        stripeSettings.forEach((setting) => {
          if (setting.setting_name in settingsObject) {
            settingsObject[setting.setting_name as keyof StripeSettings] = setting.setting_value;
          }
        });
        setSettings(settingsObject);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres Stripe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres Stripe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [checkSession, toast]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const hasValidSession = await checkSession();
      if (!hasValidSession) return;

      await stripeService.saveSettings(settings);

      toast({
        title: "Succès",
        description: "Paramètres Stripe sauvegardés avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres Stripe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testStripeConnection = async () => {
    try {
      const hasValidSession = await checkSession();
      if (!hasValidSession) return;

      const { success, message } = await stripeService.testConnection();

      if (success) {
        setSettings(prev => ({
          ...prev,
          stripe_connection_status: 'connected'
        }));
      }

      toast({
        title: success ? "Succès" : "Erreur",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Erreur lors du test de connexion Stripe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de tester la connexion Stripe",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadStripeSettings();
  }, [loadStripeSettings]);

  return {
    loading,
    saving,
    settings,
    setSettings,
    saveSettings,
    testStripeConnection,
  };
};