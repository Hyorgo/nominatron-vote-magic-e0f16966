import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/monitoring/logger';

export const useAuthAttempts = () => {
  const recordAuthAttempt = async (email: string, success: boolean) => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      const userAgent = navigator.userAgent;

      const { error } = await supabase
        .from('auth_attempts')
        .insert([{
          email,
          ip_address: ip,
          success,
          user_agent: userAgent
        }]);
      
      if (error) {
        logger.error('Erreur lors de l\'enregistrement de la tentative', { error, email });
        return;
      }
      
      logger.info('Tentative de connexion enregistrée', { email, success });
    } catch (error) {
      logger.error('Erreur lors de l\'enregistrement de la tentative', { error, email });
    }
  };

  return { recordAuthAttempt };
};