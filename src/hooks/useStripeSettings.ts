import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface StripeSettings {
  stripe_price_id: string;
  stripe_success_url: string;
  stripe_cancel_url: string;
  stripe_dashboard_url: string;
  stripe_price_ht: string;
  stripe_price_ttc: string;
  stripe_connection_status: string;
}

const defaultSettings: StripeSettings = {
  stripe_price_id: '',
  stripe_success_url: '',
  stripe_cancel_url: '',
  stripe_dashboard_url: '',
  stripe_price_ht: '',
  stripe_price_ttc: '',
  stripe_connection_status: 'disconnected',
};

export const useStripeSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StripeSettings>(defaultSettings);

  const checkSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: 'destructive',
        title: 'Session expirée',
        description: 'Veuillez vous reconnecter',
      });
      navigate('/');
      return false;
    }
    return true;
  }, [toast, navigate]);

  const loadStripeSettings = useCallback(async () => {
    try {
      const hasValidSession = await checkSession();
      if (!hasValidSession) {
        setLoading(false);
        return;
      }

      const { data: stripeSettings, error } = await supabase
        .from('stripe_settings')
        .select('*');

      if (error) throw error;

      if (stripeSettings && stripeSettings.length > 0) {
        const settingsObject = { ...defaultSettings };
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
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les paramètres Stripe',
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
        title: 'Succès',
        description: 'Les paramètres Stripe ont été mis à jour',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres Stripe:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres',
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    try {
      const hasValidSession = await checkSession();
      if (!hasValidSession) return;

      const response = await supabase.functions.invoke('test-stripe-connection');
      const { success, message } = response.data;
      
      setSettings(prev => ({
        ...prev,
        stripe_connection_status: success ? 'connected' : 'disconnected'
      }));

      toast({
        title: success ? 'Succès' : 'Erreur',
        description: message,
        variant: success ? 'default' : 'destructive',
      });

      if (success) {
        const { error } = await supabase
          .from('stripe_settings')
          .upsert({ 
            setting_name: 'stripe_connection_status', 
            setting_value: 'connected' 
          }, { onConflict: 'setting_name' });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erreur lors du test de connexion:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de tester la connexion Stripe',
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
    testConnection,
  };
};