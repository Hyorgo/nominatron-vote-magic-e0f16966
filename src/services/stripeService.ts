import { supabase } from '@/integrations/supabase/client';
import { StripeSettings } from '@/types/stripe';

export const stripeService = {
  async loadSettings() {
    const { data, error } = await supabase
      .from('stripe_settings')
      .select('setting_name, setting_value');
    
    if (error) throw error;
    return data;
  },

  async saveSettings(settings: StripeSettings) {
    const updates = Object.entries(settings).map(([setting_name, setting_value]) => ({
      setting_name,
      setting_value: String(setting_value),
    }));

    const { error } = await supabase
      .from('stripe_settings')
      .upsert(updates, { onConflict: 'setting_name' });

    if (error) throw error;
  },

  async testConnection() {
    const { data, error } = await supabase.functions.invoke('test-stripe-connection');
    if (error) throw error;
    return data;
  }
};